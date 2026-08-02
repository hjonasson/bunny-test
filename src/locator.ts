import { waitUntil, type WaitOptions } from "./wait";
import type { ClickOptions, FillOptions, PressOptions } from "./page";
import type { QueryOptions, RoleOptions } from "./query";

export type LocatorState = "attached" | "detached" | "visible" | "hidden";

export interface LocatorWaitOptions extends WaitOptions {
  state?: LocatorState;
}

export type LocatorAdapter = {
  click(selector: string, options?: ClickOptions): Promise<void>;
  screenshot(selector: string, options?: InternalLocatorScreenshotOptions): Promise<Blob>;
  fill(selector: string, text: string, options?: FillOptions): Promise<void>;
  press(key: string, options?: PressOptions): Promise<void>;
  evaluate<T>(script: string): Promise<T>;
  count(selector: string): Promise<number>;
  nth(selector: string, index: number): Promise<string | null>;
  getByRole(parentSelector: string | undefined, role: string, options?: RoleOptions): Promise<string>;
  queryByRole(parentSelector: string | undefined, role: string, options?: RoleOptions): Promise<string | null>;
  getByText(parentSelector: string | undefined, text: string, options?: QueryOptions): Promise<string>;
  queryByText(parentSelector: string | undefined, text: string, options?: QueryOptions): Promise<string | null>;
  getByLabelText(parentSelector: string | undefined, text: string, options?: QueryOptions): Promise<string>;
  queryByLabelText(parentSelector: string | undefined, text: string, options?: QueryOptions): Promise<string | null>;
  getByPlaceholderText(parentSelector: string | undefined, text: string, options?: QueryOptions): Promise<string>;
  queryByPlaceholderText(parentSelector: string | undefined, text: string, options?: QueryOptions): Promise<string | null>;
  getByTestId(parentSelector: string | undefined, testId: string, options?: QueryOptions): Promise<string>;
  queryByTestId(parentSelector: string | undefined, testId: string, options?: QueryOptions): Promise<string | null>;
};

export type LocatorResolver = {
  description: string;
  resolve(): Promise<string>;
  query(): Promise<string | null>;
  count(): Promise<number>;
  nth(index: number): Promise<string | null>;
};

export interface LocatorFilterOptions {
  hasText?: string | RegExp;
  has?: Locator;
}

export interface LocatorScreenshotOptions {
  mask?: Array<Locator | string>;
  padding?: number;
}

export interface InternalLocatorScreenshotOptions {
  maskSelectors?: string[];
  padding?: number;
}

export class Locator {
  readonly #adapter: LocatorAdapter;
  readonly #resolver: LocatorResolver;

  constructor(adapter: LocatorAdapter, resolver: LocatorResolver) {
    this.#adapter = adapter;
    this.#resolver = resolver;
  }

  describe(): string {
    return this.#resolver.description;
  }

  async selector(): Promise<string> {
    return this.#resolver.resolve();
  }

  async count(): Promise<number> {
    return this.#resolver.count();
  }

  locator(selector: string): Locator {
    return new Locator(this.#adapter, {
      description: `${this.#resolver.description} >> ${selector}`,
      resolve: async () => {
        const nested = await this.#nestedSelector(selector, true);
        if (!nested) {
          throw new Error(`Could not find element: ${this.#resolver.description} >> ${selector}`);
        }
        return nested;
      },
      query: () => this.#nestedSelector(selector, false),
      count: async () => ((await this.#nestedSelector(selector, false)) ? 1 : 0),
      nth: async (index) => (index === 0 ? this.#nestedSelector(selector, false) : null),
    });
  }

  first(): Locator {
    return this.nth(0);
  }

  last(): Locator {
    return new Locator(this.#adapter, {
      description: `${this.#resolver.description} >> last()`,
      resolve: async () => {
        const count = await this.#resolver.count();
        if (count === 0) {
          throw new Error(`Could not find element: ${this.#resolver.description} >> last()`);
        }
        return (await this.#resolver.nth(count - 1)) as string;
      },
      query: async () => {
        const count = await this.#resolver.count();
        return count === 0 ? null : this.#resolver.nth(count - 1);
      },
      count: async () => ((await this.#resolver.count()) > 0 ? 1 : 0),
      nth: async (index) => {
        if (index !== 0) return null;
        const count = await this.#resolver.count();
        return count === 0 ? null : this.#resolver.nth(count - 1);
      },
    });
  }

  nth(index: number): Locator {
    return new Locator(this.#adapter, {
      description: `${this.#resolver.description} >> nth(${index})`,
      resolve: async () => {
        const selector = await this.#resolver.nth(index);
        if (!selector) {
          throw new Error(`Could not find element: ${this.#resolver.description} >> nth(${index})`);
        }
        return selector;
      },
      query: () => this.#resolver.nth(index),
      count: async () => ((await this.#resolver.nth(index)) ? 1 : 0),
      nth: async (nextIndex) => (nextIndex === 0 ? this.#resolver.nth(index) : null),
    });
  }

  filter(options: LocatorFilterOptions): Locator {
    return new Locator(this.#adapter, {
      description: `${this.#resolver.description} >> filter()`,
      resolve: async () => {
        const selector = await this.#filteredNth(options, 0);
        if (!selector) {
          throw new Error(`Could not find element: ${this.#resolver.description} >> filter()`);
        }
        return selector;
      },
      query: () => this.#filteredNth(options, 0),
      count: () => this.#filteredCount(options),
      nth: (index) => this.#filteredNth(options, index),
    });
  }

  getByRole(role: string, options: RoleOptions = {}): Locator {
    return this.#scopedQuery(
      `role="${role}"${options.name ? ` name="${options.name}"` : ""}`,
      (parent) => this.#adapter.getByRole(parent, role, options),
      (parent) => this.#adapter.queryByRole(parent, role, options),
    );
  }

  getByText(text: string, options: QueryOptions = {}): Locator {
    return this.#scopedQuery(
      `text="${text}"`,
      (parent) => this.#adapter.getByText(parent, text, options),
      (parent) => this.#adapter.queryByText(parent, text, options),
    );
  }

  getByLabelText(text: string, options: QueryOptions = {}): Locator {
    return this.#scopedQuery(
      `label="${text}"`,
      (parent) => this.#adapter.getByLabelText(parent, text, options),
      (parent) => this.#adapter.queryByLabelText(parent, text, options),
    );
  }

  getByPlaceholderText(text: string, options: QueryOptions = {}): Locator {
    return this.#scopedQuery(
      `placeholder="${text}"`,
      (parent) => this.#adapter.getByPlaceholderText(parent, text, options),
      (parent) => this.#adapter.queryByPlaceholderText(parent, text, options),
    );
  }

  getByTestId(testId: string, options: QueryOptions = {}): Locator {
    return this.#scopedQuery(
      `testId="${testId}"`,
      (parent) => this.#adapter.getByTestId(parent, testId, options),
      (parent) => this.#adapter.queryByTestId(parent, testId, options),
    );
  }

  async click(options: ClickOptions = {}): Promise<void> {
    const selector = await this.#resolver.resolve();
    await this.#adapter.click(selector, options);
  }

  async screenshotBytes(options: LocatorScreenshotOptions = {}): Promise<Blob> {
    const selector = await this.#resolver.resolve();
    const maskSelectors = await Promise.all(
      (options.mask ?? []).map((target) =>
        typeof target === "string" ? Promise.resolve(target) : target.selector(),
      ),
    );
    return this.#adapter.screenshot(selector, {
      maskSelectors,
      padding: options.padding,
    });
  }

  async screenshot(
    path: string,
    options: LocatorScreenshotOptions = {},
  ): Promise<void> {
    await Bun.write(path, await this.screenshotBytes(options));
  }

  async fill(value: string, options: FillOptions = {}): Promise<void> {
    const selector = await this.#resolver.resolve();
    await this.#adapter.fill(selector, value, options);
  }

  async press(key: string, options: PressOptions = {}): Promise<void> {
    const selector = await this.#resolver.resolve();
    await this.#adapter.evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus()`);
    await this.#adapter.press(key, options);
  }

  async textContent(): Promise<string | null> {
    const selector = await this.#resolver.query();
    if (!selector) return null;
    return this.#adapter.evaluate(
      `document.querySelector(${JSON.stringify(selector)})?.textContent ?? null`,
    );
  }

  async inputValue(): Promise<string> {
    const selector = await this.#resolver.resolve();
    return this.#adapter.evaluate(
      `document.querySelector(${JSON.stringify(selector)})?.value ?? ""`,
    );
  }

  async isVisible(): Promise<boolean> {
    const selector = await this.#resolver.query();
    if (!selector) return false;
    return this.#evaluateVisible(selector);
  }

  async isEnabled(): Promise<boolean> {
    const selector = await this.#resolver.query();
    if (!selector) return false;
    return this.#adapter.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      return !el.disabled;
    })()`);
  }

  async isChecked(): Promise<boolean> {
    const selector = await this.#resolver.query();
    if (!selector) return false;
    return this.#adapter.evaluate(
      `!!document.querySelector(${JSON.stringify(selector)})?.checked`,
    );
  }

  async waitFor(options: LocatorWaitOptions = {}): Promise<void> {
    const state = options.state ?? "attached";
    const timeout = options.timeout ?? 10_000;

    switch (state) {
      case "attached":
        await waitUntil(async () => (await this.#resolver.query()) !== null, {
          ...options,
          timeout,
          label: `${this.#resolver.description} to be attached`,
        });
        return;
      case "detached":
        await waitUntil(async () => (await this.#resolver.query()) === null, {
          ...options,
          timeout,
          label: `${this.#resolver.description} to be detached`,
        });
        return;
      case "visible":
        await waitUntil(async () => {
          const selector = await this.#resolver.query();
          if (!selector) return false;
          return this.#evaluateVisible(selector);
        }, {
          ...options,
          timeout,
          label: `${this.#resolver.description} to be visible`,
        });
        return;
      case "hidden":
        await waitUntil(async () => {
          const selector = await this.#resolver.query();
          if (!selector) return true;
          return !(await this.#evaluateVisible(selector));
        }, {
          ...options,
          timeout,
          label: `${this.#resolver.description} to be hidden`,
        });
        return;
    }
  }

  async #nestedSelector(
    selector: string,
    requireParent: boolean,
  ): Promise<string | null> {
    const parent = requireParent
      ? await this.#resolver.resolve()
      : await this.#resolver.query();

    if (!parent) return null;

    const scoped = `${parent} ${selector}`;
    const exists = await this.#adapter.evaluate<boolean>(
      `!!document.querySelector(${JSON.stringify(scoped)})`,
    );
    return exists ? scoped : null;
  }

  #scopedQuery(
    description: string,
    resolveScoped: (parentSelector: string) => Promise<string>,
    queryScoped: (parentSelector: string) => Promise<string | null>,
  ): Locator {
    return new Locator(this.#adapter, {
      description: `${this.#resolver.description} >> ${description}`,
      resolve: async () => {
        const parent = await this.#resolver.resolve();
        return resolveScoped(parent);
      },
      query: async () => {
        const parent = await this.#resolver.query();
        if (!parent) return null;
        return queryScoped(parent);
      },
      count: async () => {
        const parent = await this.#resolver.query();
        if (!parent) return 0;
        return (await queryScoped(parent)) ? 1 : 0;
      },
      nth: async (index) => {
        if (index !== 0) return null;
        const parent = await this.#resolver.query();
        if (!parent) return null;
        return queryScoped(parent);
      },
    });
  }

  async #filteredCount(options: LocatorFilterOptions): Promise<number> {
    const count = await this.#resolver.count();
    let matched = 0;
    for (let index = 0; index < count; index++) {
      const selector = await this.#resolver.nth(index);
      if (selector && (await this.#matchesFilter(selector, options))) {
        matched += 1;
      }
    }
    return matched;
  }

  async #filteredNth(
    options: LocatorFilterOptions,
    targetIndex: number,
  ): Promise<string | null> {
    const count = await this.#resolver.count();
    let matchedIndex = 0;
    for (let index = 0; index < count; index++) {
      const selector = await this.#resolver.nth(index);
      if (!selector) continue;
      if (!(await this.#matchesFilter(selector, options))) continue;
      if (matchedIndex === targetIndex) return selector;
      matchedIndex += 1;
    }
    return null;
  }

  async #matchesFilter(
    selector: string,
    options: LocatorFilterOptions,
  ): Promise<boolean> {
    if (options.hasText !== undefined) {
      const text = await this.#adapter.evaluate<string>(
        `document.querySelector(${JSON.stringify(selector)})?.textContent ?? ""`,
      );
      const ok =
        options.hasText instanceof RegExp
          ? options.hasText.test(text)
          : text.includes(options.hasText);
      if (!ok) return false;
    }

    if (options.has) {
      let childSelector: string;
      try {
        childSelector = await options.has.selector();
      } catch {
        return false;
      }
      const contains = await this.#adapter.evaluate<boolean>(`(() => {
        const parent = document.querySelector(${JSON.stringify(selector)});
        const child = document.querySelector(${JSON.stringify(childSelector)});
        return !!parent && !!child && parent.contains(child);
      })()`);
      if (!contains) return false;
    }

    return true;
  }

  async #evaluateVisible(selector: string): Promise<boolean> {
    return this.#adapter.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const style = getComputedStyle(el);
      if (style.display === "none") return false;
      if (style.visibility === "hidden") return false;
      if (style.opacity === "0") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })()`);
  }
}
