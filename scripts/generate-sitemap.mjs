// Regenerates public/sitemap.xml before every build: keeps all existing
// static URLs as-is, and adds one entry per page in
// src/data/generated-pages.json (the SEO pipeline's output). Re-run safe —
// re-running with the same generated-pages.json produces the same file.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = "https://commercialglassdoorwindowrepairservice.com";
const sitemapPath = path.join(root, "public", "sitemap.xml");
const generatedPagesPath = path.join(root, "src", "data", "generated-pages.json");
const today = new Date().toISOString().slice(0, 10);

const existingXml = readFileSync(sitemapPath, "utf8");
const staticLocs = [...existingXml.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map(m => m[1])
  .filter(loc => !loc.includes("/pages/")); // drop stale generated entries, we'll re-add current ones

const generatedPages = JSON.parse(readFileSync(generatedPagesPath, "utf8"));
const generatedLocs = Object.keys(generatedPages).map(slug => `${SITE}/pages/${slug}`);

const allLocs = [...staticLocs, ...generatedLocs];

const urlEntries = allLocs.map(loc => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(sitemapPath, xml);
console.log(`sitemap.xml: ${staticLocs.length} static + ${generatedLocs.length} generated = ${allLocs.length} URLs`);
