import { Locator } from "./locator";
import { assertScreenshot, type ScreenshotCompareOptions } from "./screenshot";
import { waitUntil, type WaitOptions } from "./wait";

export interface PageExpectable {
  url: string;
  evaluate<T = unknown>(script: string): Promise<T>;
  screenshotBytes(options?: { maskSelectors?: string[] }): Promise<Blob>;
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
    await this.#locator.waitFor({ ...options, state: "visible" });
  }

  async toBeHidden(options: ExpectOptions = {}): Promise<void> {
    await this.#locator.waitFor({ ...options, state: "hidden" });
  }

  async toBeEnabled(options: ExpectOptions = {}): Promise<void> {
    await waitUntil(() => this.#locator.isEnabled(), {
      ...options,
      label: `${this.#locator.describe()} to be enabled`,
    });
  }

  async toBeDisabled(options: ExpectOptions = {}): Promise<void> {
    await waitUntil(async () => !(await this.#locator.isEnabled()), {
      ...options,
      label: `${this.#locator.describe()} to be disabled`,
    });
  }

  async toBeChecked(options: ExpectOptions = {}): Promise<void> {
    await waitUntil(() => this.#locator.isChecked(), {
      ...options,
      label: `${this.#locator.describe()} to be checked`,
    });
  }

  async toHaveText(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
    await waitUntil(
      async () => matches(await this.#locator.textContent(), expected),
      {
        ...options,
        label: `text of ${this.#locator.describe()} to match ${String(expected)}`,
      },
    );
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
    await waitUntil(
      async () => matches(await this.#locator.inputValue(), expected),
      {
        ...options,
        label: `value of ${this.#locator.describe()} to match ${String(expected)}`,
      },
    );
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
    await waitUntil(async () => matches(this.#page.url, expected), {
      ...options,
      label: `URL to match ${String(expected)}`,
    });
  }

  async toHaveTitle(
    expected: string | RegExp,
    options: ExpectOptions = {},
  ): Promise<void> {
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
