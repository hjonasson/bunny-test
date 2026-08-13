import { afterEach, expect, test } from "bun:test";
import { Page } from "./page";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<!DOCTYPE html><html><body>${body}</body></html>`)}`;

let page: Page;

afterEach(() => page?.close());

test("measureNavigation records ack and commit timings", async () => {
  page = await Page.launch(
    html(`
      <main>
        <button id="go">Go</button>
      </main>
      <script>
        document.querySelector('#go').addEventListener('click', () => {
          setTimeout(() => history.pushState({}, '', '#details'), 60);
          setTimeout(() => {
            const marker = document.createElement('div');
            marker.id = 'details';
            marker.textContent = 'Ready';
            document.body.appendChild(marker);
          }, 180);
        });
      </script>
    `),
  );

  const measurement = await page.measureNavigation({
    action: () => page.click("#go"),
    ack: { signal: { type: "urlChanged" }, timeout: 500 },
    commit: {
      signal: [
        { type: "urlMatches", value: /#details$/ },
        { type: "elementVisible", selector: "#details" },
      ],
      timeout: 1_000,
    },
  });

  expect(measurement.ack).not.toBeNull();
  expect(measurement.ack?.elapsedMs).toBeGreaterThanOrEqual(20);
  expect(measurement.ack?.elapsedMs).toBeLessThan(500);
  expect(measurement.commit.elapsedMs).toBeGreaterThanOrEqual(
    measurement.ack?.elapsedMs ?? 0,
  );
  expect(measurement.commit.elapsedMs).toBeLessThan(1_000);
  expect(measurement.summary()).toContain("Navigation performance");
});

test("expectNavigationPerformance supports any-of ack signals", async () => {
  page = await Page.launch(
    html(`
      <main id="app">
        <button id="go">Go</button>
      </main>
      <script>
        document.querySelector('#go').addEventListener('click', () => {
          setTimeout(() => {
            document.querySelector('#app').setAttribute('aria-busy', 'true');
          }, 40);
          setTimeout(() => history.pushState({}, '', '#done'), 120);
          setTimeout(() => {
            const done = document.createElement('div');
            done.id = 'done';
            done.textContent = 'Done';
            document.body.appendChild(done);
            document.querySelector('#app').setAttribute('aria-busy', 'false');
          }, 200);
        });
      </script>
    `),
  );

  const measurement = await page.expectNavigationPerformance({
    action: () => page.click("#go"),
    ack: {
      signal: [{ type: "ariaBusy", selector: "#app" }, { type: "urlChanged" }],
      match: "any",
      timeout: 400,
      maxMs: 250,
    },
    commit: {
      signal: [
        { type: "urlMatches", value: /#done$/ },
        { type: "elementVisible", selector: "#done" },
      ],
      timeout: 1_000,
      maxMs: 700,
    },
  });

  expect(measurement.ack?.matchedSignals[0]?.description).toContain("ariaBusy");
  expect(measurement.commit.elapsedMs).toBeLessThan(700);
});

test("expectNavigationPerformance surfaces phase timeout details", async () => {
  page = await Page.launch(
    html(`
      <button id="go">Go</button>
      <script>
        document.querySelector('#go').addEventListener('click', () => {});
      </script>
    `),
  );

  await expect(
    page.expectNavigationPerformance({
      action: () => page.click("#go"),
      ack: { signal: { type: "urlChanged" }, timeout: 120 },
      commit: { signal: { type: "urlMatches", value: /#done$/ }, timeout: 120 },
    }),
  ).rejects.toThrow("waiting for navigation ack");
});
