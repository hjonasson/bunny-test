import type { DebugOptions } from "./debug";
import type { Page } from "./page";

export type MemoryMetricPrimitive =
  | number
  | string
  | boolean
  | null
  | undefined;

export type MemoryMetricValue =
  | MemoryMetricPrimitive
  | MemoryMetricObject
  | MemoryMetricValue[];

export interface MemoryMetricObject {
  [key: string]: MemoryMetricValue;
}

export interface DomMetricMatcherOptions {
  selector?: string;
  text?: string;
  containsText?: string;
}

export type DomMetricMatcher = string | DomMetricMatcherOptions;

export type DomMetricMatchers = Record<string, DomMetricMatcher>;

export type DomMetricCounts<TMatchers extends DomMetricMatchers> = {
  [K in keyof TMatchers]: number;
};

export type GlobalMetricPaths = Record<string, string>;

export type GlobalMetricSnapshot<TPaths extends GlobalMetricPaths> = {
  [K in keyof TPaths]: MemoryMetricValue;
};

export interface DefaultMemorySample extends MemoryMetricObject {
  domNodes: number;
  heapUsed: number | null;
  heapTotal: number | null;
}

export interface MemorySoakSample<TMetrics extends MemoryMetricObject> {
  iteration: number;
  elapsedMs: number;
  metrics: TMetrics;
}

export interface MemorySoakExpectationOptions {
  maxGrowth?: number;
  maxPercentGrowth?: number;
  allowMissing?: boolean;
}

export interface MemorySoakPrintSummaryOptions {
  format?: "text" | "table";
  paths?: string[];
}

export interface MemorySoakSummaryRow {
  path: string;
  baseline: number | null;
  final: number | null;
  max: number | null;
  min: number | null;
  growth: number | null;
  percentGrowth: number | null;
}

export interface MemorySoakReport<TMetrics extends MemoryMetricObject> {
  iterations: number;
  warmup: number;
  sampleEvery: number;
  startedAt: number;
  finishedAt: number;
  baseline: TMetrics;
  final: TMetrics;
  samples: Array<MemorySoakSample<TMetrics>>;

  /**
   * Returns the numeric time series for a metric path, including the baseline
   * as the first entry followed by each recorded sample.
   */
  value(path: string): Array<number | null>;
  summarize(paths?: string[]): MemorySoakSummaryRow[];
  summary(paths?: string[]): string;
  printSummary(options?: MemorySoakPrintSummaryOptions): void;
  expectStable(path: string, options?: MemorySoakExpectationOptions): void;
}

type CombinedMetrics<
  TMetrics extends MemoryMetricObject,
  TIncludeDefault extends boolean,
> = TIncludeDefault extends false ? TMetrics : TMetrics & DefaultMemorySample;

export interface MemorySoakOptions<
  TMetrics extends MemoryMetricObject,
  TIncludeDefault extends boolean = true,
> {
  iterations: number;
  warmup?: number;
  sampleEvery?: number;
  includeDefaultSample?: TIncludeDefault;

  action: (page: Page, iteration: number) => Promise<void>;
  sample?: (page: Page, iteration: number) => Promise<TMetrics>;
  settle?: (page: Page, iteration: number) => Promise<void>;

  beforeAll?: (page: Page) => Promise<void>;
  beforeIteration?: (page: Page, iteration: number) => Promise<void>;
  afterIteration?: (page: Page, iteration: number) => Promise<void>;

  /**
   * Runs only after a report has been produced, whether assertions pass or fail.
   * This is not a universal finally hook.
   */
  afterAll?: (
    page: Page,
    report: MemorySoakReport<CombinedMetrics<TMetrics, TIncludeDefault>>,
  ) => Promise<void>;

  assert?: (
    report: MemorySoakReport<CombinedMetrics<TMetrics, TIncludeDefault>>,
  ) => void | Promise<void>;

  debugOnFailure?: boolean | DebugOptions;
}

export async function defaultMemorySample(
  page: Page,
): Promise<DefaultMemorySample> {
  return page.evaluate(`(() => ({
    domNodes: document.querySelectorAll("*").length,
    heapUsed: globalThis.performance?.memory?.usedJSHeapSize ?? null,
    heapTotal: globalThis.performance?.memory?.totalJSHeapSize ?? null,
  }))()`);
}

export function countDomMetrics<TMatchers extends DomMetricMatchers>(
  matchers: TMatchers,
): (page: Page) => Promise<DomMetricCounts<TMatchers>> {
  for (const [name, matcher] of Object.entries(matchers)) {
    if (
      typeof matcher === "object" &&
      matcher !== null &&
      matcher.text !== undefined &&
      matcher.containsText !== undefined
    ) {
      throw new Error(
        `countDomMetrics() received both text and containsText for "${name}"`,
      );
    }
  }

  const serializedMatchers = JSON.stringify(matchers);

  return (page) =>
    page.evaluate(`(() => {
      const matchers = ${serializedMatchers};
      const counts = {};

      for (const [name, rawMatcher] of Object.entries(matchers)) {
        const matcher = typeof rawMatcher === "string"
          ? { selector: rawMatcher }
          : (rawMatcher ?? {});
        const selector = matcher.selector ?? "*";
        const nodes = Array.from(document.querySelectorAll(selector));

        counts[name] = nodes.filter((node) => {
          const text = node.textContent?.trim() ?? "";

          if (matcher.text !== undefined) {
            return text === matcher.text;
          }

          if (matcher.containsText !== undefined) {
            return text.includes(matcher.containsText);
          }

          return true;
        }).length;
      }

      return counts;
    })()`) as Promise<DomMetricCounts<TMatchers>>;
}

export function readGlobalMetrics<TPaths extends GlobalMetricPaths>(
  paths: TPaths,
): (page: Page) => Promise<GlobalMetricSnapshot<TPaths>> {
  for (const [name, path] of Object.entries(paths)) {
    if (!path.trim()) {
      throw new Error(
        `readGlobalMetrics() received an empty path for "${name}"`,
      );
    }
  }

  const serializedPaths = JSON.stringify(paths);

  return (page) =>
    page.evaluate(`(() => {
      const paths = ${serializedPaths};
      const snapshot = {};

      function getByPath(input, path) {
        const normalized = path
          .replace(/^window\./, "")
          .replace(/^globalThis\./, "");

        if (!normalized) return input;

        return normalized.split(".").reduce((current, part) => {
          if (current == null) return undefined;
          return current[part];
        }, globalThis);
      }

      for (const [name, path] of Object.entries(paths)) {
        snapshot[name] = getByPath(globalThis, path);
      }

      return snapshot;
    })()`) as Promise<GlobalMetricSnapshot<TPaths>>;
}

export function memorySoak<TMetrics extends MemoryMetricObject>(
  page: Page,
  options: MemorySoakOptions<TMetrics, false>,
): Promise<MemorySoakReport<TMetrics>>;

export function memorySoak<TMetrics extends MemoryMetricObject>(
  page: Page,
  options: MemorySoakOptions<TMetrics, true>,
): Promise<MemorySoakReport<TMetrics & DefaultMemorySample>>;

export async function memorySoak<
  TMetrics extends MemoryMetricObject,
  TIncludeDefault extends boolean = true,
>(
  page: Page,
  options: MemorySoakOptions<TMetrics, TIncludeDefault>,
): Promise<MemorySoakReport<CombinedMetrics<TMetrics, TIncludeDefault>>> {
  const iterations = options.iterations;
  const warmup = options.warmup ?? 0;
  const sampleEvery = options.sampleEvery ?? 1;
  const totalIterations = warmup + iterations;
  const startedAt = Date.now();

  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new Error(
      `memorySoak() requires iterations >= 1, received ${iterations}`,
    );
  }

  if (!Number.isInteger(warmup) || warmup < 0) {
    throw new Error(`memorySoak() requires warmup >= 0, received ${warmup}`);
  }

  if (!Number.isInteger(sampleEvery) || sampleEvery < 1) {
    throw new Error(
      `memorySoak() requires sampleEvery >= 1, received ${sampleEvery}`,
    );
  }

  let report: MemorySoakReport<
    CombinedMetrics<TMetrics, TIncludeDefault>
  > | null = null;

  try {
    await options.beforeAll?.(page);

    for (let iteration = 1; iteration <= warmup; iteration++) {
      await options.beforeIteration?.(page, iteration);
      await options.action(page, iteration);
      await options.afterIteration?.(page, iteration);
    }

    await options.settle?.(page, warmup);

    const baseline = await captureMetrics(page, warmup, options);
    const samples: Array<
      MemorySoakSample<CombinedMetrics<TMetrics, TIncludeDefault>>
    > = [];

    for (
      let iteration = warmup + 1;
      iteration <= totalIterations;
      iteration++
    ) {
      await options.beforeIteration?.(page, iteration);
      await options.action(page, iteration);
      await options.afterIteration?.(page, iteration);

      const measuredIteration = iteration - warmup;
      if (measuredIteration % sampleEvery !== 0) {
        continue;
      }

      await options.settle?.(page, iteration);
      samples.push({
        iteration,
        elapsedMs: Date.now() - startedAt,
        metrics: await captureMetrics(page, iteration, options),
      });
    }

    let final: CombinedMetrics<TMetrics, TIncludeDefault>;

    if (samples.at(-1)?.iteration === totalIterations) {
      final = samples.at(-1)!.metrics;
    } else {
      await options.settle?.(page, totalIterations);
      final = await captureMetrics(page, totalIterations, options);
      samples.push({
        iteration: totalIterations,
        elapsedMs: Date.now() - startedAt,
        metrics: final,
      });
    }

    report = new MemorySoakReportImpl<
      CombinedMetrics<TMetrics, TIncludeDefault>
    >({
      iterations,
      warmup,
      sampleEvery,
      startedAt,
      finishedAt: Date.now(),
      baseline,
      final,
      samples,
    });

    try {
      await options.assert?.(report);
    } catch (error) {
      throw await enrichFailure(error, page, report, options.debugOnFailure);
    }

    return report;
  } finally {
    if (report) {
      await options.afterAll?.(page, report);
    }
  }
}

class MemorySoakReportImpl<
  TMetrics extends MemoryMetricObject,
> implements MemorySoakReport<TMetrics> {
  readonly iterations: number;
  readonly warmup: number;
  readonly sampleEvery: number;
  readonly startedAt: number;
  readonly finishedAt: number;
  readonly baseline: TMetrics;
  readonly final: TMetrics;
  readonly samples: Array<MemorySoakSample<TMetrics>>;

  constructor(input: {
    iterations: number;
    warmup: number;
    sampleEvery: number;
    startedAt: number;
    finishedAt: number;
    baseline: TMetrics;
    final: TMetrics;
    samples: Array<MemorySoakSample<TMetrics>>;
  }) {
    this.iterations = input.iterations;
    this.warmup = input.warmup;
    this.sampleEvery = input.sampleEvery;
    this.startedAt = input.startedAt;
    this.finishedAt = input.finishedAt;
    this.baseline = input.baseline;
    this.final = input.final;
    this.samples = input.samples;
  }

  value(path: string): Array<number | null> {
    return this.#sequence().map((entry) =>
      toNumberOrNull(getPathValue(entry.metrics, path)),
    );
  }

  summarize(paths?: string[]): MemorySoakSummaryRow[] {
    const resolvedPaths = paths?.length
      ? paths
      : uniquePaths(
          this.#sequence().flatMap((entry) =>
            flattenNumericPaths(entry.metrics),
          ),
        );

    return resolvedPaths.map((path) => {
      const values = this.value(path).filter(
        (value): value is number => value !== null,
      );
      const baseline = toNumberOrNull(getPathValue(this.baseline, path));
      const final = toNumberOrNull(getPathValue(this.final, path));
      const max = values.length ? Math.max(...values) : null;
      const min = values.length ? Math.min(...values) : null;
      const growth = baseline !== null && max !== null ? max - baseline : null;
      const percentGrowth =
        baseline !== null && max !== null
          ? percentGrowthFrom(baseline, max)
          : null;

      return {
        path,
        baseline,
        final,
        max,
        min,
        growth,
        percentGrowth,
      };
    });
  }

  summary(paths?: string[]): string {
    const rows = this.summarize(paths);

    if (rows.length === 0) {
      return "(no numeric metrics recorded)";
    }

    const columns = [
      {
        header: "Path",
        align: "start" as const,
        values: rows.map((row) => row.path),
      },
      {
        header: "Baseline",
        align: "end" as const,
        values: rows.map((row) => formatNumber(row.baseline)),
      },
      {
        header: "Final",
        align: "end" as const,
        values: rows.map((row) => formatNumber(row.final)),
      },
      {
        header: "Max",
        align: "end" as const,
        values: rows.map((row) => formatNumber(row.max)),
      },
      {
        header: "Growth",
        align: "end" as const,
        values: rows.map((row) => formatNumber(row.growth)),
      },
      {
        header: "% Growth",
        align: "end" as const,
        values: rows.map((row) => formatPercent(row.percentGrowth)),
      },
    ];

    const widths = columns.map((column) =>
      Math.max(
        column.header.length,
        ...column.values.map((value) => value.length),
      ),
    );

    const header = columns
      .map((column, index) =>
        padCell(column.header, widths[index]!, column.align),
      )
      .join(" | ");
    const body = rows.map((row) =>
      [
        row.path,
        formatNumber(row.baseline),
        formatNumber(row.final),
        formatNumber(row.max),
        formatNumber(row.growth),
        formatPercent(row.percentGrowth),
      ]
        .map((value, index) =>
          padCell(value, widths[index]!, columns[index]!.align),
        )
        .join(" | "),
    );

    return [header, ...body].join("\n");
  }

  printSummary(options: MemorySoakPrintSummaryOptions = {}): void {
    const format = options.format ?? "text";

    if (format === "table") {
      console.table(this.summarize(options.paths));
      return;
    }

    console.log(this.summary(options.paths));
  }

  expectStable(path: string, options: MemorySoakExpectationOptions = {}): void {
    const baseline = toNumberOrNull(getPathValue(this.baseline, path));
    const final = toNumberOrNull(getPathValue(this.final, path));
    const values = this.value(path).filter(
      (value): value is number => value !== null,
    );
    const max = values.length ? Math.max(...values) : null;
    const growth = baseline !== null && max !== null ? max - baseline : null;
    const percentGrowth =
      baseline !== null && max !== null
        ? percentGrowthFrom(baseline, max)
        : null;

    if (
      baseline === null ||
      final === null ||
      max === null ||
      growth === null ||
      percentGrowth === null
    ) {
      if (options.allowMissing) {
        return;
      }

      throw new Error(
        [
          `Memory soak expectation failed for "${path}"`,
          "",
          "Metric was missing or non-numeric.",
          "",
          "Memory soak summary:",
          this.summary([path]),
        ].join("\n"),
      );
    }

    if (options.maxGrowth !== undefined && growth > options.maxGrowth) {
      throw new Error(
        this.#expectStableMessage(path, {
          baseline,
          final,
          max,
          growth,
          limitLabel: "Allowed growth",
          limitValue: String(options.maxGrowth),
        }),
      );
    }

    if (
      options.maxPercentGrowth !== undefined &&
      percentGrowth > options.maxPercentGrowth
    ) {
      throw new Error(
        this.#expectStableMessage(path, {
          baseline,
          final,
          max,
          growth,
          limitLabel: "Allowed percent growth",
          limitValue: `${options.maxPercentGrowth.toFixed(2)}%`,
        }),
      );
    }
  }

  #expectStableMessage(
    path: string,
    detail: {
      baseline: number;
      final: number;
      max: number;
      growth: number;
      limitLabel: string;
      limitValue: string;
    },
  ): string {
    const trend = this.#sequence()
      .map((entry, index) => {
        const label =
          index === 0
            ? `baseline (${entry.iteration})`
            : `iteration ${entry.iteration}`;
        const value = toNumberOrNull(getPathValue(entry.metrics, path));
        return `${label} => ${formatNumber(value)}`;
      })
      .join("\n");

    return [
      `Memory soak expectation failed for "${path}"`,
      "",
      `Baseline: ${formatNumber(detail.baseline)}`,
      `Final: ${formatNumber(detail.final)}`,
      `Max: ${formatNumber(detail.max)}`,
      `Growth: ${formatNumber(detail.growth)}`,
      `${detail.limitLabel}: ${detail.limitValue}`,
      "",
      "Trend:",
      trend,
    ].join("\n");
  }

  #sequence(): Array<MemorySoakSample<TMetrics>> {
    return [
      {
        iteration: this.warmup,
        elapsedMs: 0,
        metrics: this.baseline,
      },
      ...this.samples,
    ];
  }
}

async function captureMetrics<
  TMetrics extends MemoryMetricObject,
  TIncludeDefault extends boolean,
>(
  page: Page,
  iteration: number,
  options: MemorySoakOptions<TMetrics, TIncludeDefault>,
): Promise<CombinedMetrics<TMetrics, TIncludeDefault>> {
  const includeDefaultSample = options.includeDefaultSample !== false;
  const base = includeDefaultSample ? await defaultMemorySample(page) : {};
  const custom = options.sample ? await options.sample(page, iteration) : {};

  // Custom metrics override default keys when names overlap.
  return {
    ...base,
    ...custom,
  } as CombinedMetrics<TMetrics, TIncludeDefault>;
}

async function enrichFailure(
  error: unknown,
  page: Page,
  report: MemorySoakReport<MemoryMetricObject>,
  debugOnFailure: boolean | DebugOptions | undefined,
): Promise<Error> {
  const parts = [
    error instanceof Error ? error.message : String(error),
    "",
    "Memory soak summary:",
    report.summary(),
  ];

  if (debugOnFailure) {
    try {
      const debug = await page.debug({
        ...(typeof debugOnFailure === "object" ? debugOnFailure : {}),
        log: false,
      });
      parts.push("", "Page debug:", debug);
    } catch {
      // Preserve the soak failure if debug rendering fails.
    }
  }

  return new Error(parts.join("\n"), {
    cause: error instanceof Error ? error : undefined,
  });
}

function getPathValue(input: unknown, path: string): unknown {
  if (!path) return input;

  const parts = path.split(".");
  let current: unknown = input;

  for (const part of parts) {
    if (Array.isArray(current)) {
      const index = Number(part);
      if (!Number.isInteger(index)) {
        return undefined;
      }
      current = current[index];
      continue;
    }

    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function flattenNumericPaths(input: unknown, prefix = ""): string[] {
  if (typeof input === "number" && Number.isFinite(input)) {
    return prefix ? [prefix] : [];
  }

  if (Array.isArray(input)) {
    return input.flatMap((value, index) =>
      flattenNumericPaths(value, prefix ? `${prefix}.${index}` : String(index)),
    );
  }

  if (input && typeof input === "object") {
    return Object.entries(input).flatMap(([key, value]) =>
      flattenNumericPaths(value, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [];
}

function uniquePaths(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function percentGrowthFrom(baseline: number, max: number): number | null {
  if (baseline === 0) {
    return max === 0 ? 0 : null;
  }

  return ((max - baseline) / Math.abs(baseline)) * 100;
}

function formatNumber(value: number | null): string {
  if (value === null) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatPercent(value: number | null): string {
  if (value === null) return "-";
  return `${value.toFixed(2)}%`;
}

function padCell(value: string, width: number, align: "start" | "end"): string {
  return align === "end" ? value.padStart(width) : value.padEnd(width);
}
