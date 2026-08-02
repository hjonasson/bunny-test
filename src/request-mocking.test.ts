import { afterEach, expect as bunExpect, test } from "bun:test";
import { Browser, Page } from "./index";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<!DOCTYPE html><html><body>${body}</body></html>`)}`;

const pages: Page[] = [];
afterEach(() => {
  for (const page of pages.splice(0)) page.close();
});

test("context.route fulfills fetch with mocked json", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();

  await context.route("/api/user", {
    fulfill: {
      json: { name: "Ada Lovelace", role: "admin" },
      headers: { "x-mocked": "yes" },
    },
  });

  const page = await context.newPage(
    html(`
      <div id="result">pending</div>
      <script>
        setTimeout(() => {
          fetch('/api/user')
            .then((response) => response.json())
            .then((data) => {
              document.querySelector('#result').textContent = data.name + '|' + data.role;
            });
        }, 250);
      </script>
    `),
  );
  pages.push(page);

  const response = await page.waitForResponse(
    (event) => event.url.includes("/api/user") && event.ok,
    { timeout: 2000 },
  );
  await page.waitForText("#result", "Ada Lovelace|admin", { timeout: 2000 });

  bunExpect(response.mocked).toBe(true);
  bunExpect(response.status).toBe(200);
  bunExpect(
    await page.evaluate<string>(`document.querySelector('#result').textContent`),
  ).toBe("Ada Lovelace|admin");

  await browser.close();
});

test("context.route can abort matching fetch requests", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();

  await context.route(/\/api\/fail/, {
    abort: true,
  });

  const page = await context.newPage(
    html(`
      <div id="result">pending</div>
      <script>
        setTimeout(() => {
          fetch('/api/fail')
            .then(() => {
              document.querySelector('#result').textContent = 'unexpected-success';
            })
            .catch((error) => {
              document.querySelector('#result').textContent = error.message;
            });
        }, 250);
      </script>
    `),
  );
  pages.push(page);

  const response = await page.waitForResponse(
    (event) => event.url.includes("/api/fail") && !event.ok,
    { timeout: 2000 },
  );
  await page.waitForText("#result", "Request aborted by mock route", {
    timeout: 2000,
  });

  bunExpect(response.mocked).toBe(true);
  bunExpect(response.status).toBe(0);

  await browser.close();
});

test("context.unroute removes mocks for subsequent navigations", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();

  await context.route("/api/message", {
    fulfill: { body: "first" },
  });

  let page = await context.newPage(
    html(`
      <div id="result">pending</div>
      <script>
        setTimeout(() => {
          fetch('/api/message')
            .then((response) => response.text())
            .then((text) => {
              document.querySelector('#result').textContent = text;
            });
        }, 250);
      </script>
    `),
  );
  pages.push(page);

  await page.waitForText("#result", "first", { timeout: 2000 });

  await context.unroute("/api/message");
  await context.route("/api/message", {
    fulfill: { body: "second" },
  });

  page = await context.newPage(
    html(`
      <div id="result">pending</div>
      <script>
        setTimeout(() => {
          fetch('/api/message')
            .then((response) => response.text())
            .then((text) => {
              document.querySelector('#result').textContent = text;
            });
        }, 250);
      </script>
    `),
  );
  pages.push(page);

  await page.waitForText("#result", "second", { timeout: 2000 });
  bunExpect(
    await page.evaluate<string>(`document.querySelector('#result').textContent`),
  ).toBe("second");

  await browser.close();
});
