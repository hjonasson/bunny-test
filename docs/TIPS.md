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

## Triage failures by layer

When a first test fails, separate the failure before changing the assertion strategy.

1. Server startup: if you are using `withServerPage()`, confirm the same app command and host/port work outside the test.
2. Reachability: if the app is managed elsewhere, confirm the URL is already live or wait for it explicitly before running the suite.
3. Page identity: check the final URL and title before relying on deeper selectors.
4. SSR content: assert one stable heading, landmark, or CTA before adding interaction-heavy checks.
5. Client runtime: if SSR content renders but later checks fail, the issue may be hydration, app environment, or client-only code rather than `bunny-test`.
6. Visual instability: if only screenshots fail, narrow the capture region, set explicit dimensions, and mask animated or transient UI.

If you need a quick snapshot of what actually rendered, use `page.debug()` before adding more waits.
