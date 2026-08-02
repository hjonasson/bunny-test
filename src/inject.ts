import { readFileSync } from "fs";
import { resolve } from "path";
import type { EvaluateQueue } from "./evaluate-queue";

const TL_SCRIPT = readFileSync(
  resolve(import.meta.dir, "testing-library-bundle.js"),
  "utf8",
);

// Base64 encode so we can use it as a data: URL script src
const TL_BASE64 = Buffer.from(TL_SCRIPT).toString("base64");

const INJECTION_MARKER = "__bunTLInjected";
const NETWORK_MARKER = "__bunE2ENetworkInjected";

export async function ensureInjected(
  view: Bun.WebView,
  queue: EvaluateQueue,
): Promise<void> {
  const already = await queue.run(
    () =>
      view.evaluate(
        `!!window.${INJECTION_MARKER} && !!window.${NETWORK_MARKER}`,
      ) as Promise<boolean>,
  );

  if (already) return;

  await queue.run(() =>
    view.evaluate(`(function() {
      var script = document.createElement("script");
      script.textContent = atob(${JSON.stringify(TL_BASE64)});
      document.head.appendChild(script);
      if (!window.__BUN_E2E_NETWORK__) {
        var networkState = {
          nextId: 1,
          events: [],
          routes: [],
          push: function(event) {
            event.id = this.nextId++;
            this.events.push(event);
            if (this.events.length > 200) this.events.shift();
          },
          matchRoute: function(url, method) {
            method = String(method || "GET").toUpperCase();
            for (var index = 0; index < this.routes.length; index++) {
              var route = this.routes[index];
              if (route.method && route.method !== method) continue;

              var matched = false;
              if (route.pattern.kind === "string") {
                matched = String(url).includes(route.pattern.value);
              } else {
                matched = new RegExp(route.pattern.source, route.pattern.flags).test(String(url));
              }

              if (!matched) continue;

              if (typeof route.remaining === "number") {
                route.remaining -= 1;
                if (route.remaining <= 0) {
                  this.routes.splice(index, 1);
                  index -= 1;
                }
              }

              return route;
            }
            return null;
          }
        };
        window.__BUN_E2E_NETWORK__ = networkState;

        var originalFetch = window.fetch;
        window.fetch = async function(input, init) {
          var url = typeof input === "string" ? input : input && input.url ? input.url : String(input);
          var method = init && init.method ? init.method : (input && input.method) || "GET";
          networkState.push({ kind: "request", api: "fetch", url: url, method: method, timestamp: Date.now() });
          var route = networkState.matchRoute(url, method);
          if (route && route.abort) {
            networkState.push({ kind: "response", api: "fetch", url: url, method: method, status: 0, ok: false, mocked: true, error: "Request aborted by mock route", timestamp: Date.now() });
            throw new Error("Request aborted by mock route");
          }
          if (route && route.fulfill) {
            var mockedResponse = new Response(route.fulfill.body, {
              status: route.fulfill.status,
              headers: route.fulfill.headers,
            });
            networkState.push({ kind: "response", api: "fetch", url: url, method: method, status: mockedResponse.status, ok: mockedResponse.ok, mocked: true, timestamp: Date.now() });
            return mockedResponse;
          }
          try {
            var response = await originalFetch.call(this, input, init);
            networkState.push({ kind: "response", api: "fetch", url: response.url || url, method: method, status: response.status, ok: response.ok, timestamp: Date.now() });
            return response;
          } catch (error) {
            networkState.push({ kind: "response", api: "fetch", url: url, method: method, status: 0, ok: false, error: String(error), timestamp: Date.now() });
            throw error;
          }
        };

        var OriginalXHR = window.XMLHttpRequest;
        function PatchedXHR() {
          var xhr = new OriginalXHR();
          var method = "GET";
          var url = "";
          var originalOpen = xhr.open;
          xhr.open = function(nextMethod, nextUrl) {
            method = nextMethod;
            url = nextUrl;
            return originalOpen.apply(xhr, arguments);
          };
          xhr.addEventListener("loadend", function() {
            networkState.push({ kind: "response", api: "xhr", url: xhr.responseURL || url, method: method, status: xhr.status, ok: xhr.status >= 200 && xhr.status < 400, timestamp: Date.now() });
          });
          var originalSend = xhr.send;
          xhr.send = function() {
            networkState.push({ kind: "request", api: "xhr", url: url, method: method, timestamp: Date.now() });
            return originalSend.apply(xhr, arguments);
          };
          return xhr;
        }
        window.XMLHttpRequest = PatchedXHR;
      }
      window.${INJECTION_MARKER} = true;
      window.${NETWORK_MARKER} = true;
    })()`),
  );

  // Single verify — script tag content executes synchronously when appended
  const ready = await queue.run(
    () =>
      view.evaluate(
        `typeof window.__TL__ === "object" && typeof window.__BUN_E2E_NETWORK__ === "object"`,
      ) as Promise<boolean>,
  );

  if (!ready) {
    throw new Error(
      "@testing-library/dom failed to initialise after injection",
    );
  }
}
