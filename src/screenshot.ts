import { mkdir } from "node:fs/promises";
import {
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export interface ScreenshotCompareOptions {
  snapshotDir?: string;
  updateSnapshots?: boolean;
  threshold?: number;
  maxDiffPixels?: number;
}

export interface ImportMetaLike {
  dir?: string;
  file?: string;
  path?: string;
  url?: string;
}

export async function assertScreenshot(
  capture: () => Promise<Blob>,
  name: string,
  options: ScreenshotCompareOptions = {},
): Promise<void> {
  const snapshotName = ensurePngExtension(name);
  const snapshotDir = resolve(options.snapshotDir ?? "__screenshots__");
  const snapshotPath = join(snapshotDir, snapshotName);
  const actualPath = join(snapshotDir, "__actual__", snapshotName);
  const diffPath = join(snapshotDir, "__diff__", snapshotName);
  const shouldUpdate =
    options.updateSnapshots ?? process.env.UPDATE_SCREENSHOTS === "1";

  const actualBytes = await capture();
  await ensureDirectory(dirname(snapshotPath));

  const baselineFile = Bun.file(snapshotPath);
  const baselineExists = await baselineFile.exists();

  if (!baselineExists || shouldUpdate) {
    await Bun.write(snapshotPath, actualBytes);
    return;
  }

  const baselineBytes = new Uint8Array(await baselineFile.arrayBuffer());
  const actualBuffer = new Uint8Array(await actualBytes.arrayBuffer());
  const baseline = PNG.sync.read(Buffer.from(baselineBytes));
  const actual = PNG.sync.read(Buffer.from(actualBuffer));

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    await ensureDirectory(dirname(actualPath));
    await Bun.write(actualPath, actualBytes);
    throw new Error(
      `Screenshot size mismatch for "${name}": expected ${baseline.width}x${baseline.height}, received ${actual.width}x${actual.height}. Actual written to ${actualPath}`,
    );
  }

  const diff = new PNG({ width: actual.width, height: actual.height });
  const diffPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    actual.width,
    actual.height,
    {
      threshold: options.threshold ?? 0.1,
    },
  );

  if (diffPixels <= (options.maxDiffPixels ?? 0)) {
    return;
  }

  await ensureDirectory(dirname(actualPath));
  await ensureDirectory(dirname(diffPath));
  await Bun.write(actualPath, actualBytes);
  await Bun.write(diffPath, PNG.sync.write(diff));
  throw new Error(
    `Screenshot mismatch for "${name}": ${diffPixels} pixels differ. Baseline: ${snapshotPath}. Actual: ${actualPath}. Diff: ${diffPath}`,
  );
}

export function screenshotName(
  source: ImportMetaLike | string,
  label?: string,
): string {
  const sourcePath = resolveSourcePath(source);
  const relativeSource = relative(process.cwd(), sourcePath);
  const stem = removeExtension(relativeSource);

  if (!label) {
    return ensurePngExtension(stem);
  }

  const cleanLabel = sanitizePathSegment(removeExtension(label));
  return ensurePngExtension(join(stem, cleanLabel));
}

function resolveSourcePath(source: ImportMetaLike | string): string {
  if (typeof source === "string") {
    return resolve(source);
  }

  if (source.file) return resolve(source.file);
  if (source.url) return resolve(new URL(source.url).pathname);
  if (source.path) {
    if (!isAbsolute(source.path) && source.dir) {
      return resolve(source.dir, source.path);
    }
    return isAbsolute(source.path) ? source.path : resolve(source.path);
  }

  throw new Error("Could not derive screenshot name: source path is missing");
}

function removeExtension(value: string): string {
  const extension = extname(value);
  return extension ? value.slice(0, -extension.length) : value;
}

function sanitizePathSegment(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensurePngExtension(name: string): string {
  return name.endsWith(".png") ? name : `${name}.png`;
}

async function ensureDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}
