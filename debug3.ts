import { readFileSync } from "fs";
import { resolve } from "path";

const TL_SCRIPT = readFileSync(resolve(import.meta.dir, "src/testing-library-bundle.js"), "utf8");
const TL_BASE64 = Buffer.from(TL_SCRIPT).toString("base64");

await using view = new Bun.WebView();
await view.navigate("data:text/html,<html><head></head><body><button>Click me</button></body></html>");

// Test script tag injection
await view.evaluate(`(function() {
  var script = document.createElement("script");
  script.textContent = atob(${JSON.stringify(TL_BASE64)});
  document.head.appendChild(script);
})()`);

// Check immediately
const tlType1 = await view.evaluate(`typeof window.__TL__`);
console.log("__TL__ type immediately after script tag:", tlType1);

// Check all window keys that start with __
const keys = await view.evaluate(`Object.keys(window).filter(k => k.startsWith("__"))`);
console.log("window keys starting with __:", keys);

// Check if TestingLibraryDom exists under any name
const tlKeys = await view.evaluate(`Object.keys(window).filter(k => k.toLowerCase().includes("testing") || k.toLowerCase().includes("dom"))`);
console.log("TL-related window keys:", tlKeys);
