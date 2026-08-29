// Runs AFTER `vite build`. Writes a real static index.html -- correct
// <head> (title/description/canonical/robots/OG), real static body content,
// and static JSON-LD -- for every route the SPA serves, plus a real
// dist/404.html for genuinely unmatched paths. Netlify serves a static file
// for a route in preference to the catch-all redirect (see netlify.toml),
// so crawlers and link previews see correct per-page content immediately,
// before any JS runs -- no request-time function involved, nothing that
// can 500. Real visitors get the identical JS bundle: main.jsx mounts with
// ReactDOM.createRoot(...).render(...) (not hydrateRoot), which unconditionally
// replaces everything under #root on load, so the prerendered body is purely
// a pre-JS snapshot for crawlers -- it can never diverge from what a real
// visitor with JS sees, because JS always overwrites it.
//
// Route data (CITIES, ALL_SERVICES, FOGGY_CITIES, BLOG_POSTS, etc.) is not
// duplicated here -- it's extracted directly from src/App.jsx's own literal
// `const NAME = ...` declarations (see extractConst below) and evaluated,
// so this script can never drift out of sync with the real site data, and
// App.jsx itself never needs to change.
//
// Also regenerates dist/sitemap.xml as the final build step: keeps every
// existing non-/pages/ entry (already includes every route type below --
// verified against public/sitemap.xml, not derived here) and refreshes the
// /pages/* entries from src/data/pages/*.json with today's date, so the
// deployed sitemap always matches what's actually published.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, "dist");
const pagesDir = path.join(root, "src", "data", "pages");
const templatePath = path.join(distDir, "index.html");
const sitemapPath = path.join(distDir, "sitemap.xml");
const appJsxPath = path.join(root, "src", "App.jsx");
const SITE = "https://commercialglassdoorwindowrepairservice.com";

if (!existsSync(templatePath)) {
  console.error(`prerender-seo: ${templatePath} not found -- did vite build run first?`);
  process.exit(1);
}

const template = readFileSync(templatePath, "utf8");
const appSource = readFileSync(appJsxPath, "utf8");

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Pull plain-data consts straight out of App.jsx's source -------------
// Finds `const NAME = <expr>;` and returns the exact source text of <expr>,
// by scanning forward tracking string/bracket state to the terminating
// top-level semicolon. Works for any of App.jsx's top-level array/object/
// string literal consts (CITIES, ALL_SERVICES worth of arrays, etc.) without
// needing a JSX-aware parser, since none of these particular declarations
// contain JSX.
function extractConstSource(source, name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`prerender-seo: could not find "const ${name} =" in App.jsx`);
  }
  let i = start + marker.length;
  let depth = 0;
  let inString = null;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") { i++; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === "[" || ch === "{" || ch === "(") depth++;
    else if (ch === "]" || ch === "}" || ch === ")") depth--;
    else if (ch === ";" && depth === 0) break;
  }
  if (i >= source.length) {
    throw new Error(`prerender-seo: unterminated "const ${name} =" in App.jsx`);
  }
  return source.slice(start + marker.length, i);
}

const DATA_NAMES = [
  "CITIES", "COMMERCIAL_SERVICES", "RESIDENTIAL_SERVICES", "SHOWER_SERVICES",
  "FOGGY_CITIES", "FOGGY_FAQS", "BLOG_POSTS", "WHY_CHOOSE_FACTS",
  "COMPANY", "PHONE", "PHONE_HREF",
];
const declarations = DATA_NAMES
  .map(name => `const ${name} = ${extractConstSource(appSource, name)};`)
  .join("\n");
const evalBody = `
  "use strict";
  ${declarations}
  const ALL_SERVICES = [...COMMERCIAL_SERVICES, ...RESIDENTIAL_SERVICES, ...SHOWER_SERVICES];
  return { ${DATA_NAMES.join(", ")}, ALL_SERVICES };
`;
const {
  CITIES, COMMERCIAL_SERVICES, RESIDENTIAL_SERVICES, SHOWER_SERVICES, ALL_SERVICES,
  FOGGY_CITIES, FOGGY_FAQS, BLOG_POSTS, WHY_CHOOSE_FACTS, COMPANY, PHONE, PHONE_HREF,
} = new Function(evalBody)();

// --- Generated pages (src/data/pages/*.json) + the same cross-link index
// GeneratedPage/ServicePage/CityPage build at runtime (buildGeneratedIndex
// in App.jsx), reproduced here off the same files. ------------------------
const pageFiles = existsSync(pagesDir) ? readdirSync(pagesDir).filter(f => f.endsWith(".json")) : [];
const generatedPages = {};
for (const file of pageFiles) {
  const slug = file.replace(/\.json$/, "");
  const data = JSON.parse(readFileSync(path.join(pagesDir, file), "utf8"));
  if (!data.title || !data.meta_description) continue;
  generatedPages[slug] = data;
}
function buildGeneratedIndex(field) {
  const index = {};
  for (const [slug, entry] of Object.entries(generatedPages)) {
    const value = entry[field];
    if (!value) continue;
    (index[value] ??= []).push({ slug, title: entry.title || slug });
  }
  return index;
}
const generatedByService = buildGeneratedIndex("service");
const generatedByCity = buildGeneratedIndex("city");

// --- Shared small helpers matching App.jsx's own logic --------------------
function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE}${item.to}`,
    })),
  };
}
function breadcrumbsHtml(items) {
  const parts = items.map((item, i) =>
    i === items.length - 1
      ? `<span>${esc(item.label)}</span>`
      : `<a href="${esc(item.to)}">${esc(item.label)}</a><span> &rsaquo; </span>`
  );
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${parts.join("")}</nav>`;
}
function serviceCategory(svc) {
  if (COMMERCIAL_SERVICES.some(s => s.key === svc.key)) return { label: "Commercial Glass Services", to: "/#commercial-glass-services" };
  if (SHOWER_SERVICES.some(s => s.key === svc.key)) return { label: "Shower Doors", to: "/#residential-shower-services" };
  return { label: "Residential Glass Services", to: "/#residential-shower-services" };
}
function serviceAreaLabel(cityObj) {
  if (!cityObj) return "Serving Northern Virginia, DC & Maryland";
  if (cityObj.state === "DC") return `Serving ${cityObj.name}, DC`;
  if (cityObj.state === "MD") return `Serving ${cityObj.name}, Maryland`;
  return `Serving ${cityObj.name} & Northern Virginia`;
}
function pillsHtml(items, hrefFn, labelFn) {
  return `<div class="pill-list">${items.map(it =>
    `<a href="${esc(hrefFn(it))}" class="pill">${esc(labelFn(it))}</a>`
  ).join("")}</div>`;
}
function linkListHtml(items, hrefFn, labelFn) {
  return `<div class="link-list">${items.map(it =>
    `<a href="${esc(hrefFn(it))}" class="link-list-item">${esc(labelFn(it))}</a>`
  ).join("")}</div>`;
}
function plainListHtml(items) {
  return `<ul>${items.map(text => `<li>${esc(text)}</li>`).join("")}</ul>`;
}
function ctaSectionHtml(heading, body) {
  return `<div class="cta-section"><div class="container"><h2>${esc(heading)}</h2><p>${esc(body)}</p>
    <div class="cta-btns"><a href="${PHONE_HREF}" class="btn-primary">Call ${esc(PHONE)}</a><a href="/contact" class="btn-secondary">Request Estimate</a></div>
  </div></div>`;
}

// --- Per-route-type body + schema builders --------------------------------
// Each returns { path, title, description, schemas, body }. These mirror
// the real React components' visible text and JSON-LD (ServicePage,
// CityPage, FoggyCityPage, BlogPostPage, GeneratedPage, etc. in App.jsx) --
// same headings, same copy, same schema shape -- just emitted as a plain
// HTML string instead of JSX, and without decorative photos (photos add no
// crawlable information and JS replaces this markup on load regardless).

function renderService(svc) {
  const otherServices = ALL_SERVICES.filter(s => s.key !== svc.key).slice(0, 5);
  const featuredLocations = (generatedByService[svc.key] || []).slice(0, 6);
  const category = serviceCategory(svc);
  const crumbs = [{ label: "Home", to: "/" }, { label: category.label, to: category.to }, { label: svc.name, to: `/service/${svc.key}` }];
  const body = `
    <div class="page-hero"><div class="container">
      ${breadcrumbsHtml(crumbs)}
      <h1>${esc(svc.name)} in Northern Virginia, DC &amp; Maryland</h1>
      <p>Professional ${esc(svc.name.toLowerCase())} serving Northern Virginia, Washington DC, and Maryland — Alexandria, Arlington, Fairfax, McLean, Bethesda, and beyond. Licensed, insured, and fast.</p>
    </div></div>
    <section class="section"><div class="container"><div class="service-content"><div class="service-body">
      <h2>About Our ${esc(svc.name)} Service</h2>
      <p>${esc(svc.desc)} Our licensed technicians serve homeowners and businesses in Alexandria, Arlington, Fairfax, McLean, Bethesda, and Washington DC — and every surrounding community throughout Northern Virginia, DC, and Maryland.</p>
      <p>When you call us for ${esc(svc.name.toLowerCase())}, you can expect a fast response, honest pricing, and high-quality workmanship backed by our satisfaction guarantee. We use only premium materials from trusted manufacturers.
      ${svc.key !== "emergency-boardup" ? ` If your glass is damaged outside business hours, our <a href="/service/emergency-boardup">emergency commercial glass repair and board-up service</a> can secure the opening until replacement glass is ready.` : ""}
      Ready to move forward? <a href="/contact">Request a free quote</a> and we'll get back to you fast.</p>
      <h2>Why Choose Us?</h2>
      <ul>
        <li>Same-day service available for most requests</li>
        <li>Licensed and fully insured technicians</li>
        <li>Free estimates — no surprise charges</li>
        <li>All commercial and residential brands serviced</li>
        <li>24/7 emergency service for urgent repairs</li>
        <li>Serving all of Northern Virginia, Washington DC, and Maryland</li>
      </ul>
      <h2>Service Areas</h2>
      <p>We provide ${esc(svc.name.toLowerCase())} throughout Northern Virginia, Washington DC, and Maryland, including:</p>
      ${pillsHtml(CITIES, c => `/city/${c.key}`, c => c.name)}
      ${featuredLocations.length > 0 ? `
      <h2>${esc(svc.name)} — Featured Locations</h2>
      <p>Read our local guides for ${esc(svc.name.toLowerCase())} in these communities:</p>
      ${linkListHtml(featuredLocations, p => `/pages/${p.slug}`, p => p.title)}` : ""}
      <h2>Related Services</h2>
      ${linkListHtml(otherServices, s => `/service/${s.key}`, s => s.name)}
    </div></div></div></section>
    ${ctaSectionHtml(`Need ${svc.name}?`, "Call now for a fast, free estimate. We serve all of Northern Virginia, Washington DC, and Maryland.")}
  `;
  return {
    path: `/service/${svc.key}`,
    title: `${svc.name} in Northern Virginia, DC & Maryland | ${COMPANY} | ${PHONE}`,
    description: `${svc.desc} Licensed, insured, and serving Northern Virginia, Washington DC, and Maryland. Free estimates — call ${PHONE}.`,
    schemas: [
      breadcrumbJsonLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: svc.name,
        name: svc.name,
        description: svc.desc,
        provider: { "@type": "LocalBusiness", name: COMPANY, telephone: PHONE, url: SITE },
        areaServed: CITIES.map(c => `${c.name}, ${c.state}`),
        url: `${SITE}/service/${svc.key}`,
      },
    ],
    body,
  };
}

function renderCity(city) {
  const featuredServices = (generatedByCity[city.key] || []).slice(0, 6);
  const sameState = CITIES.filter(c => c.key !== city.key && c.state === city.state);
  const nearbyCities = (sameState.length >= 4 ? sameState : CITIES.filter(c => c.key !== city.key)).slice(0, 8);
  const crumbs = [{ label: "Home", to: "/" }, { label: "Service Areas", to: "/#service-areas" }, { label: `${city.name}, ${city.state}`, to: `/city/${city.key}` }];
  const body = `
    <div class="page-hero"><div class="container">
      ${breadcrumbsHtml(crumbs)}
      <h1>Commercial Glass Services in ${esc(city.name)}, ${esc(city.state)}</h1>
      <p>Businesses in ${esc(city.name)} depend on clean, secure storefront glass to attract customers and protect their assets. We provide fast, professional glass repair and installation throughout ${esc(city.name)} and ${esc(city.county)}.</p>
    </div></div>
    <section class="section"><div class="container"><div class="service-content"><div class="service-body">
      <h2>Commercial Glass Services in ${esc(city.name)}</h2>
      <p>Businesses in ${esc(city.name)} depend on clean, secure storefront glass to attract customers and protect their assets. Our commercial glass services in ${esc(city.name)} include everything from <a href="/service/emergency-boardup">emergency board-up</a> to full storefront installation.</p>
      ${city.blurb ? `<p>${esc(city.blurb)}</p>` : ""}
      ${linkListHtml(COMMERCIAL_SERVICES, s => `/service/${s.key}`, s => s.name)}
      <h2>Residential Glass in ${esc(city.name)}</h2>
      <p>We also serve homeowners in ${esc(city.name)} with window glass repair, replacement, and custom frameless shower doors.</p>
      ${linkListHtml([...RESIDENTIAL_SERVICES, ...SHOWER_SERVICES], s => `/service/${s.key}`, s => s.name)}
      <h2>Why ${esc(city.name)} Businesses Choose Us</h2>
      <ul>
        <li>Fastest response time in ${esc(city.county)}</li>
        <li>Same-day commercial glass repair available</li>
        <li>24/7 emergency board-up for ${esc(city.name)} businesses</li>
        <li>Licensed, insured, and locally operated</li>
        <li>Free estimates with no obligation</li>
        <li>Hundreds of completed jobs in ${esc(city.name)} and surrounding area</li>
      </ul>
      <p>Ready to get started? <a href="/contact">Request a free quote</a> for your ${esc(city.name)} property, or call us for 24/7 <a href="/service/emergency-boardup">emergency glass repair</a>.</p>
      ${featuredServices.length > 0 ? `
      <h2>Featured Services in ${esc(city.name)}</h2>
      <p>Local guides for glass repair services in ${esc(city.name)}:</p>
      ${linkListHtml(featuredServices, p => `/pages/${p.slug}`, p => p.title)}` : ""}
      <h2>Other Service Areas Near ${esc(city.name)}</h2>
      ${pillsHtml(nearbyCities, c => `/city/${c.key}`, c => c.name)}
    </div></div></div></section>
    ${ctaSectionHtml(`Glass Repair in ${city.name}?`, `Call now for a free estimate. We're your local glass repair experts in ${city.name}, ${city.county}.`)}
  `;
  return {
    path: `/city/${city.key}`,
    title: `Commercial Glass Repair in ${city.name}, ${city.state} | ${COMPANY} | ${PHONE}`,
    description: `Commercial glass door & window repair in ${city.name}, ${city.state} — storefront glass, commercial doors, emergency board-up, and more. Licensed, insured, same-day service. Call ${PHONE}.`,
    schemas: [
      breadcrumbJsonLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Commercial Glass Repair",
        name: `Commercial Glass Repair in ${city.name}, ${city.state}`,
        areaServed: { "@type": "City", name: `${city.name}, ${city.state}` },
        provider: { "@type": "LocalBusiness", name: COMPANY, telephone: PHONE, url: SITE },
        url: `${SITE}/city/${city.key}`,
      },
    ],
    body,
  };
}

function renderFoggyCity(city) {
  const services = ["Foggy window repair", "Broken window seal replacement", "Condensation between panes fix", "Double pane glass replacement", "Triple pane IGU replacement", "Low-E glass upgrade", "Residential window glass repair", "Insulated glass unit replacement"];
  const crumbs = [{ label: "Home", to: "/" }, { label: "Foggy Window Repair", to: "/foggy-window" }, { label: city.name, to: `/foggy-city/${city.key}` }];
  const otherAreas = FOGGY_CITIES.filter(c => c.key !== city.key).slice(0, 8);
  const body = `
    <div class="page-hero"><div class="container">
      ${breadcrumbsHtml(crumbs)}
      <h1>Foggy Window Repair in ${esc(city.name)}, VA</h1>
      <p>Professional foggy window repair and insulated glass unit replacement for homeowners in ${esc(city.name)}, ${esc(city.county)}. We fix cloudy, hazy, and moisture-damaged windows without replacing the whole window.</p>
    </div></div>
    <section class="section"><div class="container"><div class="service-content"><div class="service-body">
      <h2>Foggy Window Repair in ${esc(city.name)}</h2>
      <p>If you're seeing foggy, cloudy, or hazy glass in your ${esc(city.name)} home, the problem is almost always a failed window seal — not dirty glass. Homeowners across ${esc(city.name)} and ${esc(city.county)} call us when they notice condensation or moisture trapped between their window panes.</p>
      <p>The good news: in most cases, you don't need to replace the entire window. We replace only the insulated glass unit (IGU) inside your existing frame — saving ${esc(city.name)} homeowners 60–80% compared to full window replacement.</p>
      <h2>Foggy Window Services in ${esc(city.name)}</h2>
      ${plainListHtml(services)}
      <h2>What Causes Foggy Windows in ${esc(city.name)} Homes?</h2>
      <p>The Northern Virginia climate — with its hot humid summers and cold winters — puts significant stress on window seals. The repeated expansion and contraction of window frames causes seals to break down over time. Once the hermetic seal of your insulated glass unit fails, outside humid air enters between the panes and creates that characteristic foggy, cloudy appearance.</p>
      <p>This is 100% a broken window seal issue. The condensation you see cannot be cleaned away because it's inside the sealed unit. The only fix is insulated glass unit replacement — and that's our specialty in ${esc(city.name)}.</p>
      <h2>Why ${esc(city.name)} Homeowners Choose Us</h2>
      <ul>
        <li>We replace only the IGU — not the whole window — saving you money</li>
        <li>Same-day service available for ${esc(city.name)} and ${esc(city.county)}</li>
        <li>All window brands — Andersen, Pella, Marvin, Milgard, and more</li>
        <li>Free estimates with honest, upfront pricing</li>
        <li>Licensed and insured technicians</li>
        <li>Low-E and energy-efficient glass upgrade options</li>
      </ul>
      <p>Ready to get started? <a href="/contact">Request a free quote</a> for your ${esc(city.name)} home.</p>
      <h2>Other Areas Near ${esc(city.name)}</h2>
      ${pillsHtml(otherAreas, c => `/foggy-city/${c.key}`, c => c.name)}
    </div></div></div></section>
    ${ctaSectionHtml(`Foggy Windows in ${city.name}?`, `Call now — free estimates for ${city.name} homeowners. We'll tell you if you need new glass or a full window.`)}
  `;
  return {
    path: `/foggy-city/${city.key}`,
    title: `Foggy Window Repair in ${city.name}, VA | ${PHONE}`,
    description: `Foggy or cloudy windows in ${city.name}, VA? We replace only the failed insulated glass unit — no full window replacement needed. Free estimates, same-day service available.`,
    schemas: [breadcrumbJsonLd(crumbs)],
    body,
  };
}

function renderBlogPost(post) {
  const crumbs = [{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title, to: `/blog/${post.key}` }];
  const relatedServices = (post.related || []).map(key => ALL_SERVICES.find(s => s.key === key)).filter(Boolean);
  const body = `
    <div class="page-hero"><div class="container">
      ${breadcrumbsHtml(crumbs)}
      <h1>${esc(post.title)}</h1>
      <p>${esc(post.date)} &middot; ${esc(post.cat)}</p>
    </div></div>
    <section class="section"><div class="container"><div class="service-content"><div class="service-body">
      ${(post.sections || []).map(s => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("\n")}
      <p>Have a question about your specific situation? <a href="/contact">Request a free quote</a> and we'll walk you through it.</p>
      ${relatedServices.length > 0 ? `<h2>Related Services</h2>${linkListHtml(relatedServices, s => `/service/${s.key}`, s => s.name)}` : ""}
    </div></div></div></section>
    ${ctaSectionHtml("Have a Glass Repair Question?", "Call now for a fast, free estimate. We serve Northern Virginia, Washington DC, and Maryland.")}
  `;
  return {
    path: `/blog/${post.key}`,
    title: `${post.title} | ${COMPANY} Blog`,
    description: post.excerpt,
    schemas: [
      breadcrumbJsonLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: { "@type": "Organization", name: COMPANY },
        publisher: { "@type": "Organization", name: COMPANY },
        url: `${SITE}/blog/${post.key}`,
      },
    ],
    body,
  };
}

function renderBlogIndex() {
  const body = `
    <div class="page-hero"><div class="container">
      <h1>Glass Repair Tips &amp; Resources</h1>
      <p>Helpful guides for Northern Virginia business owners and homeowners about commercial glass, storefront repair, and residential windows.</p>
    </div></div>
    <section class="section"><div class="container">
      ${linkListHtml(BLOG_POSTS, p => `/blog/${p.key}`, p => p.title)}
    </div></section>
  `;
  return {
    path: "/blog",
    title: `Glass Repair Tips & Resources | ${COMPANY} Blog`,
    description: "Helpful guides on commercial glass repair, emergency board-up, storefront glass, and shower doors for Northern Virginia, DC & Maryland business owners and homeowners.",
    schemas: [],
    body,
  };
}

function renderGallery() {
  const body = `
    <div class="page-hero"><div class="container">
      <h1>Project Gallery</h1>
      <p>Real work from real Northern Virginia projects — commercial glass, storefronts, emergency board-up, residential windows, and more.</p>
    </div></div>
    <section class="section"><div class="container">
      <p>Browse photos of completed storefront glass, emergency board-up, commercial door, residential window, and shower door projects throughout Northern Virginia, Washington DC, and Maryland.</p>
    </div></section>
    ${ctaSectionHtml("Ready to Start Your Project?", "Call now for a free estimate. We serve all of Northern Virginia.")}
  `;
  return {
    path: "/gallery",
    title: `Project Gallery | ${COMPANY} | ${PHONE}`,
    description: "Real commercial glass, storefront, emergency board-up, and residential window repair projects completed throughout Northern Virginia, Washington DC, and Maryland.",
    schemas: [],
    body,
  };
}

function renderContact() {
  const body = `
    <div class="page-hero"><div class="container">
      <h1>Contact Us</h1>
      <p>Request a free estimate or ask a question. We respond fast — usually within the hour during business hours.</p>
    </div></div>
    <section class="section"><div class="container">
      <p>Phone (call or text): <a href="${PHONE_HREF}">${esc(PHONE)}</a></p>
      <p>Email: commercialglassdmv@gmail.com</p>
      <p>Hours: Mon–Sat 7am–7pm. Emergency service available 24/7.</p>
      <p>Service area: All of Northern Virginia, Washington DC, and Maryland.</p>
    </div></section>
  `;
  return {
    path: "/contact",
    title: `Contact Us | Free Estimate | ${COMPANY} | ${PHONE}`,
    description: "Request a free commercial or residential glass repair estimate in Northern Virginia, Washington DC, or Maryland. We typically respond within an hour during business hours.",
    schemas: [],
    body,
  };
}

function renderFoggyWindow() {
  const crumbs = [{ label: "Home", to: "/" }, { label: "Foggy Window Repair", to: "/foggy-window" }];
  const body = `
    <div class="page-hero"><div class="container">
      ${breadcrumbsHtml(crumbs)}
      <h1>Foggy Window Repair &amp; Broken Seal Replacement</h1>
      <p>Cloudy, foggy, or hazy windows are caused by a failed window seal — not dirty glass. We replace only the insulated glass unit (IGU), restoring crystal-clear views and energy efficiency without replacing your entire window.</p>
    </div></div>
    <section class="section"><div class="container">
      <h2>What Causes Foggy Windows?</h2>
      <p>Foggy, cloudy, or hazy windows are caused by failed window seals — not dirty glass. Modern double and triple pane windows contain an insulated glass unit (IGU) filled with argon gas between two or three panes of glass.</p>
      <p>Over time, the seal around the IGU breaks down due to age, temperature cycling, and UV exposure. Once the seal fails, outside air and moisture infiltrates between the panes. This trapped moisture creates condensation — that foggy, wet appearance you see inside the glass.</p>
      <p>The glass itself is typically undamaged. The frame is fine. Only the insulated glass unit needs to be replaced — and that's exactly what we do throughout Northern Virginia.</p>
      <h2>Foggy Window FAQ</h2>
      ${FOGGY_FAQS.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n")}
      <h2>Foggy Window Repair — Service Areas</h2>
      <p>We serve homeowners throughout Northern Virginia. Select your city for local foggy window repair information.</p>
      ${pillsHtml(FOGGY_CITIES, c => `/foggy-city/${c.key}`, c => c.name)}
    </div></section>
    ${ctaSectionHtml("Foggy Windows in Northern Virginia?", "Most foggy windows do NOT need full replacement. Call now for a free estimate.")}
  `;
  return {
    path: "/foggy-window",
    title: `Foggy Window Repair & Broken Seal Replacement | Northern Virginia | ${PHONE}`,
    description: "Foggy, cloudy, or hazy windows? We replace only the failed insulated glass unit (IGU) — no full window replacement needed. Save 60–80%. Free estimates throughout Northern Virginia.",
    schemas: [
      breadcrumbJsonLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FOGGY_FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
    body,
  };
}

function renderGeneratedPage(slug, entry) {
  const { title, intro, sections = [], faq = [], cta, keyword, service, city } = entry;
  const svc = ALL_SERVICES.find(s => s.key === service);
  const cityObj = CITIES.find(c => c.key === city);
  const emergencyService = COMMERCIAL_SERVICES.find(s => s.key === "emergency-boardup");
  const otherLocations = (svc ? generatedByService[svc.key] : []).filter(p => p.slug !== slug).slice(0, 5);
  const crumbs = [
    { label: "Home", to: "/" },
    ...(svc ? [{ label: svc.name, to: `/service/${svc.key}` }] : []),
    ...(cityObj ? [{ label: cityObj.name, to: `/city/${cityObj.key}` }] : []),
    { label: title, to: `/pages/${slug}` },
  ];
  const areaLabel = serviceAreaLabel(cityObj);
  const body = `
    <div class="page-hero"><div class="container">
      ${breadcrumbsHtml(crumbs)}
      <h1>${esc(title)}</h1>
      ${intro ? `<p>${esc(intro)}</p>` : ""}
    </div></div>
    <section class="section"><div class="container"><div class="service-content"><div class="service-body">
      <p>${esc(areaLabel)} — Fast Response, Licensed &amp; Insured, Free Estimates.</p>
      ${sections.map(s => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("\n")}
      <h2>Why Choose Us</h2>
      <ul>${WHY_CHOOSE_FACTS.map(f => `<li><strong>${esc(f.title)}:</strong> ${esc(f.desc)}</li>`).join("")}</ul>
      ${faq.length > 0 ? `<h2>Frequently Asked Questions</h2>${faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n")}` : ""}
      <h2>Related Services &amp; Areas</h2>
      <p>
        ${svc ? `Learn more about our <a href="/service/${esc(svc.key)}">${esc(svc.name.toLowerCase())}</a> services. ` : ""}
        ${cityObj ? `See everything we offer throughout <a href="/city/${esc(cityObj.key)}">${esc(cityObj.name)}, VA</a>. ` : ""}
        ${emergencyService && service !== emergencyService.key ? `Need immediate service? Visit our <a href="/service/${esc(emergencyService.key)}">Emergency Commercial Glass Repair</a> page. ` : ""}
        Ready to get started? <a href="/contact">Request a free quote</a> and we'll get back to you fast.
      </p>
      ${otherLocations.length > 0 && svc ? `<h2>More ${esc(svc.name)} Locations</h2>${linkListHtml(otherLocations, p => `/pages/${p.slug}`, p => p.title)}` : ""}
    </div></div></div></section>
    ${ctaSectionHtml(`Need Help With ${keyword || title}?`, cta || "Call now for a fast, free estimate. We serve all of Northern Virginia.")}
  `;
  return {
    path: `/pages/${slug}`,
    title: `${title} | ${COMPANY}`,
    description: intro || (sections[0] && sections[0].body) || `${title} — serving Northern Virginia, Washington DC, and Maryland. Call ${PHONE} for a free estimate.`,
    schemas: [
      breadcrumbJsonLd(crumbs),
      svc && {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: svc.name,
        name: title,
        description: intro || svc.desc,
        provider: { "@type": "LocalBusiness", name: COMPANY, telephone: PHONE, url: SITE },
        areaServed: cityObj ? `${cityObj.name}, ${cityObj.state}` : CITIES.map(c => `${c.name}, ${c.state}`),
        url: `${SITE}/pages/${slug}`,
      },
      faq.length > 0 && {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
    body,
  };
}

// --- HTML assembly: head/body/JSON-LD injection into the built shell ------
function injectHead(html, { title, description, canonicalPath, robots }) {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);

  out = /<meta name="description" content="[^"]*"\s*\/?>/.test(out)
    ? out.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`)
    : out.replace("</head>", `  <meta name="description" content="${esc(description)}" />\n  </head>`);

  out = /<meta name="robots" content="[^"]*"\s*\/?>/.test(out)
    ? out.replace(/<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${esc(robots)}" />`)
    : out.replace("</head>", `  <meta name="robots" content="${esc(robots)}" />\n  </head>`);

  if (/<meta property="og:title" content="[^"]*"\s*\/?>/.test(out)) {
    out = out.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}" />`);
  }
  if (/<meta property="og:description" content="[^"]*"\s*\/?>/.test(out)) {
    out = out.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(description)}" />`);
  }

  if (canonicalPath) {
    out = out.replace("</head>", `  <link rel="canonical" href="${SITE}${canonicalPath}" />\n  <meta property="og:url" content="${SITE}${canonicalPath}" />\n  </head>`);
  }

  return out;
}

function injectJsonLd(html, schemas) {
  const list = schemas.filter(Boolean);
  if (list.length === 0) return html;
  const scripts = list.map(obj => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>`).join("\n");
  return html.replace("</head>", `${scripts}\n  </head>`);
}

function injectBody(html, bodyHtml) {
  return html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
}

function writeFile(routePath, html) {
  const outDir = path.join(distDir, routePath.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html);
}

function writeRoute({ path: routePath, title, description, schemas, body }) {
  let html = injectHead(template, { title, description, canonicalPath: routePath, robots: "index, follow" });
  html = injectJsonLd(html, schemas);
  html = injectBody(html, body);
  writeFile(routePath, html);
}

// --- Generate every route ---------------------------------------------
let written = 0;
const generatedSlugs = [];

for (const [slug, entry] of Object.entries(generatedPages)) {
  writeRoute(renderGeneratedPage(slug, entry));
  generatedSlugs.push(slug);
  written++;
}
for (const svc of ALL_SERVICES) { writeRoute(renderService(svc)); written++; }
for (const city of CITIES) { writeRoute(renderCity(city)); written++; }
for (const city of FOGGY_CITIES) { writeRoute(renderFoggyCity(city)); written++; }
for (const post of BLOG_POSTS) { writeRoute(renderBlogPost(post)); written++; }
writeRoute(renderBlogIndex()); written++;
writeRoute(renderGallery()); written++;
writeRoute(renderContact()); written++;
writeRoute(renderFoggyWindow()); written++;

console.log(`prerender-seo: wrote ${written} static route HTML files (${generatedSlugs.length} from src/data/pages/*.json, ${ALL_SERVICES.length} services, ${CITIES.length} cities, ${FOGGY_CITIES.length} foggy-cities, ${BLOG_POSTS.length} blog posts, 4 static singles)`);

// --- Real static 404 (see netlify.toml / public/_redirects: the catch-all
// now points here with a genuine 404 status, instead of soft-404ing every
// unmatched path to the homepage with 200). Noindexed, no canonical (no
// single URL is "canonical" for an arbitrary unmatched path). -------------
{
  const notFoundBody = `
    <div class="section" style="text-align:center;padding:80px 20px;"><div class="container">
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist or may have moved. Here are some places to start instead:</p>
      <p>
        <a href="/" class="btn-primary">Home</a>
        <a href="/service/commercial-door" class="btn-secondary">Commercial Services</a>
        <a href="/contact" class="btn-secondary">Contact Us</a>
      </p>
    </div></div>
  `;
  let html = injectHead(template, {
    title: `Page Not Found | ${COMPANY}`,
    description: "The page you're looking for doesn't exist. Browse our commercial glass repair services and service areas, or contact us for help.",
    canonicalPath: null,
    robots: "noindex, follow",
  });
  html = injectBody(html, notFoundBody);
  writeFileSync(path.join(distDir, "404.html"), html);
  console.log("prerender-seo: wrote dist/404.html (noindex)");
}

// --- Sitemap: keep every existing non-/pages/ entry (already covers every
// route type generated above -- verified against public/sitemap.xml, not
// derived here) and refresh /pages/* from src/data/pages/*.json. ----------
if (existsSync(sitemapPath)) {
  const existingXml = readFileSync(sitemapPath, "utf8");
  const staticLocs = [...existingXml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(m => m[1])
    .filter(loc => !loc.includes("/pages/"));

  const today = new Date().toISOString().slice(0, 10);
  const generatedLocs = generatedSlugs.map(slug => `${SITE}/pages/${slug}`);
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
