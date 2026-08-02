await using view = new Bun.WebView();
await view.navigate("https://www.google.com");

// --- 1. Assert the input exists ---
const selector = 'input[name="q"]';

const exists = await view.evaluate(`!!document.querySelector('${selector}')`);
if (!exists) throw new Error(`Search input not found`);
console.log("✓ Search input exists");

// --- 2. Screenshot before typing ---
await Bun.write("before.png", await view.screenshot({ format: "png" }));
console.log("✓ Screenshot saved: before.png");

// --- 3. Click to focus and type ---
await view.click(selector);
await view.type("bun javascript runtime");

// --- 4. Assert the value landed ---
const value = await view.evaluate(
  `document.querySelector('${selector}').value`,
);
if (value !== "bun javascript runtime") {
  throw new Error(`Expected "bun javascript runtime" but got "${value}"`);
}
console.log("✓ Typed successfully:", value);

// --- 5. Screenshot after typing ---
await Bun.write("after.png", await view.screenshot({ format: "png" }));
console.log("✓ Screenshot saved: after.png");
