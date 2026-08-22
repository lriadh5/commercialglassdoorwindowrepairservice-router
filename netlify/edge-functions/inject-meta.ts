import type { Context } from "https://edge.netlify.com";

// Bundled at build time by Netlify's edge function bundler (Deno.readTextFile
// with a relative URL is the documented pattern for including a static file
// in an edge function's deploy bundle). Regenerated fresh before every build
// by scripts/generate-page-meta.mjs from src/data/pages/*.json -- the SEO
// pipeline's output -- so this stays in sync automatically with no manual step.
const metaRaw = await Deno.readTextFile(new URL("./pages-meta.json", import.meta.url));
const pagesMeta: Record<string, { title: string; meta_description: string }> = JSON.parse(metaRaw);

const SITE = "https://commercialglassdoorwindowrepairservice.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/pages\//, "").replace(/\/$/, "");
  const meta = pagesMeta[slug];

  const response = await context.next();

  // No known page for this slug (e.g. a stale/removed link) -- pass through
  // untouched and let the SPA's own NotFoundPage handle it client-side.
  if (!meta) {
    return response;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.meta_description);
  const canonicalUrl = `${SITE}/pages/${slug}`;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`
  );
  html = html.replace(
    "</head>",
    `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
  );

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");

  return new Response(html, {
    status: response.status,
    headers,
  });
};

export const config = { path: "/pages/*" };
