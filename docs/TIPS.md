# bunny-test Tips

Practical patterns for keeping browser-backed tests stable and low-friction.

## Use one shared app server for a suite

For larger suites, start the app once, wait for it to become reachable, and let the tests connect to it with `withPage()`.

That keeps tests close to normal `bun test` usage while avoiding repeated app boot time in every test.

## Prefer a stable app mode for screenshots

If your framework has both a development server and a production-style server, prefer the production-style server for screenshot tests when possible.

Development overlays, hot-reload UI, and debug portals can appear and disappear between runs and make screenshots flaky.

## Mask framework overlays and portal UI

Some frameworks inject development-only overlays, floating controls, or portal roots outside your app content. If those elements are not part of what you want to assert, mask them in screenshot tests.

```ts
import { test } from "bun:test";
import { expect, screenshotName, withPage } from "bunny-test";

const unstableUiMask = ["#dev-overlay-root", "#dev-portal-root"];

const baseUrl = process.env.BROWSER_BASE_URL!;

test("about page matches screenshot", async () => {
  await withPage(
    `${baseUrl}/about`,
    async (page) => {
      await expect(page).toMatchScreenshot(
        screenshotName(import.meta.path, "about-page"),
        { mask: unstableUiMask },
      );
    },
    {
      width: 1280,
      height: 720,
    },
  );
});
```

Replace those selectors with the actual overlay or portal roots used by your framework or app shell.

## Keep screenshot dimensions explicit

When a screenshot matters, pass an explicit page size so the baseline is tied to a known viewport.

```ts
await withPage(
  url,
  async (page) => {
    await expect(page).toMatchScreenshot(
      screenshotName(import.meta.path, "dashboard"),
    );
  },
  {
    width: 1280,
    height: 720,
  },
);
```

## Keep screenshot assertions narrow

Screenshot assertions are most stable when they cover one page state or one component-sized region at a time.

If a whole page changes often, consider asserting the important text semantically and capturing screenshots only for the regions where layout and visuals matter.

## Minimal visual smoke tests work well

For a first browser-backed test, start with SSR-stable content and one narrow screenshot rather than a full interaction flow.

That often means checking the title, one heading or CTA, and one masked screenshot of the most important stable region.

## Prefer app-level metrics for memory soak tests

When you are using `memorySoak()`, the most reliable checks usually come from app-level counters rather than raw heap size alone.

If your app can expose test-only diagnostics on `window.__LEAK_METRICS__`, you can assert that listeners, subscriptions, timers, sockets, or cache entries return to baseline after repeated mount and teardown cycles.

```ts
import { test } from "bun:test";
import { memorySoak, readGlobalMetrics, withPage } from "bunny-test";

test("dialog open/close does not leak", async () => {
  await withPage(process.env.BROWSER_BASE_URL!, async (page) => {
    await memorySoak(page, {
      iterations: 50,
      warmup: 5,
      sampleEvery: 5,
      action: async (page, iteration) => {
        await page.click("[aria-label='Open search']");
        await page.fill("input[aria-label='Search']", `query-${iteration}`);
        await page.click("[aria-label='Close search']");
      },
      settle: async (page) => {
        await page.waitFor("window.__appIdle === true", { timeout: 3000 });
      },
      sample: readGlobalMetrics({
        leak: "window.__LEAK_METRICS__",
      }),
      assert(report) {
        report.expectStable("domNodes", { maxGrowth: 10 });
        report.expectStable("leak.listeners", { maxGrowth: 0 });
        report.expectStable("leak.timers", { maxGrowth: 0 });
      },
    });
  });
});
```

This pattern is usually more actionable than asserting directly on `heapUsed`, because a failing counter points to the exact class of teardown bug you need to fix.

If your app already exposes test-only globals, do not repeat a custom `page.evaluate(...)` block in every test. `readGlobalMetrics()` keeps those samples terse.

```ts
sample: readGlobalMetrics({
  leak: "window.__LEAK_METRICS__",
  cart: "window.__APP_DEBUG__.cart",
});
```

## Use countDomMetrics for DOM-count samples

If your soak check is mostly about DOM shape, visible control duplication, or embedded frame counts, prefer `countDomMetrics()` instead of writing a custom `page.evaluate(...)` block.

```ts
import { countDomMetrics, memorySoak, withPage } from "bunny-test";

test("cart toggle does not duplicate controls", async () => {
  await withPage(process.env.BROWSER_BASE_URL!, async (page) => {
    await memorySoak(page, {
      iterations: 10,
      warmup: 5,
      sampleEvery: 5,
      action: async (page) => {
        await page.click("button[aria-label='Add to Cart']");
        await page.click("button[aria-label='Remove from Cart']");
      },
      sample: countDomMetrics({
        frames: "iframe",
        addButtons: { selector: "button", text: "Add to Cart" },
        removeButtons: { selector: "button", text: "Remove from Cart" },
      }),
      assert(report) {
        report.expectStable("domNodes", { maxGrowth: 20 });
        report.expectStable("frames", { maxGrowth: 0 });
        report.expectStable("addButtons", { maxGrowth: 0 });
        report.expectStable("removeButtons", { maxGrowth: 0 });
      },
    });
  });
});
```

Use app-level counters when you can, but for many real regressions this helper is enough to catch duplicated buttons, leftover portals, repeated embeds, or controls that never get torn down.

## Triage failures by layer

When a first test fails, separate the failure before changing the assertion strategy.

1. Server startup: if you are using `withServerPage()`, confirm the same app command and host/port work outside the test.
2. Reachability: if the app is managed elsewhere, confirm the URL is already live or wait for it explicitly before running the suite.
3. Page identity: check the final URL and title before relying on deeper selectors.
4. SSR content: assert one stable heading, landmark, or CTA before adding interaction-heavy checks.
5. Client runtime: if SSR content renders but later checks fail, the issue may be hydration, app environment, or client-only code rather than `bunny-test`.
6. Visual instability: if only screenshots fail, narrow the capture region, set explicit dimensions, and mask animated or transient UI.

If you need a quick snapshot of what actually rendered, use `page.debug()` before adding more waits.
