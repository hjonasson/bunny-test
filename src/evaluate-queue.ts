/**
 * Serializes evaluate() calls on a WebView so only one is in flight at a time.
 * Bun.WebView throws ERR_INVALID_STATE if you fire two concurrently.
 */
export class EvaluateQueue {
  #queue: Promise<void> = Promise.resolve();

  run<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.#queue.then(() => fn());
    // Update queue to wait for this item, swallowing errors so the
    // queue itself never rejects and blocks subsequent items
    this.#queue = result.then(
      () => {},
      () => {},
    );
    return result;
  }
}
