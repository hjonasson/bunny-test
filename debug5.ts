import { readFileSync } from "fs";
import { resolve } from "path";

const TL_SCRIPT = readFileSync(resolve(import.meta.dir, "src/testing-library-bundle.js"), "utf8");
const TL_BASE64 = Buffer.from(TL_SCRIPT).toString("base64");

await using view = new Bun.WebView();

// Test with data: URL like the tests use
await view.navigate("data:text/html," + encodeURIComponent(`<html><head></head><body><button>Click me</button></body></html>`));

console.log("URL:", view.url);
console.log("has document.head:", await view.evaluate(`!!document.head`));

await view.evaluate(`(function() {
  var script = document.createElement("script");
  script.textContent = atob(${JSON.stringify(TL_BASE64)});
  document.head.appendChild(script);
  window.__bunTLInjected = true;
})()`);

console.log("__TL__ type:", await view.evaluate(`typeof window.__TL__`));

const result = await view.evaluate(`(function() {
  try {
    var el = window.__TL__.getByRole(document.body, "button", {});
    if (!el) return { ok: false, reason: "null" };
    el.setAttribute("data-ref", "test");
    return { ok: true, selector: "[data-ref='test']" };
  } catch(e) {
    return { ok: false, reason: e.message };
  }
})()`);

console.log("Query result:", result);
