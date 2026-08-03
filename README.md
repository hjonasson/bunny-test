# bunny-test

![bunny-test logo](./assets/branding/bunny-test-readme.png)

`bunny-test` is a Bun-first browser testing library for small end-to-end and UI workflow tests.

It is built for cases where you want to launch a real page, interact with it like a user, and make assertions against rendered UI, network activity, storage state, and screenshots.

Typical uses include:

- checking that a page renders the expected content
- filling forms and submitting flows
- asserting on URL changes and visible text
- waiting for network requests and mocking responses
- persisting cookies and storage between sessions
- comparing screenshots for visual regressions

## Scope

`bunny-test` is designed for focused browser tests that stay close to `bun test`.

- It launches pages directly from Bun.
- It provides page, locator, network, storage, and screenshot helpers.
- It keeps setup small and test code explicit.

## Installation

```bash
bun add -d bunny-test
```

## Core API

The main pieces are:

- `Page` for launching and driving a page
- `expect` for page and locator assertions
- `withPage()` for scoped page setup and teardown
- `withServerPage()` for starting an app process and opening it
- `waitForServer()` for readiness polling
- `screenshotName()` for stable screenshot snapshot names

## Quick start

```ts
import { test } from "bun:test";
import { Page, expect } from "bunny-test";

test("user can sign in", async () => {
  await using page = await Page.launch("http://localhost:3000");

  await page.fill("input[name='email']", "user@example.com");
  await page.fill("input[name='password']", "correct-horse-battery-staple");
  await page.click("button[type='submit']");

  await expect(page.byText("Thanks for signing in")).toBeVisible();
  await expect(page).toHaveURL(/dashboard/);
});
```

If you prefer scoped setup instead of `using`, you can wrap the test in `withPage()`:

```ts
import { test } from "bun:test";
import { expect, withPage } from "bunny-test";

test("account menu opens", async () => {
  await withPage("http://localhost:3000", async (page) => {
    await page.click("button[aria-label='Open account menu']");
    await expect(page.byRole("menu")).toBeVisible();
  });
});
```

## Starting a real app

Use `withServerPage()` when the test should start an application process, wait for it to become reachable, and clean it up afterward.

```ts
import { test } from "bun:test";
import { expect, withServerPage } from "bunny-test";

test("front page shows welcome content", async () => {
  await withServerPage(
    {
      server: {
        command: ["bun", "run", "start"],
        url: "http://127.0.0.1:4173",
      },
    },
    async (page) => {
      await expect(page).toHaveTitle(/my app/i);
      await expect(page.byRole("heading", { name: /welcome/i })).toBeVisible();
      await expect(page.byRole("link", { name: /get started/i })).toBeVisible();
    },
  );
});
```

By default, `withServerPage()` derives `HOST` and `PORT` from `server.url`. You can still pass `env` for extra variables, customize the variable names with `bindEnv: { host: "APP_HOST", port: "APP_PORT" }`, or disable that behavior with `bindEnv: false`.

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

Locators can also target roles and text:

```ts
const submit = page.byRole("button", { name: "Submit" });
await expect(submit).toBeVisible();
await submit.click();
```

## Network and state

`bunny-test` can observe requests, wait for specific traffic, and carry state between runs.

Common patterns include:

- waiting for a request triggered by a click or form submission
- mocking a lightweight API response for a single test
- saving cookies and storage state, then restoring them for a later session

## Screenshot testing

```ts
import { test } from "bun:test";
import { Page, expect, screenshotName } from "bunny-test";

test("home page matches screenshot", async () => {
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

## When to use it

`bunny-test` works well when your test needs a real page and a small amount of browser automation, but you still want the test body to stay close to normal Bun tests.

It is a good fit for:

- app smoke tests
- UI workflow checks
- screenshot regression coverage
- request and response assertions
- tests that need browser storage or cookies

## Current requirements

- Bun `>=1.3.14`
- `bun test` as the test runner
