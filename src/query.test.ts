import { test, expect, afterEach } from "bun:test";
import { Page } from "../src/page";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<html><body>${body}</body></html>`)}`;

let page: Page;
afterEach(() => page?.close());

test("getByRole — finds a button", async () => {
  page = await Page.launch(html(`<button>Click me</button>`));
  const selector = await page.getByRole("button", { name: "Click me" });
  expect(selector).toBeString();
  expect(selector).toStartWith("[data-bun-tl-ref=");
});

test("getByRole — supports regex names", async () => {
  page = await Page.launch(html(`<h1>Welcome home</h1>`));
  const selector = await page.getByRole("heading", { name: /welcome/i });
  expect(selector).toBeString();
  expect(selector).toStartWith("[data-bun-tl-ref=");
});

test("getByRole — throws with accessible diagnostics when not found", async () => {
  page = await Page.launch(html(`<div>nothing</div>`));
  try {
    await page.getByRole("button", { name: "Ghost" });
    throw new Error("Expected getByRole to fail");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    expect(message).toContain(
      'Could not find element: role="button" name="Ghost"',
    );
    expect(message).toContain("Available roles:");
    expect(message).toContain("<body>");
  }
});

test("getByText — throws with a DOM snapshot when not found", async () => {
  page = await Page.launch(html(`<button>Save</button>`));

  try {
    await page.getByText("Ghost");
    throw new Error("Expected getByText to fail");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    expect(message).toContain('Could not find element: text="Ghost"');
    expect(message).toContain("<button>");
    expect(message).toContain("Save");
  }
});

test("queryByRole — returns null when not found", async () => {
  page = await Page.launch(html(`<div>nothing</div>`));
  const result = await page.queryByRole("button", { name: "Ghost" });
  expect(result).toBeNull();
});

test("getByText — finds element by text content", async () => {
  page = await Page.launch(html(`<p>Hello world</p>`));
  const selector = await page.getByText("Hello world");
  expect(selector).toBeString();
});

test("getByText — supports regex text", async () => {
  page = await Page.launch(html(`<p>Hello world</p>`));
  const selector = await page.getByText(/hello/i);
  expect(selector).toBeString();
});

test("getByLabelText — finds input associated with label", async () => {
  page = await Page.launch(
    html(`
    <label for="email">Email address</label>
    <input id="email" type="email" />
  `),
  );
  const selector = await page.getByLabelText("Email address");
  expect(selector).toBeString();
});

test("getByLabelText — supports regex text", async () => {
  page = await Page.launch(
    html(`
    <label for="email">Email address</label>
    <input id="email" type="email" />
  `),
  );
  const selector = await page.getByLabelText(/email/i);
  expect(selector).toBeString();
});

test("getByPlaceholderText — finds input by placeholder", async () => {
  page = await Page.launch(html(`<input placeholder="Search..." />`));
  const selector = await page.getByPlaceholderText("Search...");
  expect(selector).toBeString();
});

test("getByPlaceholderText — supports regex text", async () => {
  page = await Page.launch(html(`<input placeholder="Search..." />`));
  const selector = await page.getByPlaceholderText(/search/i);
  expect(selector).toBeString();
});

test("getByTestId — finds element by data-testid", async () => {
  page = await Page.launch(
    html(`<div data-testid="hero-section">content</div>`),
  );
  const selector = await page.getByTestId("hero-section");
  expect(selector).toBeString();
});

test("queries survive navigation — TL re-injected automatically", async () => {
  page = await Page.launch(html(`<button>Page one</button>`));
  await page.getByRole("button", { name: "Page one" }); // works on page 1

  await page.navigate(html(`<button>Page two</button>`));
  const selector = await page.getByRole("button", { name: "Page two" }); // should still work
  expect(selector).toBeString();
});
