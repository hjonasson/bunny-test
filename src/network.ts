export type RoutePattern = string | RegExp;

export interface RouteFulfillOptions {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  json?: unknown;
}

export interface RouteMockOptions {
  method?: string;
  times?: number;
  abort?: boolean;
  fulfill?: RouteFulfillOptions;
}

export interface SerializedRoutePattern {
  kind: "string" | "regex";
  value?: string;
  source?: string;
  flags?: string;
}

export interface SerializedRouteMock {
  id: number;
  pattern: SerializedRoutePattern;
  method?: string;
  remaining?: number;
  abort?: boolean;
  fulfill?: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
}

export function serializeRouteMock(
  id: number,
  pattern: RoutePattern,
  options: RouteMockOptions,
): SerializedRouteMock {
  const fulfill = normalizeFulfill(options.fulfill);

  return {
    id,
    pattern:
      pattern instanceof RegExp
        ? { kind: "regex", source: pattern.source, flags: pattern.flags }
        : { kind: "string", value: pattern },
    method: options.method?.toUpperCase(),
    remaining: options.times,
    abort: options.abort ?? false,
    fulfill,
  };
}

function normalizeFulfill(
  fulfill: RouteFulfillOptions | undefined,
): SerializedRouteMock["fulfill"] | undefined {
  if (!fulfill) return undefined;

  if (fulfill.json !== undefined) {
    return {
      status: fulfill.status ?? 200,
      headers: {
        "content-type": "application/json",
        ...(fulfill.headers ?? {}),
      },
      body: JSON.stringify(fulfill.json),
    };
  }

  return {
    status: fulfill.status ?? 200,
    headers: fulfill.headers ?? {},
    body: fulfill.body ?? "",
  };
}
