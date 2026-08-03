import { ensureInjected } from "./inject";
import type { EvaluateQueue } from "./evaluate-queue";
import { renderDebug } from "./debug";

export type QueryOptions = {
  exact?: boolean;
  timeout?: number;
};

export type QueryMatcher = string | RegExp;

export type RoleOptions = QueryOptions & {
  name?: QueryMatcher;
  hidden?: boolean;
};

const REF_ATTR = "data-bun-tl-ref";

function rootExpr(rootSelector?: string): string {
  return rootSelector
    ? `document.querySelector(${JSON.stringify(rootSelector)})`
    : "document.body";
}

function tlCall(
  method: string,
  rootSelector: string | undefined,
  value: string | QueryMatcher,
  options: QueryOptions | RoleOptions,
): string {
  return `window.__TL__.${method}(${rootExpr(rootSelector)}, ${serializeForPage(value)}, ${serializeForPage(options)})`;
}

function formatMatcher(value: QueryMatcher): string {
  return value instanceof RegExp ? String(value) : `"${value}"`;
}

function serializeForPage(value: unknown): string {
  if (value instanceof RegExp) {
    return `new RegExp(${JSON.stringify(value.source)}, ${JSON.stringify(value.flags)})`;
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => serializeForPage(item)).join(", ")}]`;
  }

  if (value && typeof value === "object") {
    return `{ ${Object.entries(value)
      .map(
        ([key, nested]) =>
          `${JSON.stringify(key)}: ${serializeForPage(nested)}`,
      )
      .join(", ")} }`;
  }

  return JSON.stringify(value);
}

async function runQuery(
  view: Bun.WebView,
  queue: EvaluateQueue,
  queryExpr: string,
): Promise<string | null> {
  await ensureInjected(view, queue);

  return queue.run(
    () =>
      view.evaluate(`(function() {
      try {
        var el = ${queryExpr};
        if (!el) return null;
        var ref = "bun-" + Math.random().toString(36).slice(2, 9);
        el.setAttribute("data-bun-tl-ref", ref);
        return "[data-bun-tl-ref='" + ref + "']";
      } catch(e) {
        return null;
      }
    })()`) as Promise<string | null>,
  );
}
async function requireQuery(
  view: Bun.WebView,
  queue: EvaluateQueue,
  queryExpr: string,
  description: string,
  debugOptions: { rootSelector?: string; roles?: boolean } = {},
): Promise<string> {
  await ensureInjected(view, queue);

  const result = await queue.run(
    () =>
      view.evaluate(`(function() {
      try {
        var el = ${queryExpr};
        if (!el) return { ok: false, reason: "no element matched" };
        var ref = "bun-" + Math.random().toString(36).slice(2, 9);
        el.setAttribute("data-bun-tl-ref", ref);
        return { ok: true, selector: "[data-bun-tl-ref='" + ref + "']" };
      } catch(e) {
        return { ok: false, reason: e.message };
      }
    })()`) as Promise<
        { ok: true; selector: string } | { ok: false; reason: string }
      >,
  );

  if (!result.ok) {
    const debug = await renderDebug(
      <T>(script: string) =>
        queue.run(() => view.evaluate(script) as Promise<T>),
      debugOptions.rootSelector,
      { log: false, roles: debugOptions.roles },
    );
    throw new Error(
      `Could not find element: ${description} (${result.reason})\n\n${debug}`,
    );
  }
  return result.selector;
}

export async function getByRole(
  view: Bun.WebView,
  queue: EvaluateQueue,
  role: string,
  options: RoleOptions = {},
): Promise<string> {
  return getByRoleWithin(view, queue, undefined, role, options);
}

export async function getByRoleWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  role: string,
  options: RoleOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    tlCall("getByRole", rootSelector, role, options),
    `role="${role}"${options.name ? ` name=${formatMatcher(options.name)}` : ""}`,
    { rootSelector, roles: true },
  );
}

export async function queryByRole(
  view: Bun.WebView,
  queue: EvaluateQueue,
  role: string,
  options: RoleOptions = {},
): Promise<string | null> {
  return queryByRoleWithin(view, queue, undefined, role, options);
}

export async function queryByRoleWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  role: string,
  options: RoleOptions = {},
): Promise<string | null> {
  return runQuery(
    view,
    queue,
    tlCall("queryByRole", rootSelector, role, options),
  );
}

export async function getByText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string> {
  return getByTextWithin(view, queue, undefined, text, options);
}

export async function getByTextWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    tlCall("getByText", rootSelector, text, options),
    `text=${formatMatcher(text)}`,
    { rootSelector },
  );
}

export async function queryByText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string | null> {
  return queryByTextWithin(view, queue, undefined, text, options);
}

export async function queryByTextWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string | null> {
  return runQuery(
    view,
    queue,
    tlCall("queryByText", rootSelector, text, options),
  );
}

export async function getByLabelText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string> {
  return getByLabelTextWithin(view, queue, undefined, text, options);
}

export async function getByLabelTextWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    tlCall("getByLabelText", rootSelector, text, options),
    `label=${formatMatcher(text)}`,
    { rootSelector, roles: true },
  );
}

export async function queryByLabelText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string | null> {
  return queryByLabelTextWithin(view, queue, undefined, text, options);
}

export async function queryByLabelTextWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string | null> {
  return runQuery(
    view,
    queue,
    tlCall("queryByLabelText", rootSelector, text, options),
  );
}

export async function getByPlaceholderText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string> {
  return getByPlaceholderTextWithin(view, queue, undefined, text, options);
}

export async function getByPlaceholderTextWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    tlCall("getByPlaceholderText", rootSelector, text, options),
    `placeholder=${formatMatcher(text)}`,
    { rootSelector },
  );
}

export async function queryByPlaceholderText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string | null> {
  return queryByPlaceholderTextWithin(view, queue, undefined, text, options);
}

export async function queryByPlaceholderTextWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  text: QueryMatcher,
  options: QueryOptions = {},
): Promise<string | null> {
  return runQuery(
    view,
    queue,
    tlCall("queryByPlaceholderText", rootSelector, text, options),
  );
}

export async function getByTestId(
  view: Bun.WebView,
  queue: EvaluateQueue,
  testId: string,
  options: QueryOptions = {},
): Promise<string> {
  return getByTestIdWithin(view, queue, undefined, testId, options);
}

export async function getByTestIdWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  testId: string,
  options: QueryOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    tlCall("getByTestId", rootSelector, testId, options),
    `testId="${testId}"`,
    { rootSelector },
  );
}

export async function queryByTestId(
  view: Bun.WebView,
  queue: EvaluateQueue,
  testId: string,
  options: QueryOptions = {},
): Promise<string | null> {
  return queryByTestIdWithin(view, queue, undefined, testId, options);
}

export async function queryByTestIdWithin(
  view: Bun.WebView,
  queue: EvaluateQueue,
  rootSelector: string | undefined,
  testId: string,
  options: QueryOptions = {},
): Promise<string | null> {
  return runQuery(
    view,
    queue,
    tlCall("queryByTestId", rootSelector, testId, options),
  );
}

export async function getByAltText(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: string,
  options: QueryOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    `window.__TL__.getByAltText(document.body, ${JSON.stringify(text)}, ${JSON.stringify(options)})`,
    `alt="${text}"`,
    {},
  );
}

export async function getByTitle(
  view: Bun.WebView,
  queue: EvaluateQueue,
  text: string,
  options: QueryOptions = {},
): Promise<string> {
  return requireQuery(
    view,
    queue,
    `window.__TL__.getByTitle(document.body, ${JSON.stringify(text)}, ${JSON.stringify(options)})`,
    `title="${text}"`,
    {},
  );
}
