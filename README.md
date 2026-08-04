# bunny-test

[![npm version](https://img.shields.io/npm/v/bunny-test.svg)](https://www.npmjs.com/package/bunny-test)

![bunny-test logo](https://raw.githubusercontent.com/hjonasson/bunny-test/main/assets/branding/bunny-test-readme.png)

`bunny-test` is a Bun-first browser testing library for small end-to-end and UI workflow tests.

It is built for cases where you want to launch a real page, interact with it like a user, and make assertions against rendered UI, network activity, storage state, and screenshots.

Why teams reach for it:

- **Zero Browser Downloads:** Uses system WebKit and local browser installs out of the box.
- **Instant Startup:** Starts fast for lightweight end-to-end checks without heavyweight test runner overhead.
- **Built for Bun:** Native TypeScript with a small surface area and minimal extra tooling.

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

## Choosing a setup style

Use `withPage()` by default when your app is already running, expensive to boot, or managed outside the test process.

This is usually the right fit for larger frontend apps, docs sites, and framework dev servers.

Use `withServerPage()` when the test should fully own app startup, wait for the server, and clean it up afterward.

## Starting a real app

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

By default, `withServerPage()` derives `HOST` and `PORT` from `server.url`. You can still pass `env` for extra variables, customize the variable names with `bindEnv: { host: "APP_HOST", port: "APP_PORT" }`, or disable that behavior with `bindEnv: false`.

If you already have a long-lived server managed elsewhere, use `withPage()` directly. If you only need readiness polling, `waitForServer()` is also exported as a lower-level helper.

## Running a whole suite

For most projects, the best default is simple:

- start one app server outside the tests
- preload one shared base URL for the suite
- keep each test as a normal test that uses `withPage()`

This keeps browser tests close to unit tests while still using a real page when needed.

If you only want one robust, ergonomic setup to copy, use the three files below.

More practical setup and stability advice lives in [docs/TIPS.md](./docs/TIPS.md).

### 1. Add a shared setup file

Bun can preload a setup file before tests. This is the closest equivalent to a `jest-setup.ts` file.

```toml
# bunfig.toml
[test]
preload = ["./test/setup.ts"]
timeout = 30000
```

```ts
// test/setup.ts
process.env.BROWSER_BASE_URL ??= "http://127.0.0.1:3000";
```

Then your tests can assume a base URL.

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

### 2. Start the app once for the suite

Use a small wrapper script to start the app, wait for it, run `bun test`, and stop the app when the run finishes.

```ts
// scripts/test.ts
import { waitForServer } from "bunny-test";

const url = "http://127.0.0.1:3000";

const server = Bun.spawn(["bun", "run", "start"], {
  stdout: "inherit",
  stderr: "inherit",
  env: {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: "3000",
    BROWSER_BASE_URL: url,
  },
});

try {
  await waitForServer(url, { timeout: 20000 });

  const tests = Bun.spawn(["bun", "test", ...process.argv.slice(2)], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    env: process.env,
  });

  process.exit(await tests.exited);
} finally {
  server.kill();
}
```

### 3. Add one package script

```json
{
  "scripts": {
    "test": "bun run ./scripts/test.ts"
  }
}
```

Now the whole suite runs through your normal test script:

```bash
bun run test
```

If you also use `npm test`, it will follow the same path.

`bun test` itself does not run `package.json` scripts first, so if you want the app server to start automatically from a wrapper, use `bun run test` for this setup.

- same test files
- same `test()` functions
- same per-test isolation at the page level
- no special per-test server lifecycle unless you explicitly want it

Use `withServerPage()` when a test should be fully self-contained. Use the shared-server pattern above when you want the lowest friction for a larger suite.

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
