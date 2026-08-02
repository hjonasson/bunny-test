import { test, expect, afterEach } from "bun:test";
import { Page } from "./page";

const EXAMPLE_HTML = `<html lang="en"><head><title>Example Domain</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#eee;width:60vw;margin:15vh auto;font-family:system-ui,sans-serif}h1{font-size:1.5em}div{opacity:0.8}a:link,a:visited{color:#348}</style></head><body><div><h1>Example Domain</h1><p>This domain is for use in documentation examples without needing permission. Avoid use in operations.</p><p><a href="https://iana.org/domains/example">Learn more</a></p></div>
</body></html>`;

const url = `data:text/html,${encodeURIComponent(EXAMPLE_HTML)}`;

let page: Page;
afterEach(() => page?.close());

test("has correct title", async () => {
  page = await Page.launch(url);
  const title = await page.evaluate("document.title");
  expect(title).toBe("Example Domain");
});

test("shows the heading", async () => {
  page = await Page.launch(url);
  const selector = await page.getByRole("heading", { name: "Example Domain" });
  expect(selector).toBeString();
});

test("shows the description paragraph", async () => {
  page = await Page.launch(url);
  const selector = await page.getByText(
    "This domain is for use in documentation examples without needing permission. Avoid use in operations.",
  );
  expect(selector).toBeString();
});

test("has a Learn more link", async () => {
  page = await Page.launch(url);
  const selector = await page.getByRole("link", { name: "Learn more" });
  expect(selector).toBeString();
});

test("Learn more link points to iana.org", async () => {
  page = await Page.launch(url);
  const href = await page.evaluate(
    `document.querySelector("a")?.getAttribute("href")`,
  );
  expect(href).toBe("https://iana.org/domains/example");
});
