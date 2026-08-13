import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, expect as bunExpect, test } from "bun:test";
import { Browser } from "./index";

const servers: Bun.Server<unknown>[] = [];
const browsers: Browser[] = [];

afterEach(async () => {
  while (browsers.length) {
    await browsers.pop()!.close();
  }
  while (servers.length) {
    await servers.pop()!.stop(true);
  }
});

test("context storageState captures and restores localStorage sessionStorage and cookies", async () => {
  const server = Bun.serve({
    port: 0,
    fetch() {
      return new Response(
        `<!DOCTYPE html><html><body><h1>Storage</h1></body></html>`,
        {
          headers: { "content-type": "text/html" },
        },
      );
    },
  });
  servers.push(server);

  const browser = await Browser.launch();
  browsers.push(browser);

  const context = await browser.newContext();
  const page = await context.newPage(server.url.toString());

  await page.evaluate(`(() => {
    localStorage.setItem("token", "abc123");
    sessionStorage.setItem("flash", "welcome");
    document.cookie = "theme=dark; path=/";
  })()`);

  const state = await context.storageState();
  const originState = state.origins.find(
    (entry) => entry.origin === server.url.origin,
  );

  bunExpect(originState?.localStorage).toContainEqual({
    name: "token",
    value: "abc123",
  });
  bunExpect(originState?.sessionStorage).toContainEqual({
    name: "flash",
    value: "welcome",
  });
  bunExpect(
    state.cookies.some(
      (cookie) => cookie.name === "theme" && cookie.value === "dark",
    ),
  ).toBe(true);

  const secondContext = await browser.newContext();
  await secondContext.setStorageState(state);
  const restoredPage = await secondContext.newPage(server.url.toString());

  bunExpect(
    await restoredPage.evaluate(`localStorage.getItem("token") ?? ""`),
  ).toBe("abc123");
  bunExpect(
    await restoredPage.evaluate(`sessionStorage.getItem("flash") ?? ""`),
  ).toBe("welcome");
  bunExpect(
    await restoredPage.evaluate(`document.cookie.includes("theme=dark")`),
  ).toBe(true);
});

test("context can save and restore storage state from disk for authenticated flows", async () => {
  const tempDir = mkdtempSync(join(tmpdir(), "bun-e2e-auth-"));
  const statePath = join(tempDir, "auth-state.json");

  try {
    const server = Bun.serve({
      port: 0,
      fetch() {
        return new Response(
          `<!DOCTYPE html><html><body><h1>Dashboard</h1></body></html>`,
          {
            headers: { "content-type": "text/html" },
          },
        );
      },
    });
    servers.push(server);

    const browser = await Browser.launch();
    browsers.push(browser);

    const context = await browser.newContext();
    const page = await context.newPage(server.url.toString());

    await page.evaluate(`(() => {
      localStorage.setItem("user", "ada");
      sessionStorage.setItem("session", "logged-in");
      document.cookie = "auth=token-abc; path=/";
    })()`);

    const savedPath = await context.saveStorageState(statePath);
    bunExpect(savedPath).toBe(statePath);

    const nextContext = await browser.newContext();
    await nextContext.loadStorageState(statePath);
    const restoredPage = await nextContext.newPage(server.url.toString());

    bunExpect(
      await restoredPage.evaluate(`localStorage.getItem("user") ?? ""`),
    ).toBe("ada");
    bunExpect(
      await restoredPage.evaluate(`sessionStorage.getItem("session") ?? ""`),
    ).toBe("logged-in");
    bunExpect(
      await restoredPage.evaluate(`document.cookie.includes("auth=token-abc")`),
    ).toBe(true);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("context can save and restore default storage state without an explicit path", async () => {
  const server = Bun.serve({
    port: 0,
    fetch() {
      return new Response(
        `<!DOCTYPE html><html><body><h1>Default storage</h1></body></html>`,
        {
          headers: { "content-type": "text/html" },
        },
      );
    },
  });
  servers.push(server);

  const browser = await Browser.launch();
  browsers.push(browser);

  const context = await browser.newContext();
  const page = await context.newPage(server.url.toString());

  await page.evaluate(`(() => {
    localStorage.setItem("defaultUser", "river");
    sessionStorage.setItem("defaultSession", "ready");
    document.cookie = "default=state; path=/";
  })()`);

  const savedPath = await context.saveStorageState();
  bunExpect(await Bun.file(savedPath).exists()).toBe(true);

  const nextContext = await browser.newContext();
  await nextContext.loadStorageState(savedPath);
  const restoredPage = await nextContext.newPage(server.url.toString());

  bunExpect(
    await restoredPage.evaluate(`localStorage.getItem("defaultUser") ?? ""`),
  ).toBe("river");
  bunExpect(
    await restoredPage.evaluate(
      `sessionStorage.getItem("defaultSession") ?? ""`,
    ),
  ).toBe("ready");
  bunExpect(
    await restoredPage.evaluate(`document.cookie.includes("default=state")`),
  ).toBe(true);
});
