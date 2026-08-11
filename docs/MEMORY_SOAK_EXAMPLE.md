# Memory Soak Example

This example shows a realistic app-level memory soak test against a cart toggle flow.

It uses:

- `withServerPage()` to boot the app for the test
- `memorySoak()` to repeat the workflow
- `countDomMetrics()` to watch for duplicated controls or embedded frames
- `readGlobalMetrics()` to sample app-owned debug counters when they exist

```ts
import * as net from "node:net";
import { test } from "bun:test";
import {
  countDomMetrics,
  expect,
  memorySoak,
  readGlobalMetrics,
  withServerPage,
} from "bunny-test";

const inStockBook = {
  slug: "bbq",
};

test("cart toggle memory soak", { timeout: 90_000 }, async () => {
  const url = await getAvailableUrl();

  await withServerPage(
    {
      height: 1800,
      server: {
        command: ["node", "--import", "remix/node-tsx", "server.ts"],
        url,
        timeout: 20_000,
        env: {
          ...process.env,
          NODE_ENV: "test",
          RESET_DB_ON_STARTUP: "1",
        },
      },
    },
    async (page) => {
      const cardSelector = `[data-test-slug="${inStockBook.slug}"]`;

      await expect(page).toHaveURL(new RegExp(`^${escapeRegExp(url)}/?$`));
      await expect(page.locator(cardSelector)).toBeVisible();

      await memorySoak(page, {
        iterations: 10,
        warmup: 5,
        sampleEvery: 5,
        beforeAll: async (page) => {
          await scrollCardIntoView(page, cardSelector);
          await expect(
            page
              .locator(cardSelector)
              .getByRole("button", { name: "Add to Cart" }),
          ).toBeVisible();
        },
        action: async (page) => {
          const card = page.locator(cardSelector);

          await scrollCardIntoView(page, cardSelector);
          await clickCartButton(
            card.getByRole("button", { name: "Add to Cart" }),
          );
          await expect(
            card.getByRole("button", { name: "Remove from Cart" }),
          ).toBeVisible({ timeout: 10_000 });

          await clickCartButton(
            card.getByRole("button", { name: "Remove from Cart" }),
          );
          await expect(
            card.getByRole("button", { name: "Add to Cart" }),
          ).toBeVisible({ timeout: 10_000 });
        },
        sample: async (page) => ({
          ...(await countDomMetrics({
            frames: "iframe",
            addButtons: { selector: "button", text: "Add to Cart" },
            removeButtons: { selector: "button", text: "Remove from Cart" },
          })(page)),
          ...(await readGlobalMetrics({
            leak: "window.__LEAK_METRICS__",
          })(page)),
        }),
        assert(report) {
          report.expectStable("domNodes", { maxGrowth: 20 });
          report.expectStable("frames", { maxGrowth: 0 });
          report.expectStable("addButtons", { maxGrowth: 0 });
          report.expectStable("removeButtons", { maxGrowth: 0 });
          report.expectStable("leak.listeners", {
            maxGrowth: 0,
            allowMissing: true,
          });
          report.expectStable("leak.timers", {
            maxGrowth: 0,
            allowMissing: true,
          });

          report.printSummary();
        },
      });
    },
  );
});

async function clickCartButton(button) {
  for (let attempt = 0; attempt < 10; attempt++) {
    await button.click();

    try {
      await expect(button).toBeHidden({ timeout: 1_000 });
      return;
    } catch {
      // Retry until the UI reflects the cart mutation.
    }
  }

  throw new Error("Timed out waiting for cart button state to update");
}

async function scrollCardIntoView(page, selector) {
  await page.evaluate(
    `document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({ block: "center" })`,
  );
}

async function getAvailableUrl() {
  const port = await new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Failed to determine open port")));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(address.port);
      });
    });
  });

  return `http://127.0.0.1:${port}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

This shape works well when:

- the app needs a real server boot
- the UI state change is visible and assertable
- you want both DOM-level checks and optional app-owned leak counters

Start with the smallest useful sample.

- Use `countDomMetrics()` when the likely regression is duplicated controls, leftover portals, or embedded frames.
- Use `readGlobalMetrics()` when the app already exposes test-only counters such as listeners, timers, subscriptions, or sockets.
- Use both when you want a user-visible check and an implementation-level check in the same soak run.
