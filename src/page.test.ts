import { test, expect, afterEach } from "bun:test";
import { Page } from "../src/page";

let page: Page;

afterEach(() => page?.close());

test("launches and reads title", async () => {
  page = await Page.launch("https://example.com");
  const title = await page.evaluate<string>("document.title");
  expect(title).toBe("Example Domain");
});

test("takes a screenshot", async () => {
  page = await Page.launch("https://example.com");
  await page.screenshot("test-output.png");
  const file = Bun.file("test-output.png");
  expect(await file.exists()).toBe(true);
});

test("saves failure screenshot when click fails", async () => {
  page = await Page.launch("https://example.com");
  expect(page.click("#does-not-exist", { timeout: 1000 })).rejects.toThrow(
    '[Page.click("#does-not-exist")]',
  );
});

test("page.debug returns a DOM snapshot with optional roles", async () => {
  page = await Page.launch(
    "data:text/html," +
      encodeURIComponent(`
        <html>
          <body>
            <main>
              <button>Save</button>
              <input aria-label="Email" />
            </main>
          </body>
        </html>
      `),
  );

  const output = await page.debug({ log: false, roles: true });

  expect(output).toContain("<button>");
  expect(output).toContain("Save");
  expect(output).toContain("Available roles:");
  expect(output).toContain("button:");
  expect(output).toContain('Name "Save"');
  expect(output).toContain("textbox:");
  expect(output).toContain('Name "Email"');
});

test("locator.debug returns a subtree snapshot", async () => {
  page = await Page.launch(
    "data:text/html," +
      encodeURIComponent(`
        <html>
          <body>
            <main>
              <button>Save</button>
              <button>Cancel</button>
            </main>
          </body>
        </html>
      `),
  );

  const output = await page
    .byRole("button", { name: "Save" })
    .debug({ log: false });

  expect(output).toContain('role="button" name="Save"');
  expect(output).toContain("<button");
  expect(output).toContain("Save");
  expect(output).not.toContain("Cancel");
});
