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
