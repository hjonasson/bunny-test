# bunny-test

[![npm version](https://img.shields.io/npm/v/bunny-test.svg)](https://www.npmjs.com/package/bunny-test)

![bunny-test logo](https://raw.githubusercontent.com/hjonasson/bunny-test/main/assets/branding/bunny-test-readme.png)

`bunny-test` is a Bun-first browser testing library for small, real-browser checks.

Use it when you want to:

- open a page in Bun and drive it like a user
- assert on visible UI, URL changes, storage, network, and screenshots
- keep tests small and explicit without a full browser-automation stack

## Installation

```bash
bun add -d bunny-test
```

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

The library focuses on the browser flow itself instead of a large test abstraction layer.

## Common setup

For most projects, start one app server for the suite and point tests at a shared base URL.

```ts
import { test } from "bun:test";
import { withPage, expect } from "bunny-test";

test("account menu opens", async () => {
  await withPage("http://localhost:3000", async (page) => {
    await page.click("button[aria-label='Open account menu']");
    await expect(page.byRole("menu")).toBeVisible();
  });
});
```

If you want a script that boots the app once and then runs `bun test`, see the setup pattern in the examples and README examples for that workflow.

## Core API

The main pieces are:

- `Page` for launching and driving a page
- `expect` for assertions against the page or locators
- `withPage()` for scoped page setup and teardown
- `withServerPage()` for starting an app process and opening it
- `waitForServer()` for readiness polling
- `Browser` and `BrowserContext` for multi-page flows and storage state
- `screenshotName()` for stable screenshot snapshot names

## Advanced patterns

`bunny-test` also includes higher-level helpers for more specific regression checks, including memory-soak and drift detection.

These are useful, but they are not the primary README story. For the heavier patterns and real-world examples, see:

- [docs/TESTING_PATTERNS.md](./docs/TESTING_PATTERNS.md)
- [docs/MEMORY_SOAK_EXAMPLE.md](./docs/MEMORY_SOAK_EXAMPLE.md)

The main package stays focused on the straightforward browser flow tests most teams write first.

## Why use it

- zero extra browser download setup
- fast startup for Bun-based suites
- direct access to page, network, storage, and screenshot behavior
- a small API surface that stays close to real browser workflows

This is a good fit for form flows, route changes, auth checks, smoke tests, and UI regression checks that should run like normal Bun tests.

## Choosing a setup style

Use `withPage()` when your app is already running, expensive to boot, or managed outside the test process.

That is usually the right fit for larger frontend apps, docs sites, and framework dev servers.

Use `withServerPage()` when the test should fully own app startup, wait for the server, and clean it up afterward.

## App setup patterns

### Existing server

If the app is already running, prefer `withPage()`.

```ts
import { test } from "bun:test";
import { expect, withPage } from "bunny-test";

const baseUrl = process.env.BROWSER_BASE_URL!;

test("home page shows welcome content", async () => {
  await withPage(baseUrl, async (page) => {
    await expect(page).toHaveTitle(/my app/i);
    await expect(page.byRole("heading", { name: /welcome/i })).toBeVisible();
    await expect(page.byRole("link", { name: /get started/i })).toBeVisible();
  });
});
```

### Self-contained startup with `withServerPage()`

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

When you use a slower dev server raise Bun's per-test timeout. `withServerPage()` can wait up to `server.timeout`, but it cannot override `bun test`'s default 5000ms test timeout for you.

There are three separate timeout layers to keep in mind:

- Bun's per-test timeout
- `withServerPage()` server startup timeout
- assertion and wait timeouts inside the test

If the app is heavy enough that startup consumes most of that budget, use an existing server plus `withPage()` instead.

```ts
import { test } from "bun:test";
import { expect, withServerPage } from "bunny-test";

test("front page shows welcome content", { timeout: 30000 }, async () => {
  await withServerPage(
    {
      server: {
        command: ["bun", "run", "dev"],
        url: "http://127.0.0.1:3000",
        timeout: 20000,
      },
    },
    async (page) => {
      await expect(page.byRole("heading", { name: /welcome/i })).toBeVisible();
    },
  );
});
```

`withServerPage()` derives `HOST` and `PORT` from `server.url` unless you disable that behavior with `bindEnv: false`. You can still pass extra variables with `env` or customize the variable names with `bindEnv: { host: "APP_HOST", port: "APP_PORT" }`.

If you already have a long-lived server managed elsewhere, use `withPage()` directly. If you only need readiness polling, use `waitForServer()`.

### Shared server for a suite

Use this pattern when your suite already starts one shared app process and exposes `process.env.BROWSER_BASE_URL`.

Once `bunfig.toml` and the wrapper script are in place, each test stays small and uses `withPage()` against `process.env.BROWSER_BASE_URL`.

```ts
import { test } from "bun:test";
import { expect, withPage } from "bunny-test";

const baseUrl = process.env.BROWSER_BASE_URL!;

test("account menu opens", async () => {
  await withPage(baseUrl, async (page) => {
    await expect(page.byText("Tell us about your home")).toBeVisible();
  });
});
```

More practical setup and stability advice lives in [docs/TIPS.md](./docs/TIPS.md).

## Minimal visual smoke test

For a first app-level test, start with SSR-stable content and one narrow screenshot.

This is often a better first step than a full interaction flow, especially for docs sites, large frontend apps, or pages with client-only islands.

```ts
import { test } from "bun:test";
import { expect, screenshotName, withPage } from "bunny-test";

const baseUrl = process.env.BROWSER_BASE_URL!;

test("home page smoke test", async () => {
  const unstableUiMask = ["[data-testid='animated-ui']"];

  await withPage(
    baseUrl,
    async (page) => {
      await expect(page).toHaveTitle(/my app/i);
      await expect(page.byRole("heading", { name: /welcome/i })).toBeVisible();
      await expect(page.byRole("link", { name: /get started/i })).toBeVisible();

      const hero = page.locator("main");

      await expect(hero).toMatchScreenshot(
        screenshotName(import.meta.path, "home-hero"),
        {
          mask: unstableUiMask,
        },
      );
    },
    {
      width: 1280,
      height: 720,
    },
  );
});
```

Replace that selector with the actual animated, transient, or framework-owned UI you want to ignore in your app.

The basic pattern is:

- assert the page title
- assert one or two SSR-visible elements
- capture one stable region
- mask animated or transient UI

For more practical setup, masking, and failure-triage guidance, see [docs/TIPS.md](./docs/TIPS.md).

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

Locators can target roles and text as well:

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

### Authenticated app flows

For apps that require a login, the usual pattern is to authenticate once, save the browser state, and then restore that state into a fresh browser context for each later test.

```ts
import { test } from "bun:test";
import { Browser } from "bunny-test";

test("login once and reuse auth state", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  const page = await context.newPage("https://app.example.com/login");

  await page.fill("#email", "user@example.com");
  await page.fill("#password", "secret");
  await page.click("button[type='submit']");

  const stateFile = await context.saveStorageState();
  console.log("Auth state saved to", stateFile);
  await browser.close();
});

test("dashboard is visible for authenticated users", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  await context.loadStorageState("./auth-state.json");

  const page = await context.newPage("https://app.example.com/dashboard");
  await page.expect("text=Welcome back").toBeVisible();
  await browser.close();
});
```

If you want a durable file on disk, pass a path such as `./auth-state.json`. If you want the library to manage the temporary location for you, call `saveStorageState()` with no path and keep the returned value for the restore call.

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

For practical screenshot stability tips such as masking development overlays or portal UI, see [docs/TIPS.md](./docs/TIPS.md).

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
