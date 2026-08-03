import {
  waitForSelector,
  waitForVisible,
  waitForGone,
  waitForValue,
  waitForURL,
  waitForText,
  waitFor,
  type WaitOptions,
} from "./wait";
import {
  getByRole,
  getByRoleWithin,
  queryByRole,
  queryByRoleWithin,
  getByText,
  getByTextWithin,
  queryByText,
  queryByTextWithin,
  getByLabelText,
  getByLabelTextWithin,
  queryByLabelText,
  queryByLabelTextWithin,
  getByPlaceholderText,
  getByPlaceholderTextWithin,
  queryByPlaceholderText,
  queryByPlaceholderTextWithin,
  getByTestId,
  getByTestIdWithin,
  queryByTestId,
  queryByTestIdWithin,
  getByAltText,
  getByTitle,
  type QueryMatcher,
  type QueryOptions,
  type RoleOptions,
} from "./query";
import { ensureInjected } from "./inject";
import { EvaluateQueue } from "./evaluate-queue";
import { renderDebug, type DebugOptions } from "./debug";
import type { CookieState } from "./browser-context";
import {
  Locator,
  type InternalLocatorScreenshotOptions,
  type LocatorAdapter,
} from "./locator";
import type { SerializedRouteMock } from "./network";
import type { BrowserContext, StorageState } from "./browser-context";
import { PNG } from "pngjs";

function formatMatcher(value: QueryMatcher): string {
  return value instanceof RegExp ? String(value) : `"${value}"`;
}

export class Page {
  // Private so tests never access the view directly
  readonly #view: Bun.WebView;
  readonly #url: string;
  readonly #queue: EvaluateQueue;
  readonly #options: PageOptions;
  #mockRoutes: SerializedRouteMock[] = [];
  #storageState: StorageState = { cookies: [], origins: [] };
  #context: BrowserContext | null = null;
  #closed = false;

  private constructor(view: Bun.WebView, url: string, options: PageOptions) {
    this.#view = view;
    this.#url = url;
    this.#queue = new EvaluateQueue();
    this.#options = options;
  }

  // -------------------------
  // Factory
  // -------------------------

  /**
   * Launch a new page and wait for it to load.
   * Use with `await using` for automatic cleanup.
   *
   * const page = await Page.launch("https://example.com");
   * await using page = await Page.launch("https://example.com");
   */
  static async launch(url: string, options: PageOptions = {}): Promise<Page> {
    const view = new Bun.WebView({
      width: options.width ?? 1280,
      height: options.height ?? 720,
      console: options.debug ? globalThis.console : undefined,
    });

    const page = new Page(view, url, options);

    view.onNavigated = async () => {
      try {
        await ensureInjected(view, page.#queue);
        await page.syncMockRoutes(page.#mockRoutes);
        await page.syncStorageState(page.#storageState);
      } catch {
        // Navigation may have changed again before injection completed
      }
    };

    await view.navigate(url);
    return page;
  }

  // -------------------------
  // Lifecycle
  // -------------------------

  /**
   * Close the page and its underlying browser process.
   * Called automatically when using `await using`.
   */
  close(): void {
    if (this.#closed) return;
    this.#closed = true;
    this.#view.close();
  }

  // Support `await using page = await Page.launch(...)`
  [Symbol.asyncDispose](): Promise<void> {
    this.close();
    return Promise.resolve();
  }

  // Support `using page = ...` (sync dispose)
  [Symbol.dispose](): void {
    this.close();
  }

  // -------------------------
  // Navigation
  // -------------------------

  async navigate(url: string): Promise<void> {
    await this.#view.navigate(this.#resolveURL(url));
  }

  async goto(url: string): Promise<void> {
    await this.navigate(url);
  }

  async reload(): Promise<void> {
    await this.#view.reload();
  }

  get url(): string {
    return this.#view.url;
  }

  get title(): string {
    return this.#view.title;
  }

  get isClosed(): boolean {
    return this.#closed;
  }

  context(): BrowserContext | null {
    return this.#context;
  }

  // -------------------------
  // Screenshot
  // -------------------------

  async screenshotBytes(options: PageScreenshotOptions = {}): Promise<Blob> {
    const maskId = await this.#applyScreenshotMasks(
      options.maskSelectors ?? [],
    );

    try {
      const clip = options.clipSelector
        ? await this.#getScreenshotClip(
            options.clipSelector,
            options.clipPadding ?? 0,
          )
        : null;
      const image = await this.#view.screenshot({ format: "png" });
      return clip ? await cropScreenshot(image, clip) : image;
    } finally {
      if (maskId) {
        await this.#removeScreenshotMasks(maskId);
      }
    }
  }

  async screenshot(path: string): Promise<void> {
    await Bun.write(path, await this.screenshotBytes());
  }

  /**
   * Internal — called automatically when an action throws.
   * Saves a timestamped screenshot next to the test file.
   */
  async #slowMo(): Promise<void> {
    if (this.#options.slowMo) await Bun.sleep(this.#options.slowMo);
  }

  async #screenshotOnFailure(context: string): Promise<void> {
    try {
      const filename = `failure-${context}-${Date.now()}.png`;
      await Bun.write(filename, await this.screenshotBytes());
      console.error(`  📸 Screenshot saved: ${filename}`);
    } catch {
      // Don't let screenshot failure mask the original error
    }
  }

  // -------------------------
  // Evaluate
  // -------------------------

  /**
   * Run a JS expression inside the page and return its result.
   * The result must be JSON-serializable — never return DOM elements.
   *
   * const title = await page.evaluate("document.title");
   */
  async evaluate<T = unknown>(script: string): Promise<T> {
    return this.#queue.run(() => this.#view.evaluate(script) as Promise<T>);
  }

  #locatorAdapter(): LocatorAdapter {
    return {
      click: (selector, options = {}) => this.click(selector, options),
      screenshot: (selector, options: InternalLocatorScreenshotOptions = {}) =>
        this.screenshotBytes({
          clipSelector: selector,
          clipPadding: options.padding,
          maskSelectors: options.maskSelectors,
        }),
      debug: (selector, options = {}, description) =>
        this.#debug(selector, options, description),
      fill: (selector, text, options = {}) =>
        this.fill(selector, text, options),
      press: (key, options = {}) => this.press(key, options),
      evaluate: <T>(script: string) => this.evaluate<T>(script),
      count: (selector) =>
        this.#queue.run(
          () =>
            this.#view.evaluate(
              `document.querySelectorAll(${JSON.stringify(selector)}).length`,
            ) as Promise<number>,
        ),
      nth: (selector, index) => this.#nthSelector(selector, index),
      getByRole: (parentSelector, role, options = {}) =>
        getByRoleWithin(this.#view, this.#queue, parentSelector, role, options),
      queryByRole: (parentSelector, role, options = {}) =>
        queryByRoleWithin(
          this.#view,
          this.#queue,
          parentSelector,
          role,
          options,
        ),
      getByText: (parentSelector, text, options = {}) =>
        getByTextWithin(this.#view, this.#queue, parentSelector, text, options),
      queryByText: (parentSelector, text, options = {}) =>
        queryByTextWithin(
          this.#view,
          this.#queue,
          parentSelector,
          text,
          options,
        ),
      getByLabelText: (parentSelector, text, options = {}) =>
        getByLabelTextWithin(
          this.#view,
          this.#queue,
          parentSelector,
          text,
          options,
        ),
      queryByLabelText: (parentSelector, text, options = {}) =>
        queryByLabelTextWithin(
          this.#view,
          this.#queue,
          parentSelector,
          text,
          options,
        ),
      getByPlaceholderText: (parentSelector, text, options = {}) =>
        getByPlaceholderTextWithin(
          this.#view,
          this.#queue,
          parentSelector,
          text,
          options,
        ),
      queryByPlaceholderText: (parentSelector, text, options = {}) =>
        queryByPlaceholderTextWithin(
          this.#view,
          this.#queue,
          parentSelector,
          text,
          options,
        ),
      getByTestId: (parentSelector, testId, options = {}) =>
        getByTestIdWithin(
          this.#view,
          this.#queue,
          parentSelector,
          testId,
          options,
        ),
      queryByTestId: (parentSelector, testId, options = {}) =>
        queryByTestIdWithin(
          this.#view,
          this.#queue,
          parentSelector,
          testId,
          options,
        ),
    };
  }

  locator(selector: string): Locator {
    return new Locator(this.#locatorAdapter(), {
      description: `selector "${selector}"`,
      resolve: async () => {
        await waitForSelector(this.#view, this.#queue, selector);
        return selector;
      },
      query: async () => {
        const exists = await this.#queue.run(
          () =>
            this.#view.evaluate(
              `!!document.querySelector(${JSON.stringify(selector)})`,
            ) as Promise<boolean>,
        );
        return exists ? selector : null;
      },
      count: () => this.#locatorAdapter().count(selector),
      nth: (index) => this.#locatorAdapter().nth(selector, index),
    });
  }

  byRole(role: string, options: RoleOptions = {}): Locator {
    return new Locator(this.#locatorAdapter(), {
      description: `role="${role}"${options.name ? ` name=${formatMatcher(options.name)}` : ""}`,
      resolve: () => getByRole(this.#view, this.#queue, role, options),
      query: () => queryByRole(this.#view, this.#queue, role, options),
      count: async () =>
        (await queryByRole(this.#view, this.#queue, role, options)) ? 1 : 0,
      nth: async (index) =>
        index === 0
          ? queryByRole(this.#view, this.#queue, role, options)
          : null,
    });
  }

  byText(text: QueryMatcher, options: QueryOptions = {}): Locator {
    return new Locator(this.#locatorAdapter(), {
      description: `text=${formatMatcher(text)}`,
      resolve: () => getByText(this.#view, this.#queue, text, options),
      query: () => queryByText(this.#view, this.#queue, text, options),
      count: async () =>
        (await queryByText(this.#view, this.#queue, text, options)) ? 1 : 0,
      nth: async (index) =>
        index === 0
          ? queryByText(this.#view, this.#queue, text, options)
          : null,
    });
  }

  byLabelText(text: QueryMatcher, options: QueryOptions = {}): Locator {
    return new Locator(this.#locatorAdapter(), {
      description: `label=${formatMatcher(text)}`,
      resolve: () => getByLabelText(this.#view, this.#queue, text, options),
      query: () => queryByLabelText(this.#view, this.#queue, text, options),
      count: async () =>
        (await queryByLabelText(this.#view, this.#queue, text, options))
          ? 1
          : 0,
      nth: async (index) =>
        index === 0
          ? queryByLabelText(this.#view, this.#queue, text, options)
          : null,
    });
  }

  byPlaceholderText(text: QueryMatcher, options: QueryOptions = {}): Locator {
    return new Locator(this.#locatorAdapter(), {
      description: `placeholder=${formatMatcher(text)}`,
      resolve: () =>
        getByPlaceholderText(this.#view, this.#queue, text, options),
      query: () =>
        queryByPlaceholderText(this.#view, this.#queue, text, options),
      count: async () =>
        (await queryByPlaceholderText(this.#view, this.#queue, text, options))
          ? 1
          : 0,
      nth: async (index) =>
        index === 0
          ? queryByPlaceholderText(this.#view, this.#queue, text, options)
          : null,
    });
  }

  byTestId(testId: string, options: QueryOptions = {}): Locator {
    return new Locator(this.#locatorAdapter(), {
      description: `testId="${testId}"`,
      resolve: () => getByTestId(this.#view, this.#queue, testId, options),
      query: () => queryByTestId(this.#view, this.#queue, testId, options),
      count: async () =>
        (await queryByTestId(this.#view, this.#queue, testId, options)) ? 1 : 0,
      nth: async (index) =>
        index === 0
          ? queryByTestId(this.#view, this.#queue, testId, options)
          : null,
    });
  }

  async waitForRequest(
    matcher: NetworkMatcher<NetworkRequest>,
    options: WaitOptions = {},
  ): Promise<NetworkRequest> {
    return this.#waitForNetworkEvent("request", matcher, options);
  }

  async waitForResponse(
    matcher: NetworkMatcher<NetworkResponse>,
    options: WaitOptions = {},
  ): Promise<NetworkResponse> {
    return this.#waitForNetworkEvent("response", matcher, options);
  }

  async debug(options: DebugOptions = {}): Promise<string> {
    return this.#debug(undefined, options);
  }

  // -------------------------
  // Actions
  // -------------------------

  /**
   * Click an element by CSS selector.
   * Automatically waits for the element to be actionable.
   */
  async click(selector: string, options: ClickOptions = {}): Promise<void> {
    await this.#slowMo();
    try {
      await this.#view.click(selector, { timeout: options.timeout ?? 10_000 });
    } catch (err) {
      await this.#screenshotOnFailure(`click-${selectorToFilename(selector)}`);
      throw enrichError(err, `click("${selector}")`);
    }
  }

  /**
   * Type text into the currently focused element.
   */
  async type(text: string): Promise<void> {
    try {
      await this.#view.type(text);
    } catch (err) {
      await this.#screenshotOnFailure("type");
      throw enrichError(err, `type("${text}")`);
    }
  }

  /**
   * Press a named key (e.g. "Enter", "Escape", "ArrowDown").
   */
  async press(key: string, options: PressOptions = {}): Promise<void> {
    await this.#slowMo();
    try {
      await this.#view.press(key, options);
    } catch (err) {
      await this.#screenshotOnFailure(`press-${key}`);
      throw enrichError(err, `press("${key}")`);
    }
  }

  /**
   * Click an element, type text into it, then wait for the value to land.
   * This is the safe way to fill inputs — guarantees typing is complete
   * before the next action runs.
   */
  async fill(
    selector: string,
    text: string,
    options: FillOptions = {},
  ): Promise<void> {
    await this.#slowMo();
    try {
      // click() auto-waits for actionability
      await this.#view.click(selector, { timeout: options.timeout ?? 10_000 });

      // Clear existing value programmatically so the field is empty before typing
      await this.#queue.run(() =>
        this.#view.evaluate(`(function() {
          var el = document.querySelector(${JSON.stringify(selector)});
          if (el) el.value = "";
        })()`),
      );

      // Type the new value (skip if empty — the field is already cleared)
      if (text) {
        await this.#view.type(text);
      }

      // Confirm the value landed before continuing
      await waitForValue(this.#view, this.#queue, selector, text, {
        timeout: options.timeout ?? 5_000,
      });
    } catch (err) {
      await this.#screenshotOnFailure(`fill-${selectorToFilename(selector)}`);
      throw enrichError(err, `fill("${selector}", "${text}")`);
    }
  }

  /**
   * Click and wait for either a URL change or a new element to appear.
   * Use this for buttons that trigger navigation or async state changes.
   */
  async clickAndWait(
    selector: string,
    waitFor: { url?: string | RegExp; selector?: string },
    options: ClickOptions = {},
  ): Promise<void> {
    try {
      await this.#view.click(selector, { timeout: options.timeout ?? 10_000 });

      if (waitFor.url) {
        await waitForURL(this.#view, waitFor.url);
      } else if (waitFor.selector) {
        await waitForSelector(this.#view, this.#queue, waitFor.selector);
      }
    } catch (err) {
      await this.#screenshotOnFailure(
        `clickAndWait-${selectorToFilename(selector)}`,
      );
      throw enrichError(err, `clickAndWait("${selector}")`);
    }
  }

  /**
   * Select an option in a <select> element by its visible text.
   */
  async selectOption(selector: string, text: string): Promise<void> {
    try {
      await this.waitForSelector(selector);
      await this.#queue.run(() =>
        this.#view.evaluate(`(function() {
        var select = document.querySelector(${JSON.stringify(selector)});
        if (!select) return;
        var options = Array.from(select.options);
        var match = options.find(function(o) { return o.text === ${JSON.stringify(text)}; });
        if (match) select.value = match.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      })()`),
      );
    } catch (err) {
      await this.#screenshotOnFailure(`select-${selectorToFilename(selector)}`);
      throw enrichError(err, `selectOption("${selector}", "${text}")`);
    }
  }

  /**
   * Check or uncheck a checkbox.
   */
  async setChecked(selector: string, checked: boolean): Promise<void> {
    try {
      await this.waitForSelector(selector);
      const current = await this.#queue.run(
        () =>
          this.#view.evaluate(
            `!!document.querySelector(${JSON.stringify(selector)})?.checked`,
          ) as Promise<boolean>,
      );
      if (current !== checked) {
        await this.#view.click(selector);
      }
    } catch (err) {
      await this.#screenshotOnFailure(
        `setChecked-${selectorToFilename(selector)}`,
      );
      throw enrichError(err, `setChecked("${selector}", ${checked})`);
    }
  }

  // -------------------------
  // Waiting primitives
  // -------------------------

  async waitForSelector(
    selector: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForSelector(this.#view, this.#queue, selector, options);
    } catch (err) {
      await this.#screenshotOnFailure(`wait-${selectorToFilename(selector)}`);
      throw enrichError(err, `waitForSelector("${selector}")`);
    }
  }

  async waitForVisible(
    selector: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForVisible(this.#view, this.#queue, selector, options);
    } catch (err) {
      await this.#screenshotOnFailure(
        `wait-visible-${selectorToFilename(selector)}`,
      );
      throw enrichError(err, `waitForVisible("${selector}")`);
    }
  }

  async waitForGone(
    selector: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForGone(this.#view, this.#queue, selector, options);
    } catch (err) {
      await this.#screenshotOnFailure(
        `wait-gone-${selectorToFilename(selector)}`,
      );
      throw enrichError(err, `waitForGone("${selector}")`);
    }
  }

  async waitForValue(
    selector: string,
    expected: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForValue(this.#view, this.#queue, selector, expected, options);
    } catch (err) {
      await this.#screenshotOnFailure(
        `wait-value-${selectorToFilename(selector)}`,
      );
      throw enrichError(err, `waitForValue("${selector}", "${expected}")`);
    }
  }

  async waitForURL(
    pattern: string | RegExp,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForURL(this.#view, pattern, options);
    } catch (err) {
      await this.#screenshotOnFailure("wait-url");
      throw enrichError(err, `waitForURL(${pattern})`);
    }
  }

  async waitForText(
    selector: string,
    pattern: string | RegExp,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForText(this.#view, this.#queue, selector, pattern, options);
    } catch (err) {
      await this.#screenshotOnFailure(
        `wait-text-${selectorToFilename(selector)}`,
      );
      throw enrichError(err, `waitForText("${selector}", ${pattern})`);
    }
  }

  async waitFor(script: string, options: WaitOptions = {}): Promise<void> {
    try {
      await waitFor(this.#view, this.#queue, script, options);
    } catch (err) {
      await this.#screenshotOnFailure("wait-custom");
      throw enrichError(err, `waitFor(${script})`);
    }
  }

  // -------------------------
  // Queries (Testing Library)
  // -------------------------

  /**
   * Re-inject Testing Library after a navigation.
   * Called automatically — but you can call it manually if needed.
   */
  async ensureInjected(): Promise<void> {
    await ensureInjected(this.#view, this.#queue);
  }

  attachContext(context: BrowserContext): void {
    this.#context = context;
  }

  async syncMockRoutes(routes: SerializedRouteMock[]): Promise<void> {
    this.#mockRoutes = routes;
    if (this.#closed) return;

    await ensureInjected(this.#view, this.#queue);
    await this.#queue.run(() =>
      this.#view.evaluate(`(() => {
        if (!window.__BUN_E2E_NETWORK__) return;
        window.__BUN_E2E_NETWORK__.routes = ${JSON.stringify(routes)};
      })()`),
    );
  }

  async syncStorageState(state: StorageState): Promise<void> {
    this.#storageState = state;
    if (this.#closed) return;

    await ensureInjected(this.#view, this.#queue);
    const currentOrigin = safeOrigin(this.#view.url);
    if (!currentOrigin) return;

    const originState = state.origins.find(
      (entry) => entry.origin === currentOrigin,
    );
    const cookies = state.cookies.filter((cookie) => {
      if (!cookie.domain) return true;
      return currentOrigin.includes(cookie.domain);
    });

    await this.#queue.run(() =>
      this.#view.evaluate(`(() => {
        const originState = ${JSON.stringify(originState ?? null)};
        const cookies = ${JSON.stringify(cookies)};
        try {
          localStorage.clear();
          sessionStorage.clear();
          if (originState) {
            for (const item of originState.localStorage) {
              localStorage.setItem(item.name, item.value);
            }
            for (const item of originState.sessionStorage) {
              sessionStorage.setItem(item.name, item.value);
            }
          }
          for (const cookie of cookies) {
            document.cookie = cookie.name + "=" + cookie.value + "; path=" + (cookie.path ?? "/");
          }
        } catch {}
      })()`),
    );
  }

  async readStorageState(): Promise<StorageState> {
    const origin = safeOrigin(this.#view.url);
    if (!origin) return { cookies: [], origins: [] };

    const snapshot = await this.#queue.run(
      () =>
        this.#view.evaluate(`(() => {
          try {
            const origin = location.origin;
            const localStorageItems = [];
            const sessionStorageItems = [];
            for (let index = 0; index < localStorage.length; index++) {
              const key = localStorage.key(index);
              if (key !== null) {
                localStorageItems.push({ name: key, value: localStorage.getItem(key) ?? "" });
              }
            }
            for (let index = 0; index < sessionStorage.length; index++) {
              const key = sessionStorage.key(index);
              if (key !== null) {
                sessionStorageItems.push({ name: key, value: sessionStorage.getItem(key) ?? "" });
              }
            }
            return {
              origin,
              localStorage: localStorageItems,
              sessionStorage: sessionStorageItems,
              cookies: document.cookie,
            };
          } catch {
            return null;
          }
        })()`) as Promise<{
          origin: string;
          localStorage: StorageItemState[];
          sessionStorage: StorageItemState[];
          cookies: string;
        } | null>,
    );

    if (!snapshot) return { cookies: [], origins: [] };

    return {
      cookies: parseCookieHeader(snapshot.cookies, snapshot.origin),
      origins: [
        {
          origin: snapshot.origin,
          localStorage: snapshot.localStorage,
          sessionStorage: snapshot.sessionStorage,
        },
      ],
    };
  }

  async route(...args: Parameters<BrowserContext["route"]>): Promise<void> {
    if (!this.#context) {
      throw new Error("Page.route() requires a BrowserContext-owned page");
    }
    await this.#context.route(...args);
  }

  async unroute(...args: Parameters<BrowserContext["unroute"]>): Promise<void> {
    if (!this.#context) {
      throw new Error("Page.unroute() requires a BrowserContext-owned page");
    }
    await this.#context.unroute(...args);
  }

  async getByRole(role: string, options: RoleOptions = {}): Promise<string> {
    try {
      return await getByRole(this.#view, this.#queue, role, options);
    } catch (err) {
      throw enrichError(err, `getByRole("${role}")`);
    }
  }

  async queryByRole(
    role: string,
    options: RoleOptions = {},
  ): Promise<string | null> {
    return queryByRole(this.#view, this.#queue, role, options);
  }

  async getByText(
    text: QueryMatcher,
    options: QueryOptions = {},
  ): Promise<string> {
    try {
      return await getByText(this.#view, this.#queue, text, options);
    } catch (err) {
      throw enrichError(err, `getByText(${formatMatcher(text)})`);
    }
  }

  async queryByText(
    text: QueryMatcher,
    options: QueryOptions = {},
  ): Promise<string | null> {
    return queryByText(this.#view, this.#queue, text, options);
  }

  async getByLabelText(
    text: QueryMatcher,
    options: QueryOptions = {},
  ): Promise<string> {
    try {
      return await getByLabelText(this.#view, this.#queue, text, options);
    } catch (err) {
      throw enrichError(err, `getByLabelText(${formatMatcher(text)})`);
    }
  }

  async queryByLabelText(
    text: QueryMatcher,
    options: QueryOptions = {},
  ): Promise<string | null> {
    return queryByLabelText(this.#view, this.#queue, text, options);
  }

  async getByPlaceholderText(
    text: QueryMatcher,
    options: QueryOptions = {},
  ): Promise<string> {
    try {
      return await getByPlaceholderText(this.#view, this.#queue, text, options);
    } catch (err) {
      throw enrichError(err, `getByPlaceholderText(${formatMatcher(text)})`);
    }
  }

  async getByTestId(
    testId: string,
    options: QueryOptions = {},
  ): Promise<string> {
    try {
      return await getByTestId(this.#view, this.#queue, testId, options);
    } catch (err) {
      throw enrichError(err, `getByTestId("${testId}")`);
    }
  }

  async queryByTestId(
    testId: string,
    options: QueryOptions = {},
  ): Promise<string | null> {
    return queryByTestId(this.#view, this.#queue, testId, options);
  }

  async getByAltText(
    text: string,
    options: QueryOptions = {},
  ): Promise<string> {
    try {
      return await getByAltText(this.#view, this.#queue, text, options);
    } catch (err) {
      throw enrichError(err, `getByAltText("${text}")`);
    }
  }

  async getByTitle(text: string, options: QueryOptions = {}): Promise<string> {
    try {
      return await getByTitle(this.#view, this.#queue, text, options);
    } catch (err) {
      throw enrichError(err, `getByTitle("${text}")`);
    }
  }

  // -------------------------
  // Assertions
  // -------------------------

  /**
   * Assert an element exists in the DOM within the timeout.
   */
  async assertExists(
    selector: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForSelector(this.#view, this.#queue, selector, options);
    } catch {
      await this.#screenshotOnFailure(
        `assert-exists-${selectorToFilename(selector)}`,
      );
      throw new Error(`[assertExists] Element not found: "${selector}"`);
    }
  }

  /**
   * Assert an element does NOT exist in the DOM.
   */
  async assertAbsent(
    selector: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForGone(this.#view, this.#queue, selector, options);
    } catch {
      await this.#screenshotOnFailure(
        `assert-absent-${selectorToFilename(selector)}`,
      );
      throw new Error(`[assertAbsent] Element still present: "${selector}"`);
    }
  }

  /**
   * Assert an element's text content matches within the timeout.
   */
  async assertText(
    selector: string,
    pattern: string | RegExp,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForText(this.#view, this.#queue, selector, pattern, options);
    } catch {
      const actual = await this.#queue.run(
        () =>
          this.#view.evaluate(
            `document.querySelector(${JSON.stringify(selector)})?.textContent?.trim() ?? "(not found)"`,
          ) as Promise<string>,
      );
      await this.#screenshotOnFailure(
        `assert-text-${selectorToFilename(selector)}`,
      );
      throw new Error(
        `[assertText] Expected "${selector}" to match ${pattern}, got: "${actual}"`,
      );
    }
  }

  /**
   * Assert an input's value matches within the timeout.
   */
  async assertValue(
    selector: string,
    expected: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForValue(this.#view, this.#queue, selector, expected, options);
    } catch {
      const actual = await this.#queue.run(
        () =>
          this.#view.evaluate(
            `document.querySelector(${JSON.stringify(selector)})?.value ?? "(not found)"`,
          ) as Promise<string>,
      );
      await this.#screenshotOnFailure(
        `assert-value-${selectorToFilename(selector)}`,
      );
      throw new Error(
        `[assertValue] Expected value "${expected}", got: "${actual}"`,
      );
    }
  }

  /**
   * Assert the current URL matches a string or RegExp.
   */
  async assertURL(
    pattern: string | RegExp,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForURL(this.#view, pattern, options);
    } catch {
      await this.#screenshotOnFailure("assert-url");
      throw new Error(
        `[assertURL] Expected URL to match ${pattern}, got: "${this.#view.url}"`,
      );
    }
  }

  /**
   * Assert an element is visible within the timeout.
   */
  async assertVisible(
    selector: string,
    options: WaitOptions = {},
  ): Promise<void> {
    try {
      await waitForVisible(this.#view, this.#queue, selector, options);
    } catch {
      await this.#screenshotOnFailure(
        `assert-visible-${selectorToFilename(selector)}`,
      );
      throw new Error(`[assertVisible] Element not visible: "${selector}"`);
    }
  }

  async #waitForNetworkEvent<TEvent extends NetworkEvent>(
    kind: TEvent["kind"],
    matcher: NetworkMatcher<TEvent>,
    options: WaitOptions,
  ): Promise<TEvent> {
    await ensureInjected(this.#view, this.#queue);
    const startId = await this.#queue.run(
      () =>
        this.#view.evaluate(
          `window.__BUN_E2E_NETWORK__?.nextId ?? 1`,
        ) as Promise<number>,
    );

    let matched: TEvent | null = null;
    await waitFor(
      this.#view,
      this.#queue,
      `(() => {
        const state = window.__BUN_E2E_NETWORK__;
        return !!state && state.events.some((event) => event.id >= ${startId} && event.kind === ${JSON.stringify(kind)});
      })()`,
      { ...options, timeout: options.timeout ?? 10_000 },
    ).catch(async () => {
      const events = (await this.#networkEventsAfter(
        startId,
        kind,
      )) as TEvent[];
      matched =
        events.find((event) => matchesNetworkEvent(event, matcher)) ?? null;
      if (!matched) {
        throw new Error(
          `Timed out after ${options.timeout ?? 10_000}ms waiting for: ${kind}`,
        );
      }
    });

    if (!matched) {
      await waitForSelector(this.#view, this.#queue, "body", { timeout: 1 });
      const events = (await this.#networkEventsAfter(
        startId,
        kind,
      )) as TEvent[];
      matched =
        events.find((event) => matchesNetworkEvent(event, matcher)) ?? null;
    }

    if (!matched) {
      throw new Error(`Timed out waiting for ${kind}`);
    }

    return matched;
  }

  async #networkEventsAfter(
    startId: number,
    kind: NetworkEvent["kind"],
  ): Promise<NetworkEvent[]> {
    return this.#queue.run(
      () =>
        this.#view.evaluate(`(() => {
          const state = window.__BUN_E2E_NETWORK__;
          if (!state) return [];
          return state.events.filter((event) => event.id >= ${startId} && event.kind === ${JSON.stringify(kind)});
        })()`) as Promise<NetworkEvent[]>,
    );
  }

  #resolveURL(url: string): string {
    if (!this.#options.baseURL) return url;

    try {
      return new URL(url, this.#options.baseURL).toString();
    } catch {
      return url;
    }
  }

  async #nthSelector(selector: string, index: number): Promise<string | null> {
    return this.#queue.run(
      () =>
        this.#view.evaluate(`(() => {
          const matches = document.querySelectorAll(${JSON.stringify(selector)});
          const el = matches[${index}] ?? null;
          if (!el) return null;
          const ref = "bun-nth-" + Math.random().toString(36).slice(2, 9);
          el.setAttribute("data-bun-tl-ref", ref);
          return "[data-bun-tl-ref='" + ref + "']";
        })()`) as Promise<string | null>,
    );
  }

  async #applyScreenshotMasks(selectors: string[]): Promise<string | null> {
    if (selectors.length === 0) return null;

    return this.#queue.run(
      () =>
        this.#view.evaluate(`(() => {
        const selectors = ${JSON.stringify(selectors)};
        const id = "bun-e2e-mask-" + Math.random().toString(36).slice(2, 10);
        const container = document.createElement("div");
        container.setAttribute("data-bun-e2e-mask", id);
        container.style.position = "fixed";
        container.style.inset = "0";
        container.style.pointerEvents = "none";
        container.style.zIndex = "2147483647";

        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const mask = document.createElement("div");
          mask.style.position = "fixed";
          mask.style.left = rect.left + "px";
          mask.style.top = rect.top + "px";
          mask.style.width = rect.width + "px";
          mask.style.height = rect.height + "px";
          mask.style.background = "rgb(255, 0, 255)";
          container.appendChild(mask);
        }

        document.documentElement.appendChild(container);
        return id;
      })()`) as Promise<string>,
    );
  }

  async #removeScreenshotMasks(id: string): Promise<void> {
    await this.#queue.run(() =>
      this.#view.evaluate(`(() => {
        document.querySelector('[data-bun-e2e-mask="${id}"]')?.remove();
      })()`),
    );
  }

  async #getScreenshotClip(
    selector: string,
    padding: number,
  ): Promise<ScreenshotClip> {
    const clip = await this.#queue.run(
      () =>
        this.#view.evaluate(`(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return null;
          el.scrollIntoView({ block: "center", inline: "center" });
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return null;
          return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            devicePixelRatio: window.devicePixelRatio || 1,
            padding: ${JSON.stringify(padding)},
          };
        })()`) as Promise<ScreenshotClip | null>,
    );

    if (!clip) {
      throw new Error(`Could not capture screenshot for selector: ${selector}`);
    }

    return clip;
  }

  async #debug(
    selector: string | null | undefined,
    options: DebugOptions = {},
    description?: string,
  ): Promise<string> {
    await ensureInjected(this.#view, this.#queue);
    return renderDebug(
      (script) => this.evaluate(script),
      selector,
      options,
      description,
    );
  }
}

// -------------------------
// Types
// -------------------------

export interface PageOptions {
  baseURL?: string;
  width?: number;
  height?: number;
  /** Forward page console output to Bun's stdout */
  debug?: boolean;
  /** Slow down each action by this many ms — useful for watching tests run */
  slowMo?: number;
}

export interface PageScreenshotOptions {
  maskSelectors?: string[];
  clipSelector?: string;
  clipPadding?: number;
}

export interface ClickOptions {
  timeout?: number;
  button?: "left" | "right" | "middle";
  modifiers?: ("Shift" | "Control" | "Alt" | "Meta")[];
}

export interface PressOptions {
  modifiers?: ("Shift" | "Control" | "Alt" | "Meta")[];
}

export interface FillOptions {
  timeout?: number;
}

export interface StorageItemState {
  name: string;
  value: string;
}

export interface NetworkRequest {
  id: number;
  kind: "request";
  api: "fetch" | "xhr";
  url: string;
  method: string;
  timestamp: number;
}

export interface NetworkResponse {
  id: number;
  kind: "response";
  api: "fetch" | "xhr";
  url: string;
  method: string;
  timestamp: number;
  status: number;
  ok: boolean;
  mocked?: boolean;
  error?: string;
}

export type NetworkEvent = NetworkRequest | NetworkResponse;
export type NetworkMatcher<TEvent extends NetworkEvent> =
  | string
  | RegExp
  | ((event: TEvent) => boolean);

interface ScreenshotClip {
  x: number;
  y: number;
  width: number;
  height: number;
  devicePixelRatio: number;
  padding: number;
}

// -------------------------
// Helpers
// -------------------------

async function cropScreenshot(
  image: Blob,
  clip: ScreenshotClip,
): Promise<Blob> {
  const bytes = new Uint8Array(await image.arrayBuffer());
  const source = PNG.sync.read(Buffer.from(bytes));
  const scale = clip.devicePixelRatio;
  const left = clamp(
    Math.floor((clip.x - clip.padding) * scale),
    0,
    source.width,
  );
  const top = clamp(
    Math.floor((clip.y - clip.padding) * scale),
    0,
    source.height,
  );
  const right = clamp(
    Math.ceil((clip.x + clip.width + clip.padding) * scale),
    left,
    source.width,
  );
  const bottom = clamp(
    Math.ceil((clip.y + clip.height + clip.padding) * scale),
    top,
    source.height,
  );
  const width = right - left;
  const height = bottom - top;

  if (width <= 0 || height <= 0) {
    throw new Error(
      "Could not crop screenshot: target element is outside the viewport",
    );
  }

  const cropped = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    const sourceStart = ((top + y) * source.width + left) * 4;
    const sourceEnd = sourceStart + width * 4;
    const targetStart = y * width * 4;
    cropped.data.set(source.data.subarray(sourceStart, sourceEnd), targetStart);
  }

  return new Blob([PNG.sync.write(cropped)], { type: "image/png" });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function enrichError(err: unknown, action: string): Error {
  const message = err instanceof Error ? err.message : String(err);
  return new Error(`[Page.${action}] ${message}`);
}

function selectorToFilename(selector: string): string {
  return selector.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
}

function safeOrigin(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "data:" || parsed.protocol === "about:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

function parseCookieHeader(
  cookieHeader: string,
  origin: string,
): CookieState[] {
  const domain = new URL(origin).hostname;
  return cookieHeader
    .split(/;\s*/)
    .filter(Boolean)
    .flatMap((entry) => {
      const [name, ...rest] = entry.split("=");
      if (!name) {
        return [];
      }
      return [
        {
          name,
          value: rest.join("="),
          domain,
          path: "/",
        },
      ];
    });
}

function matchesNetworkEvent<TEvent extends NetworkEvent>(
  event: TEvent,
  matcher: NetworkMatcher<TEvent>,
): boolean {
  if (typeof matcher === "function") return matcher(event);
  if (matcher instanceof RegExp) return matcher.test(event.url);
  return event.url.includes(matcher);
}
