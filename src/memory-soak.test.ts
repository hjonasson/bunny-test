import { afterEach, expect, test } from "bun:test";
import { Page, countDomMetrics, memorySoak, readGlobalMetrics } from "./index";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(
    `<!DOCTYPE html><html><head></head><body>${body}</body></html>`,
  )}`;

const pages: Page[] = [];

afterEach(() => {
  for (const page of pages.splice(0)) page.close();
});

function open(url: string) {
  return Page.launch(url).then((page) => {
    pages.push(page);
    return page;
  });
}

test("memorySoak samples after warmup and always captures a final sample", async () => {
  const page = await open(
    html(`
    <button id="grow" onclick="window.count = (window.count ?? 0) + 1">Grow</button>
    <script>window.count = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 5,
    warmup: 2,
    sampleEvery: 2,
    includeDefaultSample: false as const,
    action: async (page) => {
      await page.click("#grow");
    },
    sample: (page) =>
      page.evaluate<{ count: number }>(`({ count: window.count })`),
  });

  expect(report.baseline.count).toBe(2);
  expect(report.final.count).toBe(7);
  expect(report.samples.map((entry) => entry.iteration)).toEqual([4, 6, 7]);
  expect(report.value("count")).toEqual([2, 4, 6, 7]);
});

test("memorySoak records a final sample even when no interval sample fired", async () => {
  const page = await open(
    html(`
    <button id="grow" onclick="window.count = (window.count ?? 0) + 1">Grow</button>
    <script>window.count = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 3,
    sampleEvery: 10,
    includeDefaultSample: false as const,
    action: async (page) => {
      await page.click("#grow");
    },
    sample: (page) =>
      page.evaluate<{ count: number }>(`({ count: window.count })`),
  });

  expect(report.samples.map((entry) => entry.iteration)).toEqual([3]);
  expect(report.final.count).toBe(3);
});

test("memorySoak merges default sample with custom metrics", async () => {
  const page = await open(
    html(`
    <button id="run" onclick="window.custom = (window.custom ?? 0) + 1">Run</button>
    <script>window.custom = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 1,
    includeDefaultSample: true as const,
    action: async (page) => {
      await page.click("#run");
    },
    sample: (page) =>
      page.evaluate<{ custom: number }>(`({ custom: window.custom })`),
  });

  expect(typeof report.baseline.domNodes).toBe("number");
  expect(report.final.custom).toBe(1);
});

test("memorySoak supports app-level leak metrics exposed on window", async () => {
  const page = await open(
    html(`
    <button id="open">Open</button>
    <button id="close">Close</button>
    <div id="dialog-root"></div>
    <script>
      window.__LEAK_METRICS__ = {
        listeners: 0,
        timers: 0,
      };

      const root = document.querySelector("#dialog-root");
      const open = document.querySelector("#open");
      const close = document.querySelector("#close");

      function renderDialog() {
        root.innerHTML = '<div role="dialog"><input aria-label="Search" /></div>';
        window.__LEAK_METRICS__.listeners += 1;
        window.__LEAK_METRICS__.timers += 1;
      }

      function destroyDialog() {
        root.innerHTML = "";
        window.__LEAK_METRICS__.listeners = 0;
        window.__LEAK_METRICS__.timers = 0;
      }

      open.addEventListener("click", renderDialog);
      close.addEventListener("click", destroyDialog);
      window.__appIdle = true;
    </script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 4,
    sampleEvery: 2,
    action: async (page, iteration) => {
      await page.click("#open");
      await page.fill("input[aria-label='Search']", `query-${iteration}`);
      await page.click("#close");
    },
    settle: async (page) => {
      await page.waitFor("window.__appIdle === true", { timeout: 1000 });
    },
    sample: readGlobalMetrics({
      leak: "window.__LEAK_METRICS__",
    }),
  });

  report.expectStable("leak.listeners", { maxGrowth: 0 });
  report.expectStable("leak.timers", { maxGrowth: 0 });
});

test("report.expectStable throws when growth exceeds the budget", async () => {
  const page = await open(
    html(`
    <button id="leak" onclick="window.leaks = (window.leaks ?? 0) + 1">Leak</button>
    <script>window.leaks = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 3,
    includeDefaultSample: false as const,
    action: async (page) => {
      await page.click("#leak");
    },
    sample: (page) =>
      page.evaluate<{ leaks: number }>(`({ leaks: window.leaks })`),
  });

  expect(() => {
    report.expectStable("leaks", { maxGrowth: 0 });
  }).toThrow(/Memory soak expectation failed for "leaks"/);
});

test("expectStable allows missing metrics when configured", async () => {
  const page = await open(html(`<button id="noop">noop</button>`));

  const report = await memorySoak(page, {
    iterations: 1,
    includeDefaultSample: false as const,
    action: async () => {},
  });

  report.expectStable("missing.metric", { allowMissing: true });
});

test("memorySoak summary aligns columns", async () => {
  const page = await open(
    html(`
    <button id="grow" onclick="window.count = (window.count ?? 0) + 1">Grow</button>
    <script>window.count = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 2,
    warmup: 1,
    includeDefaultSample: false as const,
    action: async (page) => {
      await page.click("#grow");
    },
    sample: (page) =>
      page.evaluate<{ count: number; veryLongMetricName: number }>(`({
        count: window.count,
        veryLongMetricName: 10,
      })`),
  });

  expect(report.summary()).toBe(
    [
      "Path               | Baseline | Final | Max | Growth | % Growth",
      "count              |        1 |     3 |   3 |      2 |  200.00%",
      "veryLongMetricName |       10 |    10 |  10 |      0 |    0.00%",
    ].join("\n"),
  );
});

test("countDomMetrics builds a sample callback for selector and text counts", async () => {
  const page = await open(
    html(`
    <iframe></iframe>
    <button>Add to Cart</button>
    <button>Add to Cart</button>
    <button>Remove from Cart</button>
  `),
  );

  const sample = countDomMetrics({
    frames: "iframe",
    addButtons: { selector: "button", text: "Add to Cart" },
    removeButtons: { selector: "button", text: "Remove from Cart" },
  });

  await expect(sample(page)).resolves.toEqual({
    frames: 1,
    addButtons: 2,
    removeButtons: 1,
  });
});

test("readGlobalMetrics reads app-level globals from window paths", async () => {
  const page = await open(
    html(`
    <script>
      window.__LEAK_METRICS__ = { listeners: 2, timers: 1 };
      window.__APP_DEBUG__ = { cart: { count: 3 } };
    </script>
  `),
  );

  const sample = readGlobalMetrics({
    leak: "window.__LEAK_METRICS__",
    cart: "__APP_DEBUG__.cart",
  });

  await expect(sample(page)).resolves.toEqual({
    leak: { listeners: 2, timers: 1 },
    cart: { count: 3 },
  });
});

test("memorySoak printSummary logs text by default", async () => {
  const page = await open(
    html(`
    <button id="grow" onclick="window.count = (window.count ?? 0) + 1">Grow</button>
    <script>window.count = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 1,
    includeDefaultSample: false as const,
    action: async (page) => {
      await page.click("#grow");
    },
    sample: (page) =>
      page.evaluate<{ count: number }>(`({ count: window.count })`),
  });

  const logCalls: string[] = [];
  const originalLog = console.log;

  console.log = (value?: unknown, ...rest: unknown[]) => {
    logCalls.push([value, ...rest].map(String).join(" "));
  };

  try {
    report.printSummary();
  } finally {
    console.log = originalLog;
  }

  expect(logCalls).toEqual([report.summary()]);
});

test("memorySoak printSummary can use console.table", async () => {
  const page = await open(
    html(`
    <button id="grow" onclick="window.count = (window.count ?? 0) + 1">Grow</button>
    <script>window.count = 0;</script>
  `),
  );

  const report = await memorySoak(page, {
    iterations: 1,
    includeDefaultSample: false as const,
    action: async (page) => {
      await page.click("#grow");
    },
    sample: (page) =>
      page.evaluate<{ count: number }>(`({ count: window.count })`),
  });

  const tableCalls: unknown[] = [];
  const originalTable = console.table;

  console.table = (tabularData?: unknown, properties?: readonly string[]) => {
    tableCalls.push([tabularData, properties]);
  };

  try {
    report.printSummary({ format: "table" });
  } finally {
    console.table = originalTable;
  }

  expect(tableCalls).toEqual([[report.summarize(), undefined]]);
});

test("countDomMetrics rejects conflicting text matchers", () => {
  expect(() =>
    countDomMetrics({
      buttons: {
        selector: "button",
        text: "Add to Cart",
        containsText: "Cart",
      },
    }),
  ).toThrow(/both text and containsText/);
});

test("readGlobalMetrics rejects empty paths", () => {
  expect(() =>
    readGlobalMetrics({
      leak: "   ",
    }),
  ).toThrow(/empty path/);
});

test("memorySoak appends a summary when assert fails", async () => {
  const page = await open(
    html(`
    <button id="leak" onclick="window.leaks = (window.leaks ?? 0) + 1">Leak</button>
    <script>window.leaks = 0;</script>
  `),
  );

  await expect(
    memorySoak(page, {
      iterations: 2,
      includeDefaultSample: false as const,
      action: async (page) => {
        await page.click("#leak");
      },
      sample: (page) =>
        page.evaluate<{ leaks: number }>(`({ leaks: window.leaks })`),
      assert(report) {
        report.expectStable("leaks", { maxGrowth: 0 });
      },
    }),
  ).rejects.toThrow(/Memory soak summary:/);
});

test("memorySoak rejects invalid iterations", async () => {
  const page = await open(html(`<div></div>`));

  await expect(
    memorySoak(page, {
      iterations: 0,
      action: async () => {},
    }),
  ).rejects.toThrow(/iterations >= 1/);
});

test("memorySoak rejects invalid sampleEvery", async () => {
  const page = await open(html(`<div></div>`));

  await expect(
    memorySoak(page, {
      iterations: 1,
      sampleEvery: 0,
      action: async () => {},
    }),
  ).rejects.toThrow(/sampleEvery >= 1/);
});
