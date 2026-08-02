// One animation frame — the fastest safe poll interval
const FRAME = 16;
import type { EvaluateQueue } from "./evaluate-queue";

export interface WaitOptions {
  timeout?: number;
  interval?: number;
}

/**
 * Core polling primitive. Everything else is built on this.
 * Polls `predicate` every `interval` ms until it returns true or timeout expires.
 */
export async function waitUntil(
  predicate: () => Promise<boolean>,
  options: WaitOptions & { label: string },
): Promise<void> {
  const timeout = options.timeout ?? 10_000;
  const interval = options.interval ?? FRAME;
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (await predicate()) return;
    await Bun.sleep(interval);
  }

  throw new Error(`Timed out after ${timeout}ms waiting for: ${options.label}`);
}

/**
 * Wait for a CSS selector to exist in the DOM.
 */
export async function waitForSelector(
  view: Bun.WebView,
  queue: EvaluateQueue,
  selector: string,
  options: WaitOptions = {},
): Promise<void> {
  await waitUntil(
    () =>
      queue.run(
        () =>
          view.evaluate(
            `!!document.querySelector(${JSON.stringify(selector)})`,
          ) as Promise<boolean>,
      ),
    { ...options, label: `selector "${selector}"` },
  );
}

/**
 * Wait for an element to be visible — exists, has a non-zero bounding box,
 * and is not hidden via display/visibility/opacity.
 */
export async function waitForVisible(
  view: Bun.WebView,
  queue: EvaluateQueue,
  selector: string,
  options: WaitOptions = {},
): Promise<void> {
  await waitUntil(
    () =>
      queue.run(
        () =>
          view.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const style = getComputedStyle(el);
      if (style.display === "none") return false;
      if (style.visibility === "hidden") return false;
      if (style.opacity === "0") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })()`) as Promise<boolean>,
      ),
    { ...options, label: `"${selector}" to be visible` },
  );
}

/**
 * Wait for an element to be removed from the DOM.
 * Useful for waiting for loaders/spinners to disappear.
 */
export async function waitForGone(
  view: Bun.WebView,
  queue: EvaluateQueue,
  selector: string,
  options: WaitOptions = {},
): Promise<void> {
  await waitUntil(
    () =>
      queue.run(
        () =>
          view.evaluate(
            `!document.querySelector(${JSON.stringify(selector)})`,
          ) as Promise<boolean>,
      ),
    { ...options, label: `"${selector}" to be removed` },
  );
}

/**
 * Wait for an input/textarea's value to equal `expected`.
 * Use after typing to confirm the value landed before continuing.
 */
export async function waitForValue(
  view: Bun.WebView,
  queue: EvaluateQueue,
  selector: string,
  expected: string,
  options: WaitOptions = {},
): Promise<void> {
  await waitUntil(
    () =>
      queue.run(
        () =>
          view.evaluate(
            `document.querySelector(${JSON.stringify(selector)})?.value === ${JSON.stringify(expected)}`,
          ) as Promise<boolean>,
      ),
    { ...options, label: `value of "${selector}" to equal "${expected}"` },
  );
}

/**
 * Wait for the page URL to match a string (substring) or RegExp.
 */
export async function waitForURL(
  view: Bun.WebView,
  pattern: string | RegExp,
  options: WaitOptions = {},
): Promise<void> {
  const test =
    pattern instanceof RegExp
      ? (url: string) => pattern.test(url)
      : (url: string) => url.includes(pattern);

  await waitUntil(async () => test(view.url), {
    ...options,
    label: `URL to match ${pattern instanceof RegExp ? pattern : `"${pattern}"`}`,
  });
}

/**
 * Wait for an element's text content to match a string or RegExp.
 */
export async function waitForText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  selector: string,
  pattern: string | RegExp,
  options: WaitOptions = {},
): Promise<void> {
  const isRegex = pattern instanceof RegExp;

  await waitUntil(
    () =>
      queue.run(
        () =>
          view.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const text = el.textContent?.trim() ?? "";
      ${
        isRegex
          ? `return ${pattern}.test(text);`
          : `return text.includes(${JSON.stringify(pattern)});`
      }
    })()`) as Promise<boolean>,
      ),
    {
      ...options,
      label: `text of "${selector}" to match ${isRegex ? pattern : `"${pattern}"`}`,
    },
  );
}

/**
 * Wait for a custom JS expression to return true.
 * Escape hatch for anything the above helpers don't cover.
 *
 * await page.waitFor('window.__appReady === true');
 */
export async function waitFor(
  view: Bun.WebView,
  queue: EvaluateQueue,
  script: string,
  options: WaitOptions = {},
): Promise<void> {
  await waitUntil(
    () => queue.run(() => view.evaluate(script) as Promise<boolean>),
    { ...options, label: script },
  );
}
