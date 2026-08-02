import { afterEach, expect as bunExpect, test } from "bun:test";
import { Browser, Page } from "./index";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<!DOCTYPE html><html><body>${body}</body></html>`)}`;

const pages: Page[] = [];
afterEach(() => {
  for (const page of pages.splice(0)) page.close();
});

test("browser and context create and track pages", async () => {
  const browser = await Browser.launch({ slowMo: 0 });
  const context = await browser.newContext();

  const page = await context.newPage(html(`<h1>Hello</h1>`));
  pages.push(page);

  bunExpect(context.pages()).toHaveLength(1);
  bunExpect(await page.evaluate<string>("document.querySelector('h1').textContent")).toBe(
    "Hello",
  );

  await browser.close();
  bunExpect(page.isClosed).toBe(true);
});

test("page.goto resolves against baseURL", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  const page = await context.newPage(html(`<h1>Base</h1>`));
  pages.push(page);

  await page.goto(html(`<h1>Next</h1>`));
  bunExpect(
    await page.evaluate<string>("document.querySelector('h1').textContent"),
  ).toBe("Next");

  await browser.close();
});

test("scoped locator queries stay inside the parent locator", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  const page = await context.newPage(
    html(`
      <section data-testid="outside"><button>Save</button></section>
      <section data-testid="inside">
        <button>Cancel</button>
        <button>Save</button>
      </section>
    `),
  );
  pages.push(page);

  const inside = page.byTestId("inside");
  const button = inside.getByRole("button", { name: "Save" });
  bunExpect(await button.textContent()).toContain("Save");

  await button.click();
  await browser.close();
});

test("waitForRequest and waitForResponse observe fetch traffic", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  const page = await context.newPage(
    html(`
      <script>
        setTimeout(() => {
          fetch('data:text/plain,ok').then((response) => response.text());
        }, 250);
      </script>
    `),
  );
  pages.push(page);

  const [request, response] = await Promise.all([
    page.waitForRequest(/data:text\/plain/, {
      timeout: 2000,
    }),
    page.waitForResponse(
      (event) => event.url.includes("data:text/plain") && event.ok,
      { timeout: 2000 },
    ),
  ]);

  bunExpect(request.method).toBe("GET");
  bunExpect(response.status).toBe(200);

  await browser.close();
});

test("page.route forwards to the owning context", async () => {
  const browser = await Browser.launch();
  const context = await browser.newContext();
  const page = await context.newPage(
    html(`
      <div id="result">pending</div>
      <script>
        setTimeout(() => {
          fetch('/api/from-page')
            .then((response) => response.text())
            .then((text) => {
              document.querySelector('#result').textContent = text;
            });
        }, 200);
      </script>
    `),
  );
  pages.push(page);

  await page.route("/api/from-page", { fulfill: { body: "ok" } });
  await page.waitForText("#result", "ok", { timeout: 2000 });
  bunExpect(page.context()).toBe(context);

  await browser.close();
});
