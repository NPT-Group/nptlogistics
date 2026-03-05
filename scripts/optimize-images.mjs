import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "_optimized");

const INPUT_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const SKIP_DIRS = new Set(["_optimized", ".git", "node_modules"]);

// Safe default for a marketing site
const MAX_WIDTH = 1600;

// Quality targets (tuned for web)
const WEBP_QUALITY = 78;

// Toggle AVIF if you want later (WebP alone is already a huge win)
const ENABLE_AVIF = false;
const AVIF_QUALITY = 45;

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function relFromPublic(abs) {
  return abs.slice(PUBLIC_DIR.length + 1).replaceAll("\\", "/");
}

function outPathFor(absInput, newExt) {
  const rel = relFromPublic(absInput);
  const relNoExt = rel.replace(path.extname(rel), "");
  return path.join(OUT_DIR, `${relNoExt}${newExt}`);
}

async function ensureDirForFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function optimizeOne(absInput) {
  const ext = path.extname(absInput).toLowerCase();
  if (!INPUT_EXTS.has(ext)) return null;

  const rel = relFromPublic(absInput);
  const inStat = await fs.stat(absInput);

  const img = sharp(absInput, { failOnError: false });
  const meta = await img.metadata();

  let pipeline = sharp(absInput, { failOnError: false });
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const webpOut = outPathFor(absInput, ".webp");
  await ensureDirForFile(webpOut);
  await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut);
  const webpStat = await fs.stat(webpOut);

  let avifStat = null;
  if (ENABLE_AVIF) {
    const avifOut = outPathFor(absInput, ".avif");
    await ensureDirForFile(avifOut);
    await pipeline.clone().avif({ quality: AVIF_QUALITY }).toFile(avifOut);
    avifStat = await fs.stat(avifOut);
  }

  return {
    rel,
    inputBytes: inStat.size,
    webpBytes: webpStat.size,
    avifBytes: avifStat?.size ?? null,
    width: meta.width ?? null,
    height: meta.height ?? null,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const results = [];
  console.log(`Scanning: ${PUBLIC_DIR}`);
  console.log(`Output:   ${OUT_DIR}`);
  console.log(
    `MaxWidth: ${MAX_WIDTH}px | WebP q=${WEBP_QUALITY} | AVIF: ${ENABLE_AVIF ? `on (q=${AVIF_QUALITY})` : "off"}`,
  );
  console.log("");

  for await (const abs of walk(PUBLIC_DIR)) {
    const res = await optimizeOne(abs);
    if (res) results.push(res);
  }

  if (!results.length) {
    console.log("No .jpg/.jpeg/.png images found to optimize.");
    return;
  }

  let totalIn = 0,
    totalWebp = 0,
    totalAvif = 0;
  for (const r of results) {
    totalIn += r.inputBytes;
    totalWebp += r.webpBytes;
    if (r.avifBytes != null) totalAvif += r.avifBytes;
  }

  results.sort((a, b) => b.inputBytes - b.webpBytes - (a.inputBytes - a.webpBytes));

  console.log("Top 25 savings (original -> webp):");
  for (const r of results.slice(0, 25)) {
    const saved = r.inputBytes - r.webpBytes;
    console.log(
      `- ${r.rel} | ${formatBytes(r.inputBytes)} -> ${formatBytes(r.webpBytes)} (saved ${formatBytes(saved)})`,
    );
  }

  console.log("");
  console.log("Totals:");
  console.log(`- Original: ${formatBytes(totalIn)}`);
  console.log(`- WebP:     ${formatBytes(totalWebp)} (saved ${formatBytes(totalIn - totalWebp)})`);
  if (ENABLE_AVIF)
    console.log(
      `- AVIF:     ${formatBytes(totalAvif)} (saved ${formatBytes(totalIn - totalAvif)})`,
    );

  console.log("");
  console.log("Done. Optimized images are in public/_optimized/ (originals not overwritten).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
