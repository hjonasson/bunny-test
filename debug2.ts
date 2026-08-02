// debug2.ts - full file
await using view = new Bun.WebView();
await view.navigate(
  "data:text/html,<html><body><button>Click me</button></body></html>",
);

const bundle = await Bun.file("src/testing-library-bundle.js").text();

// Step 1: inject
await view.evaluate(
  `(function() { ${bundle}; window.TestingLibraryDom = TestingLibraryDom; })()`,
);
console.log("✓ Bundle injected");

// Step 2: confirm TL is there
const tl = await view.evaluate(`typeof window.TestingLibraryDom`);
console.log("TL type:", tl);

// Step 3: check the button is actually in the DOM
const hasButton = await view.evaluate(`!!document.querySelector("button")`);
console.log("Button in DOM:", hasButton);

// Step 4: try getByRole in isolation, catch the full error
const result = await view.evaluate(`(() => {
  try {
    const el = window.TestingLibraryDom.getByRole(document.body, "button", {});
    if (!el) return { ok: false, reason: "null element" };
    const ref = "bun-" + Math.random().toString(36).slice(2, 9);
    el.setAttribute("data-bun-tl-ref", ref);
    return { ok: true, selector: "[data-bun-tl-ref='" + ref + "']" };
  } catch(e) {
    return { ok: false, reason: e.message };
  }
})()`);

console.log("Result:", result);
