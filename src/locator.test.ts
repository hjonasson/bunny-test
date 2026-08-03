import { mkdtempSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, expect as bunExpect, test } from "bun:test";
import { Page, expect as e2eExpect, screenshotName } from "./index";
import { assertScreenshot } from "./screenshot";

const html = (body: string) =>
  `data:text/html,${encodeURIComponent(`<!DOCTYPE html><html><body>${body}</body></html>`)}`;

let page: Page;
afterEach(() => page?.close());

test("locator() supports click through scoped descendants", async () => {
  page = await Page.launch(
    html(`
      <div id="app">
        <button id="save" onclick="document.body.dataset.clicked='yes'">
          <span>Save</span>
        </button>
      </div>
    `),
  );

  await page.locator("#app").locator("#save").click();
  const clicked = await page.evaluate<string>(
    `document.body.dataset.clicked ?? ""`,
  );
  bunExpect(clicked).toBe("yes");
});

test("byRole() returns a reusable locator", async () => {
  page = await Page.launch(
    html(
      `<button onclick="document.body.dataset.clicked='yes'">Click me</button>`,
    ),
  );

  const button = page.byRole("button", { name: "Click me" });
  await button.click();
  bunExpect(await button.textContent()).toContain("Click me");
  bunExpect(
    await page.evaluate<string>(`document.body.dataset.clicked ?? ""`),
  ).toBe("yes");
});

test("locator.fill() and inputValue() work for forms", async () => {
  page = await Page.launch(
    html(`<input id="email" value="start@example.com" />`),
  );

  const field = page.locator("#email");
  await field.fill("user@example.com");
  bunExpect(await field.inputValue()).toBe("user@example.com");
});

test("locator.waitFor() and expect(locator) retry until visible", async () => {
  page = await Page.launch(
    html(`
      <div id="message" style="display:none">Ready</div>
      <script>
        setTimeout(() => {
          document.querySelector('#message').style.display = 'block';
        }, 150);
      </script>
    `),
  );

  const message = page.locator("#message");
  await message.waitFor({ state: "visible", timeout: 1000 });
  await e2eExpect(message).toBeVisible({ timeout: 1000 });
  await e2eExpect(message).toHaveText("Ready", { timeout: 1000 });
});

test("expect(page) retries title and URL assertions", async () => {
  page = await Page.launch(
    html(`
      <script>
        document.title = 'Loading';
        setTimeout(() => {
          document.title = 'Ready';
        }, 150);
      </script>
    `),
  );

  await e2eExpect(page).toHaveURL("data:text/html", { timeout: 1000 });
  await e2eExpect(page).toHaveTitle("Ready", { timeout: 1000 });
});

test("expect(page).toMatchScreenshot creates and compares snapshots", async () => {
  const snapshotDir = mkdtempSync(join(tmpdir(), "bun-e2e-screens-"));

  try {
    page = await Page.launch(
      html(`
        <style>
          body { margin: 0; background: white; }
          #card {
            width: 120px;
            height: 80px;
            display: grid;
            place-items: center;
            background: rgb(0, 128, 255);
            color: white;
            font: 16px sans-serif;
          }
        </style>
        <div id="card">Ready</div>
      `),
      { width: 160, height: 120 },
    );

    await e2eExpect(page).toMatchScreenshot("card", { snapshotDir });
    bunExpect(await Bun.file(join(snapshotDir, "card.png")).exists()).toBe(
      true,
    );

    await e2eExpect(page).toMatchScreenshot("card", { snapshotDir });

    await page.evaluate(
      `document.querySelector('#card').textContent = 'Changed'`,
    );

    await bunExpect(
      e2eExpect(page).toMatchScreenshot("card", { snapshotDir }),
    ).rejects.toThrow(/Screenshot mismatch/);

    bunExpect(
      await Bun.file(join(snapshotDir, "__actual__", "card.png")).exists(),
    ).toBe(true);
    bunExpect(
      await Bun.file(join(snapshotDir, "__diff__", "card.png")).exists(),
    ).toBe(true);
  } finally {
    rmSync(snapshotDir, { recursive: true, force: true });
  }
});

test("can compare a saved Page one baseline against a Page two render", async () => {
  const snapshotDir = mkdtempSync(join(tmpdir(), "bun-e2e-demo-shot-"));
  const snapshotName = "page-one-demo.png";

  try {
    page = await Page.launch(html(`<button>Page one</button>`));
    await Bun.write(
      join(snapshotDir, snapshotName),
      await page.screenshotBytes(),
    );
    await page.close();

    page = await Page.launch(html(`<button>Page two</button>`));

    await bunExpect(
      assertScreenshot(() => page.screenshotBytes(), snapshotName, {
        snapshotDir,
      }),
    ).rejects.toThrow(/Screenshot mismatch/);

    bunExpect(
      await Bun.file(join(snapshotDir, "__actual__", snapshotName)).exists(),
    ).toBe(true);
    bunExpect(
      await Bun.file(join(snapshotDir, "__diff__", snapshotName)).exists(),
    ).toBe(true);
  } finally {
    rmSync(snapshotDir, { recursive: true, force: true });
  }
});

test("expect(locator).toMatchScreenshot crops to the target element", async () => {
  const snapshotDir = mkdtempSync(join(tmpdir(), "bun-e2e-locator-shot-"));

  try {
    page = await Page.launch(
      html(`
        <style>
          body { margin: 0; background: rgb(240, 240, 240); }
          #card {
            width: 120px;
            height: 80px;
            margin: 20px;
            display: grid;
            place-items: center;
            background: rgb(20, 120, 255);
            color: white;
            font: 16px sans-serif;
          }
        </style>
        <div id="card">Ready</div>
      `),
      { width: 300, height: 200 },
    );

    const card = page.locator("#card");
    const name = screenshotName(import.meta.path, "locator-card");

    await e2eExpect(card).toMatchScreenshot(name, { snapshotDir });
    await e2eExpect(card).toMatchScreenshot(name, { snapshotDir });

    await page.evaluate(
      `document.querySelector('#card').textContent = 'Changed'`,
    );

    await bunExpect(
      e2eExpect(card).toMatchScreenshot(name, { snapshotDir }),
    ).rejects.toThrow(/Screenshot mismatch/);
  } finally {
    rmSync(snapshotDir, { recursive: true, force: true });
  }
});

test("screenshot masks ignore unstable regions", async () => {
  const snapshotDir = mkdtempSync(join(tmpdir(), "bun-e2e-mask-shot-"));

  try {
    page = await Page.launch(
      html(`
        <style>
          body { margin: 0; background: white; font: 16px sans-serif; }
          #card {
            width: 200px;
            margin: 24px;
            padding: 16px;
            border: 1px solid rgb(210, 210, 210);
          }
          #clock {
            margin-top: 8px;
            width: 90px;
            padding: 6px 8px;
            background: rgb(40, 40, 40);
            color: white;
          }
        </style>
        <div id="card">
          <div>Stable content</div>
          <div id="clock">10:30</div>
        </div>
      `),
      { width: 320, height: 220 },
    );

    const name = screenshotName(import.meta.path, "masked-card");
    await e2eExpect(page).toMatchScreenshot(name, {
      snapshotDir,
      mask: ["#clock"],
    });

    await page.evaluate(`(() => {
      const clock = document.querySelector('#clock');
      clock.textContent = '11:45';
      clock.style.background = 'rgb(255, 80, 0)';
    })()`);

    await e2eExpect(page).toMatchScreenshot(name, {
      snapshotDir,
      mask: [page.locator("#clock")],
    });
  } finally {
    rmSync(snapshotDir, { recursive: true, force: true });
  }
});

test("same unstable region change fails without a mask", async () => {
  const snapshotDir = mkdtempSync(join(tmpdir(), "bun-e2e-unmasked-shot-"));

  try {
    page = await Page.launch(
      html(`
        <style>
          body { margin: 0; background: white; font: 16px sans-serif; }
          #card {
            width: 200px;
            margin: 24px;
            padding: 16px;
            border: 1px solid rgb(210, 210, 210);
          }
          #clock {
            margin-top: 8px;
            width: 90px;
            padding: 6px 8px;
            background: rgb(40, 40, 40);
            color: white;
          }
        </style>
        <div id="card">
          <div>Stable content</div>
          <div id="clock">10:30</div>
        </div>
      `),
      { width: 320, height: 220 },
    );

    const name = screenshotName(import.meta.path, "unmasked-card");
    await e2eExpect(page).toMatchScreenshot(name, { snapshotDir });

    await page.evaluate(`(() => {
      const clock = document.querySelector('#clock');
      clock.textContent = '11:45';
      clock.style.background = 'rgb(255, 80, 0)';
    })()`);

    await bunExpect(
      e2eExpect(page).toMatchScreenshot(name, { snapshotDir }),
    ).rejects.toThrow(/Screenshot mismatch/);

    bunExpect(
      await Bun.file(join(snapshotDir, "__diff__", name)).exists(),
    ).toBe(true);
  } finally {
    rmSync(snapshotDir, { recursive: true, force: true });
  }
});

test("masking the unstable region does not hide stable content changes", async () => {
  const snapshotDir = mkdtempSync(join(tmpdir(), "bun-e2e-partial-mask-shot-"));

  try {
    page = await Page.launch(
      html(`
        <style>
          body { margin: 0; background: white; font: 16px sans-serif; }
          #card {
            width: 200px;
            margin: 24px;
            padding: 16px;
            border: 1px solid rgb(210, 210, 210);
          }
          #clock {
            margin-top: 8px;
            width: 90px;
            padding: 6px 8px;
            background: rgb(40, 40, 40);
            color: white;
          }
        </style>
        <div id="card">
          <div id="status">Stable content</div>
          <div id="clock">10:30</div>
        </div>
      `),
      { width: 320, height: 220 },
    );

    const name = screenshotName(import.meta.path, "partial-mask-card");
    await e2eExpect(page).toMatchScreenshot(name, {
      snapshotDir,
      mask: ["#clock"],
    });

    await page.evaluate(`(() => {
      const clock = document.querySelector('#clock');
      const status = document.querySelector('#status');
      clock.textContent = '11:45';
      clock.style.background = 'rgb(255, 80, 0)';
      status.textContent = 'Changed stable content';
    })()`);

    await bunExpect(
      e2eExpect(page).toMatchScreenshot(name, {
        snapshotDir,
        mask: ["#clock"],
      }),
    ).rejects.toThrow(/Screenshot mismatch/);
  } finally {
    rmSync(snapshotDir, { recursive: true, force: true });
  }
});

test("screenshotName derives stable names from the test file", () => {
  bunExpect(screenshotName(import.meta.path, "Hero Card")).toContain(
    "src/locator.test/Hero-Card.png",
  );
  bunExpect(screenshotName(import.meta.path)).toContain("src/locator.test.png");
});

test("locator state helpers reflect enabled checked and visible state", async () => {
  page = await Page.launch(
    html(`
      <input id="box" disabled checked value="x" />
      <div id="hidden" style="display:none">nope</div>
    `),
  );

  const box = page.locator("#box");
  const hidden = page.locator("#hidden");

  bunExpect(await box.isEnabled()).toBe(false);
  bunExpect(await box.isChecked()).toBe(true);
  bunExpect(await hidden.isVisible()).toBe(false);
  await e2eExpect(hidden).toBeHidden({ timeout: 300 });
});

test("locator collection helpers support count first last and nth", async () => {
  page = await Page.launch(
    html(`
      <button>First</button>
      <button>Second</button>
      <button>Third</button>
    `),
  );

  const buttons = page.locator("button");
  bunExpect(await buttons.count()).toBe(3);
  bunExpect(await buttons.first().textContent()).toContain("First");
  bunExpect(await buttons.nth(1).textContent()).toContain("Second");
  bunExpect(await buttons.last().textContent()).toContain("Third");
});

test("locator.filter supports hasText and has", async () => {
  page = await Page.launch(
    html(`
      <article><h2>Draft</h2><span class="badge">internal</span></article>
      <article><h2>Published</h2><span class="badge">public</span></article>
      <article><h2>Archived</h2></article>
    `),
  );

  const articles = page.locator("article");
  const published = articles.filter({ hasText: "Published" });
  const withPublicBadge = articles.filter({
    has: page.locator(".badge").nth(1),
  });

  bunExpect(await published.count()).toBe(1);
  bunExpect(await published.first().textContent()).toContain("Published");
  bunExpect(await withPublicBadge.count()).toBe(1);
  bunExpect(await withPublicBadge.first().textContent()).toContain("Published");
});
