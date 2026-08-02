# bunny-test

![bunny-test logo](./assets/branding/bunny-test-readme.png)

`bunny-test` is a lightweight Bun-first end-to-end test framework for browser flows that need more fidelity than DOM-only testing, without trying to be Playwright.

Brand assets:

- README banner: `assets/branding/bunny-test-readme.png`
- Avatar: `assets/branding/bunny-test-avatar-512.png`
- Favicon source: `assets/branding/bunny-test-favicon-64.png`

It is aimed at small, realistic tasks such as:

- loading a real page and asserting visible UI
- filling forms and clicking through flows
- observing fetch/xhr traffic
- mocking lightweight network interactions
- persisting storage state between tests
- comparing screenshots for visual regressions

## Scope

`bunny-test` is intentionally narrow.

- It is for lightweight browser automation and assertions.
- It is not trying to match Playwright feature-for-feature.
- It is designed to pair well with `bun test`.

## Installation

```bash
bun add -d bunny-test
```

## Quick start

```ts
import { test } from "bun:test";
import { Page, expect } from "bunny-test";

test("user can submit the form", async () => {
  await using page = await Page.launch("http://localhost:3000");

  await page.fill("input[name='email']", "user@example.com");
  await page.click("button[type='submit']");

  await expect(page).toHaveURL(/dashboard/);
});
```

## Starting a real app

For app-level tests, the easiest path should be one helper that starts the app, waits for readiness, opens the page, and tears everything down:

```ts
import { test } from "bun:test";
import { expect, withServerPage } from "bunny-test";

test("front page renders expected content", async () => {
  await withServerPage(
    {
      server: {
        command: ["bun", "run", "start"],
        url: "http://127.0.0.1:4173",
      },
    },
    async (page) => {
      await expect(page).toHaveTitle("New React Router App");
      await expect(page.byText("What's next?")).toBeVisible();
      await expect(
        page.byRole("link", { name: "React Router Docs" }),
      ).toBeVisible();
    },
  );
});
```

By default, `withServerPage()` derives `HOST` and `PORT` from `server.url`. You can still pass `env` for anything extra, customize the variable names with `bindEnv: { host: "APP_HOST", port: "APP_PORT" }`, or disable the behavior with `bindEnv: false`.

If you already have a long-lived server managed elsewhere, use `withPage()` directly. If you only need readiness polling, `waitForServer()` is also exported as a lower-level helper.

## Locator-style usage

```ts
import { test } from "bun:test";
import { Page, expect } from "bunny-test";

test("status message becomes visible", async () => {
  await using page = await Page.launch("http://localhost:3000");

  const message = page.locator("[data-testid='status']");
  await expect(message).toBeVisible({ timeout: 1000 });
  await expect(message).toHaveText("Ready");
});
```

## Screenshot testing

```ts
import { test } from "bun:test";
import { Page, expect, screenshotName } from "bunny-test";

test("home page screenshot", async () => {
  await using page = await Page.launch("http://localhost:3000", {
    width: 1280,
    height: 720,
  });

  await expect(page).toMatchScreenshot(
    screenshotName(import.meta.path, "home-page"),
  );
});
```

Snapshots are stored in `__screenshots__/` by default. The first run creates the baseline PNG. Later runs compare the latest screenshot against that baseline and write `__actual__/` and `__diff__/` files when pixels change.

Element-level screenshots work through locators:

```ts
const card = page.locator("[data-testid='card']");
await expect(card).toMatchScreenshot(screenshotName(import.meta.path, "card"));
```

You can mask unstable regions like cursors, timestamps, or animations:

```ts
await expect(page).toMatchScreenshot(
  screenshotName(import.meta.path, "dashboard"),
  {
    mask: ["[data-testid='clock']", page.locator("[data-testid='cursor']")],
  },
);
```

To refresh baselines intentionally:

```bash
UPDATE_SCREENSHOTS=1 bun test
```

## Current requirements

- Bun `>=1.3.14`
- `bun test` as the test runner

## Release checklist

Before publishing a new version:

1. Run `npm run build`.
2. Run `bun test src/server.test.ts`.
3. Run any broader `bun test` coverage you want for the release.
4. Run `npm pack --dry-run` and inspect the tarball contents.
5. Confirm `package.json` metadata is correct for the public repo and npm page.
6. Bump `version` in `package.json`.
7. Publish with `npm publish`.

## Non-goals

- full Playwright parity
- cross-runner abstraction across Jest, Vitest, and Node-only environments
- large-scale browser orchestration
