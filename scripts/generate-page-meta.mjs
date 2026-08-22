// Regenerates netlify/edge-functions/pages-meta.json before every build: one
// {title, meta_description} entry per file in src/data/pages/ (the SEO
// pipeline's output), keyed by slug. The inject-meta edge function reads
// this to serve correct per-page <title>/<meta>/canonical to crawlers and
// social previews on load, since the site is a client-side-rendered SPA.
// Re-run safe -- re-running with the same files produces the same output.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pagesDir = path.join(root, "src", "data", "pages");
const outDir = path.join(root, "netlify", "edge-functions");
const outPath = path.join(outDir, "pages-meta.json");

const files = existsSync(pagesDir)
  ? readdirSync(pagesDir).filter(f => f.endsWith(".json"))
  : [];

const meta = {};
for (const file of files) {
  const slug = file.replace(/\.json$/, "");
  const data = JSON.parse(readFileSync(path.join(pagesDir, file), "utf8"));
  if (data.title && data.meta_description) {
    meta[slug] = { title: data.title, meta_description: data.meta_description };
  }
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(meta, null, 2) + "\n");
console.log(`pages-meta.json: ${Object.keys(meta).length} pages`);
