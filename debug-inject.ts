await using view = new Bun.WebView();
await view.navigate(
  "data:text/html,<html><body><button>Click me</button></body></html>",
);

// Test 1: inject the bundle
const bundle = await Bun.file("src/testing-library-bundle.js").text();
await view.evaluate(bundle);
console.log("✓ Bundle injected");

// Test 2: assign to window
await view.evaluate(`window.__TL__ = TestingLibraryDom;`);
console.log("✓ Assigned to window.__TL__");

// Test 3: verify it's there
const hasTL = await view.evaluate(`typeof window.__TL__`);
console.log("TL type:", hasTL);

// Test 4: try a raw query
try {
  const result = await view.evaluate(`
    window.__TL__.getByRole(document.body, "button", {})
  `);
  console.log("Query result:", result);
} catch (err) {
  console.error("Query failed:", (err as any).message);
}

// Test 5: try tagging the element
try {
  const result = await view.evaluate(`(() => {
    const el = window.__TL__.getByRole(document.body, "button", {});
    if (!el) return null;
    el.setAttribute("data-ref", "test-1");
    return "[data-ref='test-1']";
  })()`);
  console.log("Tag result:", result);
} catch (err) {
  console.error("Tag failed:", (err as any).message);
}
