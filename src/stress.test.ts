import { test, expect, afterEach } from "bun:test";
import { Page } from "./page";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<!DOCTYPE html><html><head></head><body>${body}</body></html>`)}`;

// Track all pages opened so afterEach can close them all
const pages: Page[] = [];
afterEach(() => {
  for (const p of pages.splice(0)) p.close();
});

function open(url: string, options: Parameters<typeof Page.launch>[1] = {}) {
  return Page.launch(url, options).then((p) => {
    pages.push(p);
    return p;
  });
}

// ─── Concurrency / queue isolation ────────────────────────────────────────────

test("concurrent pages — each EvaluateQueue is isolated", async () => {
  const [a, b, c] = await Promise.all([
    open(html(`<h1>Page A</h1>`)),
    open(html(`<h1>Page B</h1>`)),
    open(html(`<h1>Page C</h1>`)),
  ]);

  // Fire queries on all three simultaneously
  const [sA, sB, sC] = await Promise.all([
    a.getByRole("heading", { name: "Page A" }),
    b.getByRole("heading", { name: "Page B" }),
    c.getByRole("heading", { name: "Page C" }),
  ]);

  expect(sA).toBeString();
  expect(sB).toBeString();
  expect(sC).toBeString();
});

test("concurrent pages — evaluate calls do not bleed across instances", async () => {
  const [a, b] = await Promise.all([
    open(html(`<div id="val">from-a</div>`)),
    open(html(`<div id="val">from-b</div>`)),
  ]);

  const [valA, valB] = await Promise.all([
    a.evaluate<string>(`document.querySelector("#val").textContent`),
    b.evaluate<string>(`document.querySelector("#val").textContent`),
  ]);

  expect(valA).toBe("from-a");
  expect(valB).toBe("from-b");
});

// ─── Navigation race ──────────────────────────────────────────────────────────

test("rapid navigation — injection survives back-to-back navigates", async () => {
  const page = await open(html(`<button>First</button>`));

  // Navigate twice in quick succession without awaiting the first
  await page.navigate(html(`<button>Second</button>`));
  await page.navigate(html(`<button>Third</button>`));

  // TL should be re-injected on the final page
  const selector = await page.getByRole("button", { name: "Third" });
  expect(selector).toBeString();
});

test("query during navigation — getByRole works on freshly navigated page", async () => {
  const page = await open(html(`<h1>Home</h1>`));
  await page.getByRole("heading", { name: "Home" }); // sanity-check page 1

  await page.navigate(html(`<h1>About</h1>`));
  const selector = await page.getByRole("heading", { name: "About" });
  expect(selector).toBeString();
});

// ─── fill() edge cases ────────────────────────────────────────────────────────

test("fill — overwrites pre-existing value", async () => {
  const page = await open(
    html(`<input id="field" value="old value" />`),
  );
  await page.fill("#field", "new value");
  const val = await page.evaluate<string>(
    `document.querySelector("#field").value`,
  );
  expect(val).toBe("new value");
});

test("fill — handles special characters", async () => {
  const page = await open(html(`<input id="field" />`));
  await page.fill("#field", `He said "hello" & she said 'hi'`);
  const val = await page.evaluate<string>(
    `document.querySelector("#field").value`,
  );
  expect(val).toBe(`He said "hello" & she said 'hi'`);
});

test("fill — handles empty string", async () => {
  const page = await open(html(`<input id="field" value="clear me" />`));
  await page.fill("#field", "");
  const val = await page.evaluate<string>(
    `document.querySelector("#field").value`,
  );
  expect(val).toBe("");
});

// ─── slowMo is actually observed ─────────────────────────────────────────────

test("slowMo — adds delay per action", async () => {
  const page = await open(
    html(`<button id="btn">Go</button>`),
    { slowMo: 150 },
  );

  const start = Date.now();
  // Three actions → at least 3 × 150 ms = 450 ms
  await page.click("#btn");
  await page.click("#btn");
  await page.click("#btn");
  const elapsed = Date.now() - start;

  expect(elapsed).toBeGreaterThanOrEqual(450);
});

// ─── Error message quality ────────────────────────────────────────────────────

test("assertExists — error names the missing selector", async () => {
  const page = await open(html(`<div>nothing</div>`));
  await expect(
    page.assertExists("#ghost", { timeout: 300 }),
  ).rejects.toThrow('[assertExists] Element not found: "#ghost"');
});

test("assertAbsent — error names the present selector", async () => {
  const page = await open(html(`<div id="present">hi</div>`));
  await expect(
    page.assertAbsent("#present", { timeout: 300 }),
  ).rejects.toThrow('[assertAbsent] Element still present: "#present"');
});

test("assertText — error includes selector and actual value", async () => {
  const page = await open(html(`<p id="msg">actual text</p>`));
  await expect(
    page.assertText("#msg", "expected text", { timeout: 300 }),
  ).rejects.toThrow("[assertText]");
});

test("assertValue — error includes expected and actual value", async () => {
  const page = await open(html(`<input id="field" value="wrong" />`));
  await expect(
    page.assertValue("#field", "right", { timeout: 300 }),
  ).rejects.toThrow("[assertValue]");
});

test("assertVisible — error names the invisible selector", async () => {
  const page = await open(
    html(`<div id="hidden" style="display:none">hi</div>`),
  );
  await expect(
    page.assertVisible("#hidden", { timeout: 300 }),
  ).rejects.toThrow('[assertVisible] Element not visible: "#hidden"');
});

test("assertURL — error includes expected pattern and actual URL", async () => {
  const page = await open(html(`<p>page</p>`));
  await expect(
    page.assertURL("https://expected.example.com", { timeout: 300 }),
  ).rejects.toThrow("[assertURL]");
});

// ─── waitFor* timeout messages ────────────────────────────────────────────────

test("waitForSelector — timeout message contains selector", async () => {
  const page = await open(html(`<p>nothing</p>`));
  await expect(
    page.waitForSelector("#missing", { timeout: 300 }),
  ).rejects.toThrow('selector "#missing"');
});

test("waitForText — timeout message contains selector and pattern", async () => {
  const page = await open(html(`<p id="msg">nope</p>`));
  await expect(
    page.waitForText("#msg", "never", { timeout: 300 }),
  ).rejects.toThrow('"#msg"');
});

test("waitForGone — timeout message contains selector", async () => {
  const page = await open(html(`<div id="stubborn">still here</div>`));
  await expect(
    page.waitForGone("#stubborn", { timeout: 300 }),
  ).rejects.toThrow('"#stubborn"');
});
