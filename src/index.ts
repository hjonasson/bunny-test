export { Page } from "./page";
export { Browser } from "./browser";
export { BrowserContext } from "./browser-context";
export { Locator } from "./locator";
export { expect } from "./expect";
export { screenshotName } from "./screenshot";
export { waitForServer, withServerPage } from "./server";
export type {
  RoutePattern,
  RouteMockOptions,
  RouteFulfillOptions,
} from "./network";
export type {
  StorageState,
  CookieState,
  OriginStorageState,
} from "./browser-context";
export type {
  PageOptions,
  PageScreenshotOptions,
  ClickOptions,
  PressOptions,
  NetworkRequest,
  NetworkResponse,
  NetworkMatcher,
} from "./page";
export type { LocatorScreenshotOptions } from "./locator";
export type { ExpectOptions, ScreenshotExpectOptions } from "./expect";
export type { ServerPageOptions, WaitForServerOptions } from "./server";
export type { QueryOptions, RoleOptions } from "./query";
export type { WaitOptions } from "./wait";

/**
 * Launch a page, run a test function, capture a screenshot on failure,
 * and always close cleanly. The idiomatic way to write a test.
 *
 * test("user can log in", () => withPage("http://localhost:3000", async (page) => {
 *   await page.fill(await page.getByLabelText("Email"), "user@example.com");
 *   await page.click(await page.getByRole("button", { name: "Sign in" }));
 *   await page.assertURL("/dashboard");
 * }));
 */
export async function withPage<T>(
  url: string,
  fn: (page: import("./page").Page) => Promise<T>,
  options: import("./page").PageOptions = {},
): Promise<T> {
  await using page = await (await import("./page")).Page.launch(url, options);
  return await fn(page);
}
