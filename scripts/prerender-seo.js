// Runs AFTER `vite build`. For every file in src/data/pages/*.json, writes a
// static dist/pages/{slug}/index.html copy of the built SPA shell with that
// page's own <title>, <meta name="description">, <meta property="og:*">,
// and <link rel="canonical"> swapped into <head>. Netlify serves a static
// file for a route in preference to the SPA catch-all redirect, so crawlers
// and link previews see correct per-page metadata immediately, before any
// JS runs -- no request-time function involved, nothing that can 500. Real
// visitors get the identical JS bundle and hydrate normally; only the
// initial <head> differs page to page.
//
// Also regenerates dist/sitemap.xml as the final build step: keeps every
// existing non-/pages/ entry (homepage, service/city/blog/gallery pages,
// etc. -- not derived from src/data/pages/, so they'd be silently dropped
// if the sitemap were rebuilt from scratch) and refreshes the /pages/*
// entries from the same directory with today's date, so the deployed
// sitemap always matches what's actually published.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, "dist");
const pagesDir = path.join(root, "src", "data", "pages");
const templatePath = path.join(distDir, "index.html");
const sitemapPath = path.join(distDir, "sitemap.xml");
const SITE = "https://commercialglassdoorwindowrepairservice.com";

if (!existsSync(templatePath)) {
  console.error(`prerender-seo: ${templatePath} not found -- did vite build run first?`);
  process.exit(1);
}

const template = readFileSync(templatePath, "utf8");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectMeta(html, title, description, canonicalUrl) {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  if (/<meta name="description" content="[^"]*"\s*\/?>/.test(out)) {
    out = out.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />`
    );
  } else {
    out = out.replace("</head>", `  <meta name="description" content="${description}" />\n  </head>`);
  }

  if (/<meta property="og:title" content="[^"]*"\s*\/?>/.test(out)) {
    out = out.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${title}" />`
    );
  }

  if (/<meta property="og:description" content="[^"]*"\s*\/?>/.test(out)) {
    out = out.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${description}" />`
    );
  }

  out = out.replace("</head>", `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`);

  return out;
}

const files = existsSync(pagesDir)
  ? readdirSync(pagesDir).filter(f => f.endsWith(".json"))
  : [];

let prerendered = 0;
const slugs = [];

for (const file of files) {
  const slug = file.replace(/\.json$/, "");
  const data = JSON.parse(readFileSync(path.join(pagesDir, file), "utf8"));
  if (!data.title || !data.meta_description) continue;

  slugs.push(slug);

  const html = injectMeta(
    template,
    escapeHtml(data.title),
    escapeHtml(data.meta_description),
    `${SITE}/pages/${slug}`
  );

  const outDir = path.join(distDir, "pages", slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html);
  prerendered++;
}

console.log(`prerender-seo: wrote ${prerendered} static /pages/{slug} HTML files`);

if (existsSync(sitemapPath)) {
  const existingXml = readFileSync(sitemapPath, "utf8");
  const staticLocs = [...existingXml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(m => m[1])
    .filter(loc => !loc.includes("/pages/"));

  const today = new Date().toISOString().slice(0, 10);
  const generatedLocs = slugs.map(slug => `${SITE}/pages/${slug}`);
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
  console.log(`prerender-seo: sitemap.xml -- ${staticLocs.length} static + ${generatedLocs.length} pages = ${allLocs.length} URLs`);
} else {
  console.warn("prerender-seo: dist/sitemap.xml not found, skipping sitemap refresh");
}
