import { Locator } from "./locator";
import { assertScreenshot, type ScreenshotCompareOptions } from "./screenshot";
import { waitUntil, type WaitOptions } from "./wait";

export interface PageExpectable {
  url: string;
  evaluate<T = unknown>(script: string): Promise<T>;
  screenshotBytes(options?: { maskSelectors?: string[] }): Promise<Blob>;
  debug?(options?: { log?: boolean; roles?: boolean }): Promise<string>;
}

export interface ExpectOptions extends WaitOptions {}

export interface ScreenshotExpectOptions extends ScreenshotCompareOptions {
  mask?: Array<Locator | string>;
  padding?: number;
}

class LocatorExpectation {
  readonly #locator: Locator;

  constructor(locator: Locator) {
    this.#locator = locator;
  }

  async toBeVisible(options: ExpectOptions = {}): Promise<void> {
    try {
      await this.#locator.waitFor({ ...options, state: "visible" });
    } catch (error) {
      throw await this.#locatorError(error, {
        expected: "visible",
        actual: (await this.#locator.isVisible()) ? "visible" : "not visible",
      });
    }
  }

  async toBeHidden(options: ExpectOptions = {}): Promise<void> {
    await this.#locator.waitFor({ ...options, state: "hidden" });
  }

  async toBeEnabled(options: ExpectOptions = {}): Promise<void> {
    try {
      await waitUntil(() => this.#locator.isEnabled(), {
        ...options,
        label: `${this.#locator.describe()} to be enabled`,
      });
    } catch (error) {
      throw await this.#locatorError(error, {
        expected: "enabled",
        actual: (await this.#locator.isEnabled()) ? "enabled" : "disabled",
      });
    }
  }

  async toBeDisabled(options: ExpectOptions = {}): Promise<void> {
    try {
      await waitUntil(async () => !(await this.#locator.isEnabled()), {
        ...options,
        label: `${this.#locator.describe()} to be disabled`,
      });
    } catch (error) {
      throw await this.#locatorError(error, {
        expected: "disabled",
        actual: (await this.#locator.isEnabled()) ? "enabled" : "disabled",
      });
    }
  }

  async toBeChecked(options: ExpectOptions = {}): Promise<void> {
    try {
      await waitUntil(() => this.#locator.isChecked(), {
        ...options,
        label: `${this.#locator.describe()} to be checked`,
      });
    } catch (error) {
      throw await this.#locatorError(error, {
        expected: "checked",
        actual: (await this.#locator.isChecked()) ? "checked" : "not checked",
      });
    }
  }

  async toHaveText(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
    try {
      await waitUntil(
        async () => matches(await this.#locator.textContent(), expected),
        {
          ...options,
          label: `text of ${this.#locator.describe()} to match ${String(expected)}`,
        },
      );
    } catch (error) {
      throw await this.#locatorError(error, {
        expected: String(expected),
        actual: await this.#locator.textContent(),
      });
    }
  }

  async toContainText(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
    await this.toHaveText(expected, options);
  }

  async toHaveValue(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
    try {
      await waitUntil(
        async () => matches(await this.#locator.inputValue(), expected),
        {
          ...options,
          label: `value of ${this.#locator.describe()} to match ${String(expected)}`,
        },
      );
    } catch (error) {
      throw await this.#locatorError(error, {
        expected: String(expected),
        actual: await this.#locator.inputValue(),
      });
    }
  }

  async toMatchScreenshot(
    name: string,
    options: ScreenshotExpectOptions = {},
  ): Promise<void> {
    await assertScreenshot(
      () => this.#locator.screenshotBytes(options),
      name,
      options,
    );
  }

  async #locatorError(
    cause: unknown,
    details: { expected: string; actual: string | null },
  ): Promise<Error> {
    const debug = await safeDebug(() =>
      this.#locator.debug({ log: false, roles: true }),
    );
    return enrichError(cause, [
      `Expectation failed for ${this.#locator.describe()}`,
      `Expected: ${details.expected}`,
      `Actual: ${formatActual(details.actual)}`,
      debug,
    ]);
  }
}

class PageExpectation {
  readonly #page: PageExpectable;

  constructor(page: PageExpectable) {
    this.#page = page;
  }

  async toHaveURL(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
    try {
      await waitUntil(async () => matches(this.#page.url, expected), {
        ...options,
        label: `URL to match ${String(expected)}`,
      });
    } catch (error) {
      throw await this.#pageError(error, {
        label: "URL",
        expected: String(expected),
        actual: this.#page.url,
      });
    }
  }

  async toHaveTitle(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
    try {
      await waitUntil(
        async () => {
          const title = await this.#page.evaluate<string>("document.title");
          return matches(title, expected);
        },
        {
          ...options,
          label: `title to match ${String(expected)}`,
        },
      );
    } catch (error) {
      throw await this.#pageError(error, {
        label: "Title",
        expected: String(expected),
        actual: await this.#page.evaluate<string>("document.title"),
      });
    }
  }

  async toMatchScreenshot(
    name: string,
    options: ScreenshotExpectOptions = {},
  ): Promise<void> {
    const maskSelectors = await Promise.all(
      (options.mask ?? []).map((target) =>
        typeof target === "string"
          ? Promise.resolve(target)
          : target.selector(),
      ),
    );
    await assertScreenshot(
      () => this.#page.screenshotBytes({ maskSelectors }),
      name,
      options,
    );
  }

  async #pageError(
    cause: unknown,
    details: { label: string; expected: string; actual: string | null },
  ): Promise<Error> {
    const debug = await safeDebug(
      () =>
        this.#page.debug?.({ log: false, roles: true }) ?? Promise.resolve(""),
    );
    return enrichError(cause, [
      `Expectation failed for page ${details.label.toLowerCase()}`,
      `Expected ${details.label}: ${details.expected}`,
      `Actual ${details.label}: ${formatActual(details.actual)}`,
      `Current URL: ${this.#page.url}`,
      debug,
    ]);
  }
}

export function expect(actual: Locator): LocatorExpectation;
export function expect(actual: PageExpectable): PageExpectation;
export function expect(actual: Locator | PageExpectable) {
  if (actual instanceof Locator) {
    return new LocatorExpectation(actual);
  }
  return new PageExpectation(actual);
}

function matches(value: string | null, expected: string | RegExp): boolean {
  if (value == null) return false;
  return expected instanceof RegExp
    ? expected.test(value)
    : value.includes(expected);
}

function formatActual(value: string | null): string {
  return value == null ? "<null>" : JSON.stringify(value);
}

function enrichError(cause: unknown, parts: Array<string | undefined>): Error {
  const message = parts.filter(Boolean).join("\n\n");
  if (cause instanceof Error) {
    return new Error(`${cause.message}\n\n${message}`, { cause });
  }
  return new Error(message);
}

async function safeDebug(render: () => Promise<string>): Promise<string> {
  try {
    return await render();
  } catch {
    return "";
  }
}
