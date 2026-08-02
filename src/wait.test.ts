import { test, expect, afterEach } from "bun:test";
import { Page } from "../src/page";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<html><body>${body}</body></html>`)}`;

let page: Page;
afterEach(() => page?.close());

test("waitForSelector — finds existing element", async () => {
  page = await Page.launch(html(`<div id="box">hello</div>`));
  await page.waitForSelector("#box"); // should not throw
});

test("waitForSelector — waits for late-appearing element", async () => {
  page = await Page.launch(
    html(`
    <script>
      setTimeout(() => {
        const el = document.createElement("div");
        el.id = "late";
        document.body.appendChild(el);
      }, 200);
    </script>
  `),
  );
  await page.waitForSelector("#late", { timeout: 2000 });
});

test("waitForSelector — times out cleanly", async () => {
  page = await Page.launch(html(`<div>nothing here</div>`));
  await expect(
    page.waitForSelector("#ghost", { timeout: 500 }),
  ).rejects.toThrow('Timed out after 500ms waiting for: selector "#ghost"');
});

test("waitForVisible — detects hidden element as not visible", async () => {
  page = await Page.launch(html(`<div id="box" style="display:none">hi</div>`));
  await expect(page.waitForVisible("#box", { timeout: 500 })).rejects.toThrow(
    "to be visible",
  );
});

test("waitForGone — waits for element to be removed", async () => {
  page = await Page.launch(
    html(`
    <div id="spinner">loading...</div>
    <script>setTimeout(() => document.getElementById("spinner").remove(), 200)</script>
  `),
  );
  await page.waitForGone("#spinner", { timeout: 2000 });
});

test("waitForValue — waits for input value", async () => {
  page = await Page.launch(html(`<input id="field" />`));
  await page.evaluate(`
    setTimeout(() => document.getElementById("field").value = "hello", 200)
  `);
  await page.waitForValue("#field", "hello", { timeout: 2000 });
});

test("waitForText — matches substring", async () => {
  page = await Page.launch(
    html(`
    <p id="msg"></p>
    <script>setTimeout(() => document.getElementById("msg").textContent = "Done!", 200)</script>
  `),
  );
  await page.waitForText("#msg", "Done", { timeout: 2000 });
});

test("waitFor — custom expression", async () => {
  page = await Page.launch(
    html(`
    <script>setTimeout(() => window.ready = true, 200)</script>
  `),
  );
  await page.waitFor("window.ready === true", { timeout: 2000 });
});
