import { expect as bunExpect, test } from "bun:test";
import { expect as e2eExpect, withServerPage } from "./index";

test("withServerPage starts a server, waits for it, and opens the page", async () => {
  const port = 43000 + Math.floor(Math.random() * 1000);
  const url = `http://127.0.0.1:${port}`;

  const title = await withServerPage(
    {
      server: {
        command: [
          "bun",
          "-e",
          `Bun.serve({ port: ${port}, hostname: "127.0.0.1", fetch() { return new Response('<!DOCTYPE html><html><head><title>Started</title></head><body><button>Page one</button></body></html>', { headers: { "content-type": "text/html" } }); } });`,
        ],
        url,
      },
    },
    async (page) => {
      await e2eExpect(page).toHaveTitle("Started");
      await e2eExpect(
        page.byRole("button", { name: "Page one" }),
      ).toBeVisible();
      return page.evaluate<string>("document.title");
    },
  );

  bunExpect(title).toBe("Started");
});

test("withServerPage can derive HOST and PORT from url", async () => {
  const port = 44000 + Math.floor(Math.random() * 1000);
  const url = `http://127.0.0.1:${port}`;

  const title = await withServerPage(
    {
      server: {
        command: [
          "bun",
          "-e",
          `const port = Number(process.env.PORT); const hostname = process.env.HOST; Bun.serve({ port, hostname, fetch() { return new Response('<!DOCTYPE html><html><head><title>Derived</title></head><body><button>Page two</button></body></html>', { headers: { "content-type": "text/html" } }); } });`,
        ],
        url,
      },
    },
    async (page) => {
      await e2eExpect(page).toHaveTitle("Derived");
      await e2eExpect(
        page.byRole("button", { name: "Page two" }),
      ).toBeVisible();
      return page.evaluate<string>("document.title");
    },
  );

  bunExpect(title).toBe("Derived");
});

test("withServerPage can disable derived HOST and PORT", async () => {
  const port = 45000 + Math.floor(Math.random() * 1000);
  const url = `http://127.0.0.1:${port}`;

  const title = await withServerPage(
    {
      server: {
        command: [
          "bun",
          "-e",
          `const port = Number(process.env.APP_PORT); const hostname = process.env.APP_HOST; Bun.serve({ port, hostname, fetch() { return new Response('<!DOCTYPE html><html><head><title>Custom</title></head><body><button>Page three</button></body></html>', { headers: { "content-type": "text/html" } }); } });`,
        ],
        url,
        bindEnv: false,
        env: {
          APP_HOST: "127.0.0.1",
          APP_PORT: String(port),
        },
      },
    },
    async (page) => {
      await e2eExpect(page).toHaveTitle("Custom");
      await e2eExpect(
        page.byRole("button", { name: "Page three" }),
      ).toBeVisible();
      return page.evaluate<string>("document.title");
    },
  );

  bunExpect(title).toBe("Custom");
});
