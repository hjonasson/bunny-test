import { afterEach, expect as bunExpect, test } from "bun:test";
import { Browser } from "./index";

const servers: Bun.Server[] = [];
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

  bunExpect(originState?.localStorage).toContainEqual({ name: "token", value: "abc123" });
  bunExpect(originState?.sessionStorage).toContainEqual({ name: "flash", value: "welcome" });
  bunExpect(state.cookies.some((cookie) => cookie.name === "theme" && cookie.value === "dark")).toBe(true);

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
