import type { NetworkMatcher, NetworkRequest } from "./page";
import type { WaitOptions } from "./wait";

interface NavigationPageAdapter {
  readonly url: string;
  waitForURL(pattern: string | RegExp, options?: WaitOptions): Promise<void>;
  waitFor(script: string, options?: WaitOptions): Promise<void>;
  waitForVisible(selector: string, options?: WaitOptions): Promise<void>;
  waitForRequest(
    matcher: NetworkMatcher<NetworkRequest>,
    options?: WaitOptions,
  ): Promise<NetworkRequest>;
}

export type NavigationSignal =
  | { type: "urlChanged" }
  | { type: "urlMatches"; value: string | RegExp }
  | { type: "requestStarted"; value: NetworkMatcher<NetworkRequest> }
  | { type: "ariaBusy"; selector?: string }
  | { type: "elementVisible"; selector: string };

export interface NavigationPhaseOptions {
  signal: NavigationSignal | readonly NavigationSignal[];
  match?: "all" | "any";
  timeout?: number;
  maxMs?: number;
}

export interface MeasureNavigationOptions {
  action: () => void | Promise<void>;
  ack?: NavigationSignal | readonly NavigationSignal[] | NavigationPhaseOptions;
  commit:
    | NavigationSignal
    | readonly NavigationSignal[]
    | NavigationPhaseOptions;
  timeout?: number;
}

export interface ExpectNavigationPerformanceOptions extends MeasureNavigationOptions {}

export interface NavigationSignalResult {
  signal: NavigationSignal;
  description: string;
  elapsedMs: number;
}

export interface NavigationPhaseResult {
  phase: "ack" | "commit";
  match: "all" | "any";
  elapsedMs: number;
  timeoutMs: number;
  maxMs?: number;
  matchedSignals: NavigationSignalResult[];
}

export interface NavigationMeasurement {
  readonly startedAt: number;
  readonly ack: NavigationPhaseResult | null;
  readonly commit: NavigationPhaseResult;
  summary(): string;
}

interface NormalizedNavigationPhase {
  phase: "ack" | "commit";
  match: "all" | "any";
  timeoutMs: number;
  maxMs?: number;
  signals: readonly NavigationSignal[];
}

export async function measureNavigation(
  page: NavigationPageAdapter,
  options: MeasureNavigationOptions,
): Promise<NavigationMeasurement> {
  const ack = options.ack
    ? normalizePhase("ack", options.ack, options.timeout)
    : null;
  const commit = normalizePhase("commit", options.commit, options.timeout);
  const initialURL = page.url;
  const startedAt = Date.now();

  const ackPromise = ack
    ? waitForPhase(page, ack, initialURL, startedAt)
    : Promise.resolve(null);
  const commitPromise = waitForPhase(page, commit, initialURL, startedAt);

  try {
    await options.action();
  } catch (err) {
    throw enrichActionError(err);
  }

  const [ackSettled, commitSettled] = await Promise.allSettled([
    ackPromise,
    commitPromise,
  ]);

  if (ackSettled.status === "rejected") {
    throw ackSettled.reason;
  }

  if (commitSettled.status === "rejected") {
    throw commitSettled.reason;
  }

  const ackResult = ackSettled.value;
  const commitResult = commitSettled.value;

  return new NavigationMeasurementImpl(startedAt, ackResult, commitResult);
}

export async function expectNavigationPerformance(
  page: NavigationPageAdapter,
  options: ExpectNavigationPerformanceOptions,
): Promise<NavigationMeasurement> {
  const measurement = await measureNavigation(page, options);
  const failures: string[] = [];

  if (
    measurement.ack &&
    measurement.ack.maxMs !== undefined &&
    measurement.ack.elapsedMs > measurement.ack.maxMs
  ) {
    failures.push(
      `Navigation ack exceeded budget: ${measurement.ack.elapsedMs}ms > ${measurement.ack.maxMs}ms`,
    );
  }

  if (
    measurement.commit.maxMs !== undefined &&
    measurement.commit.elapsedMs > measurement.commit.maxMs
  ) {
    failures.push(
      `Navigation commit exceeded budget: ${measurement.commit.elapsedMs}ms > ${measurement.commit.maxMs}ms`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`${failures.join("\n")}\n${measurement.summary()}`);
  }

  return measurement;
}

class NavigationMeasurementImpl implements NavigationMeasurement {
  constructor(
    readonly startedAt: number,
    readonly ack: NavigationPhaseResult | null,
    readonly commit: NavigationPhaseResult,
  ) {}

  summary(): string {
    const lines = ["Navigation performance"];

    if (this.ack) {
      lines.push(formatPhaseSummary(this.ack));
    }

    lines.push(formatPhaseSummary(this.commit));
    return lines.join("\n");
  }
}

function normalizePhase(
  phase: "ack" | "commit",
  input:
    | NavigationSignal
    | readonly NavigationSignal[]
    | NavigationPhaseOptions,
  defaultTimeout?: number,
): NormalizedNavigationPhase {
  const phaseOptions = isPhaseOptions(input) ? input : { signal: input };
  const signals = Array.isArray(phaseOptions.signal)
    ? phaseOptions.signal
    : [phaseOptions.signal];

  if (signals.length === 0) {
    throw new Error(`Navigation ${phase} must define at least one signal`);
  }

  return {
    phase,
    match: phaseOptions.match ?? "all",
    timeoutMs: phaseOptions.timeout ?? defaultTimeout ?? 1_000,
    maxMs: phaseOptions.maxMs,
    signals,
  };
}

function isPhaseOptions(
  input:
    | NavigationSignal
    | readonly NavigationSignal[]
    | NavigationPhaseOptions,
): input is NavigationPhaseOptions {
  return typeof input === "object" && input !== null && "signal" in input;
}

async function waitForPhase(
  page: NavigationPageAdapter,
  phase: NormalizedNavigationPhase,
  initialURL: string,
  startedAt: number,
): Promise<NavigationPhaseResult> {
  const waits = phase.signals.map((signal) =>
    waitForSignal(page, signal, initialURL, startedAt, phase.timeoutMs),
  );

  try {
    const matchedSignals =
      phase.match === "any"
        ? [await Promise.any(waits)]
        : await Promise.all(waits);

    return {
      phase: phase.phase,
      match: phase.match,
      elapsedMs: Math.max(...matchedSignals.map((entry) => entry.elapsedMs)),
      timeoutMs: phase.timeoutMs,
      maxMs: phase.maxMs,
      matchedSignals,
    };
  } catch {
    throw new Error(
      [
        `Timed out after ${phase.timeoutMs}ms waiting for navigation ${phase.phase}`,
        `${phase.match === "any" ? "Any of" : "All of"}: ${phase.signals.map(describeSignal).join(", ")}`,
        `Current URL: ${page.url}`,
      ].join("\n"),
    );
  }
}

async function waitForSignal(
  page: NavigationPageAdapter,
  signal: NavigationSignal,
  initialURL: string,
  startedAt: number,
  timeoutMs: number,
): Promise<NavigationSignalResult> {
  const options = { timeout: timeoutMs };

  switch (signal.type) {
    case "urlChanged":
      await page.waitFor(
        `location.href !== ${JSON.stringify(initialURL)}`,
        options,
      );
      break;
    case "urlMatches":
      await page.waitFor(urlMatchScript(signal.value), options);
      break;
    case "requestStarted":
      await page.waitForRequest(signal.value, options);
      break;
    case "ariaBusy":
      await page.waitFor(ariaBusyScript(signal.selector), options);
      break;
    case "elementVisible":
      await page.waitForVisible(signal.selector, options);
      break;
    default:
      assertNever(signal);
  }

  return {
    signal,
    description: describeSignal(signal),
    elapsedMs: Date.now() - startedAt,
  };
}

function ariaBusyScript(selector?: string): string {
  if (!selector) {
    return `!!document.querySelector('[aria-busy="true"]')`;
  }

  return `(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return false;
    return root.getAttribute('aria-busy') === 'true' || !!root.querySelector('[aria-busy="true"]');
  })()`;
}

function urlMatchScript(pattern: string | RegExp): string {
  if (pattern instanceof RegExp) {
    return `${pattern}.test(location.href)`;
  }

  return `location.href.includes(${JSON.stringify(pattern)})`;
}

function describeSignal(signal: NavigationSignal): string {
  switch (signal.type) {
    case "urlChanged":
      return "urlChanged";
    case "urlMatches":
      return `urlMatches(${formatMatcher(signal.value)})`;
    case "requestStarted":
      return `requestStarted(${formatMatcher(signal.value)})`;
    case "ariaBusy":
      return signal.selector
        ? `ariaBusy(${JSON.stringify(signal.selector)})`
        : "ariaBusy";
    case "elementVisible":
      return `elementVisible(${JSON.stringify(signal.selector)})`;
    default:
      return assertNever(signal);
  }
}

function formatMatcher(
  value: string | RegExp | NetworkMatcher<NetworkRequest>,
): string {
  if (value instanceof RegExp) {
    return String(value);
  }

  if (typeof value === "function") {
    return "fn";
  }

  return JSON.stringify(value);
}

function formatPhaseSummary(phase: NavigationPhaseResult): string {
  return [
    `${phase.phase}: ${phase.elapsedMs}ms`,
    `${phase.match === "any" ? "any of" : "all of"} ${phase.matchedSignals.map((signal) => signal.description).join(", ")}`,
    phase.maxMs === undefined ? null : `(budget ${phase.maxMs}ms)`,
  ]
    .filter(Boolean)
    .join(" ");
}

function enrichActionError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  return new Error(`[measureNavigation.action] ${message}`);
}

function assertNever(value: never): never {
  throw new Error(`Unsupported navigation signal: ${JSON.stringify(value)}`);
}
