import type { PageOptions } from "./page";
import { withPage } from "./index";

export interface WaitForServerOptions {
  timeout?: number;
  interval?: number;
}

export interface ServerPageOptions extends PageOptions {
  server: {
    command: string[];
    url: string;
    cwd?: string;
    bindEnv?:
      | false
      | {
          host?: string;
          port?: string;
        };
    env?: Record<string, string | undefined>;
    readyUrl?: string;
    timeout?: number;
    interval?: number;
    stdout?: "pipe" | "inherit" | "ignore";
    stderr?: "pipe" | "inherit" | "ignore";
  };
}

export async function waitForServer(
  url: string,
  options: WaitForServerOptions = {},
): Promise<void> {
  const timeout = options.timeout ?? 20_000;
  const interval = options.interval ?? 250;
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The app server is still starting.
    }

    await Bun.sleep(interval);
  }

  throw new Error(`Timed out waiting for server at ${url}`);
}

export async function withServerPage<T>(
  options: ServerPageOptions,
  fn: (page: import("./page").Page) => Promise<T>,
): Promise<T> {
  const { server, ...pageOptions } = options;
  const process = Bun.spawn(server.command, {
    cwd: server.cwd,
    env: {
      ...serverSpawnEnv(),
      ...serverBindEnv(server),
      ...server.env,
    },
    stdout: server.stdout ?? "ignore",
    stderr: server.stderr ?? "inherit",
  });

  try {
    await waitForServer(server.readyUrl ?? server.url, {
      timeout: server.timeout,
      interval: server.interval,
    });
    return await withPage(server.url, fn, pageOptions);
  } finally {
    await killProcessTree(process.pid);
  }
}

function processEnvAsStrings(): Record<string, string> {
  const entries = Object.entries(process.env).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );
  return Object.fromEntries(entries);
}

function serverSpawnEnv(): Record<string, string> {
  const env = processEnvAsStrings();

  delete env.BUN_INSPECT;
  delete env.BUN_INSPECT_BRK;
  delete env.NODE_OPTIONS;
  delete env.VSCODE_INSPECTOR_OPTIONS;

  return env;
}

function serverBindEnv(
  server: ServerPageOptions["server"],
): Record<string, string> {
  if (server.bindEnv === false) {
    return {};
  }

  const url = new URL(server.url);
  const bindEnv = server.bindEnv ?? {};
  const hostKey = bindEnv.host ?? "HOST";
  const portKey = bindEnv.port ?? "PORT";

  return {
    [hostKey]: url.hostname,
    [portKey]: url.port || defaultPort(url.protocol),
  };
}

function defaultPort(protocol: string): string {
  if (protocol === "https:") {
    return "443";
  }

  return "80";
}

async function killProcessTree(rootPid: number): Promise<void> {
  const descendantPids = await findDescendantPids(rootPid);

  for (const pid of [...descendantPids].reverse()) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // The process may have already exited.
    }
  }

  try {
    process.kill(rootPid, "SIGTERM");
  } catch {
    // The process may have already exited.
  }
}

async function findDescendantPids(rootPid: number): Promise<number[]> {
  if (process.platform === "win32") {
    return [];
  }

  try {
    const output = await Bun.$`ps -axo pid=,ppid=`.text();
    const childrenByParent = new Map<number, number[]>();

    for (const line of output.split("\n")) {
      const [pidText, parentText] = line.trim().split(/\s+/);
      const pid = Number(pidText);
      const parentPid = Number(parentText);

      if (!Number.isFinite(pid) || !Number.isFinite(parentPid)) {
        continue;
      }

      const children = childrenByParent.get(parentPid) ?? [];
      children.push(pid);
      childrenByParent.set(parentPid, children);
    }

    const descendants: number[] = [];
    const queue = [...(childrenByParent.get(rootPid) ?? [])];

    while (queue.length > 0) {
      const pid = queue.shift();
      if (pid === undefined) {
        continue;
      }

      descendants.push(pid);
      queue.push(...(childrenByParent.get(pid) ?? []));
    }

    return descendants;
  } catch {
    return [];
  }
}

export const __serverInternals = {
  processEnvAsStrings,
  serverBindEnv,
  serverSpawnEnv,
  findDescendantPids,
};
