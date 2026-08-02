import {
  BrowserContext,
  type BrowserContextOptions,
} from "./browser-context";

export interface BrowserLaunchOptions extends BrowserContextOptions {}

export class Browser {
  readonly #options: BrowserLaunchOptions;
  readonly #contexts = new Set<BrowserContext>();

  private constructor(options: BrowserLaunchOptions = {}) {
    this.#options = options;
  }

  static async launch(options: BrowserLaunchOptions = {}): Promise<Browser> {
    return new Browser(options);
  }

  async newContext(options: BrowserContextOptions = {}): Promise<BrowserContext> {
    const context = new BrowserContext({ ...this.#options, ...options });
    this.#contexts.add(context);
    return context;
  }

  async close(): Promise<void> {
    for (const context of this.#contexts) {
      await context.close();
    }
    this.#contexts.clear();
  }
}
