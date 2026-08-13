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

## Recommended setup

For most apps, start with one shared app server for the suite and point tests at a shared base URL.

That usually means:

- start the app once for the suite
- preload one shared base URL with `bunfig.toml`
- run the suite through one script that starts the app and then launches `bun test`

This keeps tests close to normal Bun tests while avoiding per-test app startup.

### 1. Add a shared setup file

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

### 2. Start the app once and run the suite

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

Run the suite through one command:

```bash
bun run test
```

If your package script delegates to Bun, `npm test` can call that script too. The underlying test process still needs Bun because the browser layer uses `Bun.WebView`.

## Core API

The main pieces are:

- `Page` for launching and driving a page
- `expect` for page and locator assertions
- `countDomMetrics()` for common memory-soak selector and text-count sampling
- `readGlobalMetrics()` for app-level globals like `window.__LEAK_METRICS__`
- `memorySoak()` for repeated leak and teardown checks over a real page session
- `withPage()` for scoped page setup and teardown
- `withServerPage()` for starting an app process and opening it
- `waitForServer()` for readiness polling
- `screenshotName()` for stable screenshot snapshot names

## Memory soak testing

`memorySoak()` is a higher-level helper for repeated interaction tests where you want to catch unbounded DOM growth, leaked listeners, leftover timers, or custom app diagnostics that should return to baseline.

The helper runs one action many times, lets the page settle, samples metrics, and returns a report with baseline, recorded samples, and helpers like `expectStable()`.

```ts
import { test } from "bun:test";
import { memorySoak, readGlobalMetrics, withPage } from "bunny-test";

test("search dialog does not leak", async () => {
  await withPage(process.env.BROWSER_BASE_URL!, async (page) => {
    await memorySoak(page, {
      iterations: 50,
      warmup: 5,
      sampleEvery: 5,
      action: async (page) => {
        await page.click("[aria-label='Open search']");
        await page.fill("input[type='search']", "alpha");
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

`memorySoak()` includes these built-in metrics unless you disable them with `includeDefaultSample: false`:

- `domNodes`
- `heapUsed` when `performance.memory` is available
- `heapTotal` when `performance.memory` is available

If your app exposes test-only diagnostics such as `window.__LEAK_METRICS__`, prefer asserting on those app-level counters. They are usually more stable and more actionable than raw heap size.

Use the helper that matches the kind of signal you have:

| Helper                | Use it when                                                               | Typical checks                                                           |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `readGlobalMetrics()` | the app already exposes test-only debug state on `window` or `globalThis` | listeners, timers, subscriptions, sockets, cache entries                 |
| `countDomMetrics()`   | the regression is visible in rendered DOM state                           | duplicated buttons, leftover portals, embedded frames, repeated controls |

For app-level diagnostics, prefer `readGlobalMetrics()` over hand-writing a `page.evaluate(...)` callback.

```ts
sample: readGlobalMetrics({
  leak: "window.__LEAK_METRICS__",
  cart: "window.__APP_DEBUG__.cart",
});
```

For DOM-counting checks, prefer `countDomMetrics()` over hand-writing a `page.evaluate(...)` callback every time.

```ts
import { countDomMetrics, memorySoak, withPage } from "bunny-test";

test("cart toggle does not leak DOM state", async () => {
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

This keeps the test logic focused on the workflow and the stability assertions, instead of repeating DOM query boilerplate inside `sample`.

For a fuller app-level example that combines `withServerPage()`, `countDomMetrics()`, `readGlobalMetrics()`, retries, and scrolling, see [docs/MEMORY_SOAK_EXAMPLE.md](./docs/MEMORY_SOAK_EXAMPLE.md).

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

If you want scoped setup instead of `using`, wrap the test in `withPage()`:

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
