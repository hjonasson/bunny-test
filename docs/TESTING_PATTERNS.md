# Testing Patterns

Practical patterns for browser-backed tests that stay stable, isolated, and useful in real applications.

## Authenticate once, then restore state

The most reliable way to test an authenticated app is not to share one long-lived browser session across tests. Instead:

1. Perform the login once in a setup flow.
2. Save the resulting browser storage state to disk.
3. Create a fresh browser context for each test.
4. Restore the saved storage state before opening an authenticated page.

```ts
import { test } from "bun:test";
import { Browser } from "bunny-test";

test("login and save auth state", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  const page = await context.newPage("https://app.example.com/login");

  await page.fill("#email", "user@example.com");
  await page.fill("#password", "secret");
  await page.click("button[type='submit']");

  const statePath = await context.saveStorageState();
  console.log("Saved auth state to", statePath);
  await browser.close();
});

test("dashboard shows authenticated user", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  await context.loadStorageState("./auth-state.json");

  const page = await context.newPage("https://app.example.com/dashboard");

  await page.expectToContainText("Welcome back");
  await browser.close();
});
```

If you want a durable state file between runs, pass an explicit path. If you want the library to hide the temp-file detail, call `saveStorageState()` with no argument and keep the returned path for later. This pattern keeps tests independent and avoids the flakiness that comes from sharing one global authenticated browser session.

## Keep each test in its own browser context

A browser context is the right unit of isolation. It captures cookies, localStorage, and sessionStorage for that test run.

Do not reuse a context across unrelated tests unless that is the explicit behavior you need.

```ts
const browser = await Browser.launch();
const context = await browser.newContext();
const page = await context.newPage(url);
```

For most suites, a fresh context per test is simpler and safer than trying to reset the whole browser manually.

## Prefer app-level signals over raw browser internals

For stability, prefer app-level evidence when possible:

- page URL
- visible heading or CTA text
- app-specific data attributes
- known DOM structures that represent the loaded state

This is usually better than waiting on a browser-specific detail like a raw `performance` value or a hard-coded DOM mutation count.

## Use memory-soak tests to look for drift

Memory soak tests are most useful when they repeat a realistic action loop and compare the result against a baseline.

```ts
import { test } from "bun:test";
import { memorySoak, readGlobalMetrics, withPage } from "bunny-test";

test("dialog does not leak listeners", async () => {
  await withPage(process.env.BROWSER_BASE_URL!, async (page) => {
    await memorySoak(page, {
      iterations: 40,
      warmup: 5,
      sampleEvery: 5,
      action: async (page) => {
        await page.click("button[aria-label='Open dialog']");
        await page.click("button[aria-label='Close dialog']");
      },
      settle: async (page) => {
        await page.waitFor("window.__APP_IDLE__ === true", { timeout: 3000 });
      },
      sample: readGlobalMetrics({
        leak: "window.__LEAK_METRICS__",
      }),
      assert(report) {
        report.expectStable("leak.listeners", { maxGrowth: 0 });
        report.expectStable("leak.timers", { maxGrowth: 0 });
      },
    });
  });
});
```

This works because the signal is tied to a real app behavior: listeners, timers, caches, and other objects that should disappear when UI is torn down.

## Prefer app metrics over raw heap numbers

When possible, collect metrics from the app itself rather than relying on heap size alone.

Good examples:

- number of listeners
- open subscriptions
- active timers
- mounted component instances
- visible DOM nodes
- repeated portal roots or iframe counts

A failing app-level metric is far more actionable than a vague heap increase.

## Keep navigation tests explicit

When testing route changes or navigation performance, define the behavior you care about in advance:

- URL changed
- route handler fired
- app becomes interactive
- a target element is visible

That is much more reliable than trying to infer success from a single raw DOM mutation or a broad page load timeout.

```ts
await page.expectNavigation({
  urlMatches: "/dashboard",
  elementVisible: "text=Account overview",
});
```

This makes the test about the user-facing transition rather than a brittle implementation detail.

## Keep screenshot tests narrow and deterministic

Screenshot tests are most stable when they cover a small, intentional area of the UI.

Good practices:

- set an explicit viewport
- mask transient overlays or debugging UI
- target a single page region or component when possible
- assert semantic text separately from visual snapshots

```ts
await withPage(url, async (page) => {
  await expect(page).toMatchScreenshot(
    screenshotName(import.meta.path, "hero-panel"),
    {
      mask: ["#debug-overlay", "#dev-portal-root"],
    },
  );
}, {
  width: 1280,
  height: 720,
});
```

## Triage failures by layer

When a browser test fails, separate the problem into layers:

1. app not started or reachable
2. page loaded but wrong route
3. app is loaded but not hydrated
4. visible behavior is wrong
5. visual snapshot is unstable

This reduces guesswork and keeps the fix focused on the actual cause.

## Summary

The repeated pattern is simple:

- isolate each test with a fresh browser context
- reuse authenticated state via storage-state restore
- assert meaningful app states, not internals
- sample app-level metrics when testing memory or performance
- narrow the surface area of screenshot and navigation checks

That pattern helps browser-backed tests stay fast, understandable, and robust as the app evolves.
