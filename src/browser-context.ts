import { Page, type PageOptions } from "./page";
import {
  serializeRouteMock,
  type RouteMockOptions,
  type RoutePattern,
  type SerializedRouteMock,
} from "./network";

export interface BrowserContextOptions extends PageOptions {}

export interface CookieState {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

export interface OriginStorageState {
  origin: string;
  localStorage: Array<{ name: string; value: string }>;
  sessionStorage: Array<{ name: string; value: string }>;
}

export interface StorageState {
  cookies: CookieState[];
  origins: OriginStorageState[];
}

export class BrowserContext {
  readonly #options: BrowserContextOptions;
  readonly #pages = new Set<Page>();
  readonly #routes = new Map<number, SerializedRouteMock>();
  #storageState: StorageState = { cookies: [], origins: [] };
  #nextRouteId = 1;

  constructor(options: BrowserContextOptions = {}) {
    this.#options = options;
  }

  async newPage(url = "about:blank"): Promise<Page> {
    const page = await Page.launch(url, this.#options);
    this.#pages.add(page);
    page.attachContext(this);
    await page.syncMockRoutes(this.#serializedRoutes());
    await page.syncStorageState(this.#storageState);
    return page;
  }

  async storageState(): Promise<StorageState> {
    let state = this.#storageState;
    for (const page of this.pages()) {
      state = mergeStorageState(state, await page.readStorageState());
    }
    this.#storageState = state;
    return state;
  }

  async setStorageState(state: StorageState): Promise<void> {
    this.#storageState = state;
    await Promise.all(this.pages().map((page) => page.syncStorageState(state)));
  }

  async cookies(): Promise<CookieState[]> {
    return (await this.storageState()).cookies;
  }

  async addCookies(cookies: CookieState[]): Promise<void> {
    await this.setStorageState(
      mergeStorageState(this.#storageState, { cookies, origins: [] }),
    );
  }

  async route(pattern: RoutePattern, options: RouteMockOptions): Promise<void> {
    const id = this.#nextRouteId++;
    this.#routes.set(id, serializeRouteMock(id, pattern, options));
    await this.#syncRoutes();
  }

  async unroute(pattern?: RoutePattern): Promise<void> {
    if (!pattern) {
      this.#routes.clear();
      await this.#syncRoutes();
      return;
    }

    for (const [id, route] of this.#routes) {
      if (matchesPattern(route, pattern)) {
        this.#routes.delete(id);
      }
    }

    await this.#syncRoutes();
  }

  pages(): Page[] {
    return [...this.#pages].filter((page) => !page.isClosed);
  }

  async close(): Promise<void> {
    for (const page of this.pages()) {
      page.close();
    }
    this.#pages.clear();
  }

  async #syncRoutes(): Promise<void> {
    const routes = this.#serializedRoutes();
    await Promise.all(this.pages().map((page) => page.syncMockRoutes(routes)));
  }

  #serializedRoutes(): SerializedRouteMock[] {
    return [...this.#routes.values()];
  }
}

function mergeStorageState(
  left: StorageState,
  right: StorageState,
): StorageState {
  const origins = new Map<string, OriginStorageState>();
  for (const origin of [...left.origins, ...right.origins]) {
    origins.set(origin.origin, origin);
  }

  const cookies = new Map<string, CookieState>();
  for (const cookie of [...left.cookies, ...right.cookies]) {
    cookies.set(
      `${cookie.domain ?? ""}|${cookie.path ?? "/"}|${cookie.name}`,
      cookie,
    );
  }

  return {
    cookies: [...cookies.values()],
    origins: [...origins.values()],
  };
}

function matchesPattern(
  route: SerializedRouteMock,
  pattern: RoutePattern,
): boolean {
  if (pattern instanceof RegExp) {
    return (
      route.pattern.kind === "regex" &&
      route.pattern.source === pattern.source &&
      route.pattern.flags === pattern.flags
    );
  }

  return route.pattern.kind === "string" && route.pattern.value === pattern;
}
