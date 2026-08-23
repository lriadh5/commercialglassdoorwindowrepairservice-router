import type { Context } from "https://edge.netlify.com";

const SITE = "https://commercialglassdoorwindowrepairservice.com";

// Lazily loaded and cached on first invocation per isolate -- NOT a
// top-level await, per Netlify's edge function guidance (global logic must
// live inside a function, not run at module-evaluation time). Regenerated
// fresh before every build by scripts/generate-page-meta.mjs from
// src/data/pages/*.json -- the SEO pipeline's output.
let pagesMetaPromise: Promise<Record<string, { title: string; meta_description: string }>> | null = null;

function loadPagesMeta() {
  if (!pagesMetaPromise) {
    pagesMetaPromise = Deno.readTextFile(new URL("./pages-meta.json", import.meta.url))
      .then((raw) => JSON.parse(raw))
      .catch(() => ({}));
  }
  return pagesMetaPromise;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async (request: Request, context: Context) => {
  const response = await context.next();

  try {
    const url = new URL(request.url);
    const slug = url.pathname.replace(/^\/pages\//, "").replace(/\/$/, "");

    const pagesMeta = await loadPagesMeta();
    const meta = pagesMeta[slug];
    if (!meta) {
      return response;
    }

    // Statuses that must not (or cannot, per the Fetch API spec) carry a
    // rewritten body: redirects and null-body statuses (204/205/304).
    if (response.status >= 300 && response.status < 400) {
      return response;
    }
    if ([204, 205, 304].includes(response.status)) {
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

    return new Response(html, { status: response.status, headers });
  } catch (_err) {
    // Never let a metadata-injection bug break the page -- fall back to the
    // unmodified origin response.
    return response;
  }
};

export const config = { path: "/pages/*" };
