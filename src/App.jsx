import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";

// Convert an internal page object ({ type, key }) to a real URL path.
function pageToPath(page) {
  switch (page.type) {
    case "home": return "/";
    case "service": return `/service/${page.key}`;
    case "city": return `/city/${page.key}`;
    case "foggy-window": return "/foggy-window";
    case "foggy-city": return `/foggy-city/${page.key}`;
    case "gallery": return "/gallery";
    case "blog": return "/blog";
    case "contact": return "/contact";
    default: return "/";
  }
}

// Derive a minimal page-type object from the current URL, used for nav
// active-state highlighting (Header/Footer only read currentPage.type).
function pathToPageType(pathname) {
  if (pathname === "/") return { type: "home" };
  if (pathname.startsWith("/service/")) return { type: "service" };
  if (pathname.startsWith("/city/")) return { type: "city" };
  if (pathname === "/foggy-window") return { type: "foggy-window" };
  if (pathname.startsWith("/foggy-city/")) return { type: "foggy-city" };
  if (pathname === "/gallery") return { type: "gallery" };
  if (pathname === "/blog") return { type: "blog" };
  if (pathname === "/contact") return { type: "contact" };
  return { type: "home" };
}

const P = {
  hero1: "/images/hero1.jpg",
  hero2: "/images/hero2.jpg",
  hero3: "/images/hero3.jpg",
  sf1: "/images/sf1.jpg",
  sf2: "/images/sf2.jpg",
  sf3: "/images/sf3.jpg",
  sf4: "/images/sf4.jpg",
  sf5: "/images/sf5.jpg",
  sf6: "/images/sf6.jpg",
  sf7: "/images/sf7.jpg",
  sf8: "/images/sf8.jpg",
  sf9: "/images/sf9.jpg",
  sf10: "/images/sf10.jpg",
  em1: "/images/em1.jpg",
  em2: "/images/em2.jpg",
  em3: "/images/em3.jpg",
  em4: "/images/em4.jpg",
  em5: "/images/em5.jpg",
  em6: "/images/em6.jpg",
  em7: "/images/em7.jpg",
  em8: "/images/em8.jpg",
  dr1: "/images/dr1.jpg",
  dr2: "/images/dr2.jpg",
  dr3: "/images/dr3.jpg",
  dr4: "/images/dr4.jpg",
  dr5: "/images/dr5.jpg",
  dr6: "/images/dr6.jpg",
  dr7: "/images/dr7.jpg",
  dr8: "/images/dr8.jpg",
  res1: "/images/res1.jpg",
  res2: "/images/res2.jpg",
  res3: "/images/res3.jpg",
  res4: "/images/res4.jpg",
  res5: "/images/res5.jpg",
  res6: "/images/res6.jpg",
  res7: "/images/res7.jpg",
  res8: "/images/res8.jpg",
  res9: "/images/res9.jpg",
  res10: "/images/res10.jpg",
  res11: "/images/res11.jpg",
  res12: "/images/res12.jpg",
  act1: "/images/act1.jpg",
  act2: "/images/act2.jpg",
  act3: "/images/act3.jpg",
  act4: "/images/act4.jpg",
  act5: "/images/act5.jpg",
  act6: "/images/act6.jpg",
  act7: "/images/act7.jpg",
  act8: "/images/act8.jpg",
  sh_hero1: "/images/sh_hero1.jpg",
  sh_hero2: "/images/sh_hero2.jpg",
  sh_hero3: "/images/sh_hero3.jpg",
  sh_encl1: "/images/sh_encl1.jpg",
  sh_encl2: "/images/sh_encl2.jpg",
  sh_encl3: "/images/sh_encl3.jpg",
  sh_repair1: "/images/sh_repair1.jpg",
  sh_repair2: "/images/sh_repair2.jpg",
  sh_repair3: "/images/sh_repair3.jpg",
  sh_gal1: "/images/sh_gal1.jpg",
  sh_gal2: "/images/sh_gal2.jpg",
  sh_gal3: "/images/sh_gal3.jpg"
};



const PHONE = "(703) 609-3508";
const PHONE_HREF = "tel:7036093508";
const COMPANY = "Commercial Glass Door & Window Repair Services";
const TAGLINE = "NORTHERN VIRGINIA'S GLASS EXPERTS";

const COLORS = {
  primary: "#0F4C81",
  accent: "#1E88E5",
  red: "#C0392B",
  gold: "#FFD700",
  dark: "#1a2332",
  light: "#F7F9FC",
};

const CITIES = [
  { key: "alexandria", name: "Alexandria", county: "Alexandria City", zip: "22301" },
  { key: "arlington", name: "Arlington", county: "Arlington County", zip: "22201" },
  { key: "fairfax", name: "Fairfax", county: "Fairfax County", zip: "22030" },
  { key: "mclean", name: "McLean", county: "Fairfax County", zip: "22101" },
  { key: "tysons", name: "Tysons", county: "Fairfax County", zip: "22102" },
  { key: "reston", name: "Reston", county: "Fairfax County", zip: "20190" },
  { key: "herndon", name: "Herndon", county: "Fairfax County", zip: "20170" },
  { key: "ashburn", name: "Ashburn", county: "Loudoun County", zip: "20147" },
  { key: "leesburg", name: "Leesburg", county: "Loudoun County", zip: "20175" },
  { key: "chantilly", name: "Chantilly", county: "Fairfax County", zip: "20151" },
  { key: "springfield", name: "Springfield", county: "Fairfax County", zip: "22150" },
  { key: "burke", name: "Burke", county: "Fairfax County", zip: "22015" },
  { key: "vienna", name: "Vienna", county: "Fairfax County", zip: "22180" },
  { key: "annandale", name: "Annandale", county: "Fairfax County", zip: "22003" },
  { key: "fallschurch", name: "Falls Church", county: "Falls Church City", zip: "22041" },
  { key: "loudoun", name: "Loudoun County", county: "Loudoun County", zip: "20176" },
  { key: "fairfaxcounty", name: "Fairfax County", county: "Fairfax County", zip: "22035" },
];

const COMMERCIAL_SERVICES = [
  { key: "storefront-glass", name: "Storefront Glass Repair", desc: "Fast repair and replacement of broken or damaged commercial storefront glass throughout Northern Virginia." },
  { key: "commercial-door", name: "Commercial Door Repair", desc: "All-brands commercial door repair including pivots, closers, hinges, and full door replacement." },
  { key: "emergency-boardup", name: "Emergency Board-Up", desc: "24/7 emergency glass board-up service for broken storefronts, vandalism, and accidents." },
  { key: "aluminum-storefront", name: "Aluminum Storefront Doors", desc: "Installation and repair of aluminum storefront door systems for retail and commercial properties." },
  { key: "door-closers", name: "Commercial Door Closers", desc: "Repair and replacement of all commercial door closer brands — LCN, Norton, Dorma, and more." },
  { key: "continuous-hinges", name: "Continuous Hinges", desc: "Installation of piano/continuous hinges for high-traffic commercial doors requiring heavy-duty hardware." },
  { key: "glass-walls", name: "Commercial Glass Walls", desc: "Full-height commercial glass wall systems for offices, lobbies, and retail environments." },
  { key: "storefront-door-repair", name: "Storefront Door Repair", desc: "Same-day repair of damaged, misaligned, or broken storefront doors across Northern Virginia." },
];

const RESIDENTIAL_SERVICES = [
  { key: "window-repair", name: "Window Glass Repair", desc: "Single-pane and double-pane residential window glass repair and replacement for homes across NoVA." },
  { key: "window-replacement", name: "Window Replacement", desc: "Full window unit replacement with energy-efficient glass options for homes in Northern Virginia." },
  { key: "foggy-window-repair", name: "Foggy Window Repair", desc: "Fix cloudy, foggy, or hazy windows caused by failed seals. We replace only the insulated glass unit — saving you hundreds vs full window replacement." },
  { key: "broken-seal-repair", name: "Broken Window Seal Repair", desc: "Repair and replace failed window seals causing condensation, moisture, and cloudiness between panes." },
  { key: "igd-replacement", name: "Insulated Glass Unit Replacement", desc: "Replace only the IGU (glass unit) without replacing the full window frame. Same-day service available." },
  { key: "double-pane-replacement", name: "Double Pane Glass Replacement", desc: "Replace failed double pane glass in any window brand. Restore clarity and energy efficiency." },
  { key: "triple-pane-replacement", name: "Triple Pane Glass Replacement", desc: "Expert triple pane window glass replacement for maximum energy efficiency throughout Northern Virginia." },
  { key: "low-e-glass", name: "Low-E Glass Replacement", desc: "Replace old glass with energy-efficient Low-E glass that reduces heat transfer and UV damage." },
  { key: "screen-repair", name: "Window Screen Repair", desc: "Fast, affordable window screen repair and replacement for residential and commercial properties." },
  { key: "arch-windows", name: "Arch Window Replacement", desc: "Custom-cut glass for arch, circle, and specialty-shaped windows in Northern Virginia homes." },
];

const FOGGY_CITIES = [
  { key: "alexandria", name: "Alexandria", county: "Alexandria City", zip: "22301" },
  { key: "arlington", name: "Arlington", county: "Arlington County", zip: "22201" },
  { key: "fairfax", name: "Fairfax", county: "Fairfax County", zip: "22030" },
  { key: "springfield", name: "Springfield", county: "Fairfax County", zip: "22150" },
  { key: "burke", name: "Burke", county: "Fairfax County", zip: "22015" },
  { key: "annandale", name: "Annandale", county: "Fairfax County", zip: "22003" },
  { key: "fallschurch", name: "Falls Church", county: "Falls Church City", zip: "22041" },
  { key: "mclean", name: "McLean", county: "Fairfax County", zip: "22101" },
  { key: "vienna", name: "Vienna", county: "Fairfax County", zip: "22180" },
  { key: "reston", name: "Reston", county: "Fairfax County", zip: "20190" },
  { key: "herndon", name: "Herndon", county: "Fairfax County", zip: "20170" },
  { key: "chantilly", name: "Chantilly", county: "Fairfax County", zip: "20151" },
  { key: "centreville", name: "Centreville", county: "Fairfax County", zip: "20120" },
  { key: "ashburn", name: "Ashburn", county: "Loudoun County", zip: "20147" },
  { key: "leesburg", name: "Leesburg", county: "Loudoun County", zip: "20175" },
  { key: "sterling", name: "Sterling", county: "Loudoun County", zip: "20164" },
  { key: "manassas", name: "Manassas", county: "Prince William County", zip: "20110" },
];

const FOGGY_FAQS = [
  {
    q: "Why do windows become foggy?",
    a: "Foggy windows are caused by a failed window seal. Modern double and triple pane windows have an insulated glass unit (IGU) filled with argon or krypton gas between the panes. When the seal around the IGU breaks down — due to age, temperature cycling, or moisture — outside air and humidity gets inside the unit. This causes condensation, cloudiness, and that characteristic foggy appearance between the panes. The glass itself is usually fine; it's the seal that has failed."
  },
  {
    q: "Can a broken window seal be repaired?",
    a: "The seal itself cannot be repaired — once it fails, the integrity of the insulated glass unit is compromised. However, you do NOT need to replace the entire window. In most cases, we can replace only the insulated glass unit (IGU) — the glass portion — while keeping your existing window frame. This saves homeowners hundreds or even thousands of dollars compared to full window replacement."
  },
  {
    q: "Do I need a new window or just new glass?",
    a: "Most homeowners with foggy windows only need new glass, not a new window. If your window frame is in good condition — no rotting, warping, or broken hardware — we can simply replace the insulated glass unit inside the existing frame. This is faster, less disruptive, and significantly less expensive. We'll inspect your windows and give you an honest recommendation."
  },
  {
    q: "How much does foggy glass replacement cost?",
    a: "Replacing an insulated glass unit (IGU) in Northern Virginia typically costs $150–$400 per window depending on size, glass type, and accessibility. This is dramatically less expensive than full window replacement, which can run $500–$1,500+ per window installed. Most foggy window repair jobs can be completed in a single visit with same-day service available."
  },
  {
    q: "What causes condensation between window panes?",
    a: "Condensation between window panes is caused by seal failure. When the hermetic seal around the insulated glass unit breaks, outside humid air enters the space between the glass panes. When temperatures change, that moisture condenses on the interior glass surfaces, creating the foggy, wet appearance. This is 100% a seal failure issue — it cannot be cleaned away because the moisture is inside the sealed unit."
  },
  {
    q: "How long does insulated glass replacement take?",
    a: "Most IGU replacements take 1–2 hours per window once the new glass arrives. We measure your windows during an initial visit, order custom-cut insulated glass units, and return to install them — typically within 3–7 business days. For common standard sizes, we may have glass in stock for same-day service."
  },
  {
    q: "Is replacing the glass cheaper than replacing the whole window?",
    a: "Yes — significantly. Replacing just the insulated glass unit can cost 60–80% less than full window replacement. A typical IGU replacement runs $150–$400, while a full window replacement (frame, glass, installation) often costs $500–$1,500 per window. As long as your frames are structurally sound, glass-only replacement is almost always the smarter choice."
  },
  {
    q: "Does new glass improve energy efficiency?",
    a: "Absolutely. When we replace your foggy IGU, we install new double or triple pane glass filled with argon gas and optionally upgraded to Low-E glass coating. Low-E glass reflects heat and UV rays, reducing your heating and cooling costs. Many homeowners notice measurable improvement in their energy bills after replacing failed foggy windows with new insulated glass units."
  },
];

const SHOWER_SERVICES = [
  { key: "frameless-shower", name: "Frameless Shower Doors", desc: "Custom frameless shower door design, fabrication, and installation for Northern Virginia bathrooms." },
  { key: "shower-enclosures", name: "Shower Enclosures", desc: "Semi-frameless and framed shower enclosure installation and repair." },
  { key: "shower-door-repair", name: "Shower Door Repair", desc: "Repair of broken hinges, handles, seals, and tracks on existing shower door systems." },
];

const ALL_SERVICES = [...COMMERCIAL_SERVICES, ...RESIDENTIAL_SERVICES, ...SHOWER_SERVICES];

const BLOG_POSTS = [
  { key: "how-to-choose", title: "How to Choose a Commercial Glass Repair Company in Northern Virginia", date: "May 15, 2025", cat: "Tips" },
  { key: "emergency-boardup-guide", title: "What to Do After Storefront Break-In: Emergency Board-Up Guide", date: "April 28, 2025", cat: "Emergency" },
  { key: "frameless-shower-cost", title: "How Much Does a Frameless Shower Door Cost in Virginia?", date: "April 10, 2025", cat: "Pricing" },
  { key: "storefront-glass-types", title: "Tempered vs Laminated Glass: What's Right for Your Storefront?", date: "March 22, 2025", cat: "Education" },
  { key: "maintain-commercial-doors", title: "5 Ways to Extend the Life of Your Commercial Glass Doors", date: "March 5, 2025", cat: "Maintenance" },
  { key: "nova-glass-laws", title: "Virginia Commercial Building Glass Code: What Business Owners Need to Know", date: "Feb 18, 2025", cat: "Legal" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{overflow-x:hidden;width:100%;max-width:100%;}
  body{font-family:'Barlow',sans-serif;background:#fff;color:#2D3748;}
  a{text-decoration:none;cursor:pointer;color:inherit;}

  /* TOP BAR */
  .topbar{background:#0F4C81;color:#fff;font-size:11px;font-weight:600;display:flex;justify-content:center;align-items:center;padding:5px 16px;text-align:center;gap:12px;flex-wrap:wrap;}
  .topbar span{display:flex;align-items:center;gap:4px;}
  .emergency-bar{background:#C0392B;color:#fff;text-align:center;padding:9px 16px;font-size:13px;font-weight:700;line-height:1.5;}
  .emergency-bar a{color:#FFD700;text-decoration:underline;white-space:nowrap;}

  /* HEADER */
  .header{background:#fff;border-bottom:2px solid #e8ecf0;position:sticky;top:0;z-index:1000;box-shadow:0 2px 12px rgba(0,0,0,0.08);}
  .header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:10px 16px;gap:10px;}
  .logo{display:flex;flex-direction:column;line-height:1.1;cursor:pointer;min-width:0;flex:1;}
  .logo-main{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:#0F4C81;text-transform:uppercase;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
  .logo-sub{font-size:9px;font-weight:700;color:#C0392B;letter-spacing:1px;text-transform:uppercase;}

  /* DESKTOP NAV */
  .nav-desktop{display:flex;align-items:center;gap:2px;}
  .nav-item{font-size:13px;font-weight:600;color:#2D3748;padding:7px 10px;border-radius:4px;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .nav-item:hover,.nav-item.active{background:#0F4C81;color:#fff;}
  .nav-dropdown{position:relative;}
  .nav-dropdown:hover .dropdown-menu{display:block;}
  .dropdown-menu{display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,0.15);min-width:240px;z-index:2000;padding:8px 0;}
  .dropdown-section{padding:6px 16px 2px;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;}
  .dropdown-item{display:block;padding:8px 16px;font-size:13px;color:#333;font-weight:500;cursor:pointer;transition:background 0.15s;}
  .dropdown-item:hover{background:#F0F7FF;color:#0F4C81;}
  .header-phone{text-align:right;flex-shrink:0;}
  .header-phone a{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#0F4C81;display:block;white-space:nowrap;}
  .header-phone span{font-size:10px;color:#666;font-weight:600;}

  /* MOBILE HAMBURGER */
  .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;background:none;border:none;flex-shrink:0;}
  .hamburger span{display:block;width:22px;height:2px;background:#0F4C81;border-radius:2px;}
  .mob-call-btn{display:none;background:#C0392B;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;padding:8px 12px;border-radius:4px;white-space:nowrap;border:none;cursor:pointer;flex-shrink:0;text-decoration:none;}

  /* MOBILE FULL-SCREEN MENU */
  .mob-menu{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#fff;z-index:9999;overflow-y:auto;}
  .mob-menu.open{display:block;}
  .mob-menu-hdr{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#0F4C81;color:#fff;}
  .mob-menu-logo{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;}
  .mob-close{background:none;border:none;color:#fff;font-size:28px;cursor:pointer;line-height:1;padding:0;}
  .mob-cta{background:#C0392B;padding:16px;text-align:center;}
  .mob-cta a{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:#FFD700;display:block;}
  .mob-cta span{font-size:12px;color:rgba(255,255,255,0.8);}
  .mob-sec{padding:14px 16px;}
  .mob-sec-title{font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #eee;}
  .mob-lnk{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f2f2f2;font-size:15px;font-weight:600;color:#222;cursor:pointer;}
  .mob-sub{display:block;padding:9px 10px;font-size:13px;color:#444;cursor:pointer;border-bottom:1px solid #f8f8f8;}
  .mob-sub:hover{background:#f0f7ff;color:#0F4C81;}
  .mob-divider{height:7px;background:#f5f5f5;}

  /* STICKY CALL BAR - mobile only */
  .sticky-call{display:none;position:fixed;bottom:0;left:0;right:0;z-index:998;background:#0F4C81;color:#fff;text-align:center;padding:13px 16px;font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:900;box-shadow:0 -3px 16px rgba(0,0,0,0.25);}
  .sticky-call a{color:#FFD700;}

  /* HERO */
  .hero{background:linear-gradient(135deg,#0F4C81 0%,#1a3a5c 60%,#0a2a45 100%);color:#fff;padding:70px 20px;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:0;right:0;width:40%;height:100%;background:rgba(255,255,255,0.03);clip-path:polygon(20% 0,100% 0,100% 100%,0% 100%);}
  .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.4);color:#FFD700;font-size:11px;font-weight:700;letter-spacing:1.5px;padding:6px 14px;border-radius:20px;margin-bottom:20px;text-transform:uppercase;}
  .hero h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(36px,6vw,64px);font-weight:900;line-height:1.05;text-transform:uppercase;margin-bottom:20px;}
  .hero h1 span{color:#FFD700;}
  .hero p{font-size:16px;line-height:1.7;color:rgba(255,255,255,0.85);max-width:580px;margin-bottom:30px;}
  .hero-btns{display:flex;gap:14px;flex-wrap:wrap;}
  .btn-primary{background:#FFD700;color:#0F4C81;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;text-transform:uppercase;padding:14px 28px;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;border:none;transition:all 0.2s;}
  .btn-primary:hover{background:#FFC200;transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,215,0,0.4);}
  .btn-secondary{background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.5);font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;padding:12px 26px;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;}
  .btn-secondary:hover{border-color:#fff;background:rgba(255,255,255,0.1);}
  .hero-stats{display:flex;gap:30px;margin-top:40px;padding-top:30px;border-top:1px solid rgba(255,255,255,0.15);flex-wrap:wrap;}
  .hero-stat{display:flex;flex-direction:column;}
  .hero-stat strong{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#FFD700;line-height:1;}
  .hero-stat span{font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;margin-top:2px;}

  /* TRUST BAR */
  .trust-bar{background:#1a2332;color:#fff;padding:16px 20px;}
  .trust-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-around;align-items:center;flex-wrap:wrap;gap:12px;}
  .trust-item{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;}
  .trust-item span:first-child{font-size:18px;}

  /* SECTIONS */
  .section{padding:60px 20px;}
  .section-alt{background:#F7F9FC;}
  .container{max-width:1200px;margin:0 auto;}
  .section-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(26px,4vw,38px);font-weight:900;color:#0F4C81;text-transform:uppercase;margin-bottom:8px;}
  .section-sub{font-size:15px;color:#666;margin-bottom:36px;max-width:600px;line-height:1.6;}

  /* SERVICES GRID */
  .services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;}
  .service-card{background:#fff;border:1px solid #e8ecf0;border-radius:8px;padding:24px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;}
  .service-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:#0F4C81;}
  .service-card:hover{box-shadow:0 8px 30px rgba(15,76,129,0.15);transform:translateY(-3px);border-color:#1E88E5;}
  .service-card:hover::before{background:#FFD700;}
  .service-icon{font-size:28px;margin-bottom:12px;}
  .service-card h3{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:#0F4C81;text-transform:uppercase;margin-bottom:8px;}
  .service-card p{font-size:13px;color:#666;line-height:1.6;}
  .service-card-link{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:#1E88E5;margin-top:12px;text-transform:uppercase;letter-spacing:0.5px;}

  /* PHOTO GRID */
  .photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  .photo-grid-hero{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:200px 200px;gap:12px;}
  .photo-box{border-radius:8px;overflow:hidden;position:relative;background:#1E3A5F;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;}
  .photo-box.tall{grid-row:span 2;}
  .photo-box.red-bg{background:#7a1515;}
  .photo-box.green-bg{background:#1a4a2a;}
  .photo-box span{font-size:10px;color:rgba(255,255,255,0.7);text-align:center;padding:8px;line-height:1.3;}
  .photo-box .cam{font-size:32px;opacity:0.5;}

  /* AREAS GRID */
  .areas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;}
  .area-card{background:#fff;border:1px solid #dde4ed;border-radius:6px;padding:14px 16px;cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;gap:3px;}
  .area-card:hover{background:#0F4C81;color:#fff;border-color:#0F4C81;transform:translateY(-1px);}
  .area-card h4{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;}
  .area-card span{font-size:11px;color:#888;}
  .area-card:hover span{color:rgba(255,255,255,0.7);}

  /* BLOG */
  .blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;}
  .blog-card{background:#fff;border:1px solid #e8ecf0;border-radius:8px;overflow:hidden;cursor:pointer;transition:all 0.2s;}
  .blog-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1);transform:translateY(-2px);}
  .blog-img{height:160px;background:#1E3A5F;display:flex;align-items:center;justify-content:center;font-size:40px;}
  .blog-content{padding:20px;}
  .blog-cat{font-size:10px;font-weight:700;color:#1E88E5;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
  .blog-card h3{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:#0F4C81;line-height:1.2;margin-bottom:8px;}
  .blog-date{font-size:11px;color:#999;}

  /* CTA */
  .cta-section{background:linear-gradient(135deg,#0F4C81,#1a3a5c);color:#fff;padding:60px 20px;text-align:center;}
  .cta-section h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:900;text-transform:uppercase;margin-bottom:12px;}
  .cta-section p{color:rgba(255,255,255,0.8);font-size:15px;margin-bottom:28px;}
  .cta-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}

  /* PAGE HERO */
  .page-hero{background:linear-gradient(135deg,#0F4C81,#1a3a5c);color:#fff;padding:50px 20px;}
  .breadcrumb{font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:12px;}
  .breadcrumb span{color:rgba(255,255,255,0.4);margin:0 6px;}
  .page-hero h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,5vw,48px);font-weight:900;text-transform:uppercase;margin-bottom:12px;}
  .page-hero p{color:rgba(255,255,255,0.85);font-size:15px;max-width:600px;line-height:1.6;}

  /* SERVICE PAGE */
  .service-content{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start;}
  .service-body h2{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;color:#0F4C81;text-transform:uppercase;margin:24px 0 10px;}
  .service-body p{font-size:14px;line-height:1.8;color:#444;margin-bottom:16px;}
  .service-body ul{margin:0 0 16px 20px;}
  .service-body li{font-size:14px;line-height:1.8;color:#444;}
  .sidebar{position:sticky;top:80px;}
  .sidebar-card{background:#0F4C81;color:#fff;border-radius:8px;padding:24px;margin-bottom:16px;}
  .sidebar-card h3{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;text-transform:uppercase;margin-bottom:12px;}
  .sidebar-card .ph-big{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:#FFD700;display:block;margin-bottom:4px;}
  .sidebar-list{list-style:none;display:flex;flex-direction:column;gap:6px;}
  .sidebar-list li{font-size:13px;display:flex;align-items:center;gap:6px;}
  .sidebar-list li::before{content:'✓';color:#FFD700;font-weight:700;}
  .cities-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
  .cities-list a{background:rgba(255,255,255,0.15);color:#fff;font-size:11px;padding:4px 10px;border-radius:20px;cursor:pointer;transition:background 0.2s;}
  .cities-list a:hover{background:rgba(255,255,255,0.3);}

  /* CITY PAGE */
  .city-services{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}
  .city-service-item{background:#fff;border:1px solid #e0e8f0;border-radius:6px;padding:16px;cursor:pointer;transition:all 0.2s;}
  .city-service-item:hover{border-color:#0F4C81;background:#F0F7FF;}
  .city-service-item h4{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;color:#0F4C81;text-transform:uppercase;margin-bottom:4px;}
  .city-service-item p{font-size:12px;color:#666;line-height:1.5;}

  /* GALLERY */
  .gallery-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;}
  .gtab{padding:8px 18px;border:2px solid #dde4ed;border-radius:4px;font-size:13px;font-weight:700;cursor:pointer;background:#fff;transition:all 0.2s;}
  .gtab.active,.gtab:hover{background:#0F4C81;color:#fff;border-color:#0F4C81;}
  .gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;}
  .gallery-item{aspect-ratio:4/3;background:#1E3A5F;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;cursor:pointer;transition:all 0.2s;}
  .gallery-item:hover{transform:scale(1.02);box-shadow:0 8px 24px rgba(0,0,0,0.2);}
  .gallery-item span{font-size:10px;color:rgba(255,255,255,0.6);text-align:center;padding:4px 8px;}

  /* CONTACT */
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;}
  .contact-info h3{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#0F4C81;text-transform:uppercase;margin-bottom:16px;}
  .contact-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;}
  .contact-icon{font-size:20px;margin-top:2px;}
  .contact-label{font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;}
  .contact-val{font-size:15px;font-weight:600;color:#333;margin-top:2px;}
  .contact-form{background:#F7F9FC;border-radius:8px;padding:28px;}
  .contact-form h3{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#0F4C81;text-transform:uppercase;margin-bottom:20px;}
  .form-group{margin-bottom:16px;}
  .form-group label{display:block;font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;}
  .form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;border:1px solid #dde4ed;border-radius:4px;font-size:14px;font-family:'Barlow',sans-serif;background:#fff;transition:border 0.2s;}
  .form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#1E88E5;}
  .form-group textarea{height:100px;resize:vertical;}
  .form-submit{width:100%;background:#C0392B;color:#fff;border:none;padding:14px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;text-transform:uppercase;border-radius:4px;cursor:pointer;letter-spacing:0.5px;transition:background 0.2s;}
  .form-submit:hover{background:#a93226;}

  /* FOOTER */
  .footer{background:#1a2332;color:#fff;padding:50px 20px 24px;}
  .footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:32px;margin-bottom:36px;}
  .footer-logo{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#fff;text-transform:uppercase;margin-bottom:12px;}
  .footer-about{font-size:13px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:16px;}
  .footer-phone{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;color:#FFD700;}
  .footer-col h4{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#FFD700;margin-bottom:14px;}
  .footer-col a{display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:7px;cursor:pointer;transition:color 0.2s;}
  .footer-col a:hover{color:#fff;}
  .footer-bot{border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
  .footer-bot span{font-size:11px;color:rgba(255,255,255,0.4);}

  /* EMERGENCY BANNER */
  .emerg-section{background:#C0392B;color:#fff;padding:40px 20px;text-align:center;}
  .emerg-section h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(24px,4vw,38px);font-weight:900;text-transform:uppercase;margin-bottom:8px;}
  .emerg-section p{font-size:14px;color:rgba(255,255,255,0.85);margin-bottom:20px;}

  /* REVIEWS */
  .reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}
  .review-card{background:#fff;border:1px solid #e8ecf0;border-radius:8px;padding:20px;}
  .review-stars{color:#FFD700;font-size:16px;margin-bottom:10px;}
  .review-text{font-size:13px;color:#555;line-height:1.7;margin-bottom:12px;font-style:italic;}
  .review-author{font-size:12px;font-weight:700;color:#333;}
  .review-loc{font-size:11px;color:#888;}

  /* ===== MOBILE ===== */
  @media(max-width:768px){
    .nav-desktop{display:none!important;}
    .header-phone{display:none!important;}
    .topbar{font-size:10px;padding:4px 12px;}
    .hamburger{display:flex!important;}
    .mob-call-btn{display:block!important;}
    .sticky-call{display:block!important;}
    main{padding-bottom:58px;}

    .header-inner{padding:8px 10px;}
    .logo-main{font-size:12px;white-space:normal;line-height:1.2;}
    .logo-sub{font-size:7px;letter-spacing:0.5px;}
    .logo{max-width:calc(100vw - 140px);}

    .hero{padding:28px 14px 36px;}
    .hero h1{font-size:clamp(26px,8vw,40px);}
    .hero p{font-size:13px;}
    .hero-btns{flex-direction:column;gap:10px;}
    .btn-primary,.btn-secondary{width:100%;justify-content:center;font-size:15px;padding:13px 16px;}
    .hero-stats{gap:14px;}
    .hero-stat strong{font-size:22px;}

    .section{padding:32px 14px;}
    .cta-section{padding:36px 14px;}
    .page-hero{padding:30px 14px;}

    .photo-grid-hero{grid-template-columns:1fr 1fr;grid-template-rows:auto;}
    .photo-box.tall{grid-column:span 2;grid-row:span 1;min-height:140px;}
    .photo-box{min-height:110px;}

    .services-grid{grid-template-columns:1fr!important;}
    .areas-grid{grid-template-columns:repeat(2,1fr);}
    .blog-grid{grid-template-columns:1fr!important;}
    .reviews-grid{grid-template-columns:1fr!important;}
    .gallery-grid{grid-template-columns:repeat(2,1fr);}
    .gallery-tabs{gap:4px;}
    .gtab{font-size:11px;padding:6px 10px;}

    .service-content{grid-template-columns:1fr!important;}
    .sidebar{position:static!important;order:2;}
    .service-body{order:1;}

    .contact-grid{grid-template-columns:1fr!important;}
    .contact-form{padding:18px;}

    .city-services{grid-template-columns:1fr!important;}

    .footer-grid{grid-template-columns:1fr 1fr!important;gap:18px;}
    .footer-bot{flex-direction:column;text-align:center;gap:6px;}

    .trust-inner{gap:8px;}
    .trust-item{font-size:11px;}
    .cta-btns{flex-direction:column;align-items:stretch;}
    .cta-btns .btn-primary,.cta-btns .btn-secondary{justify-content:center;}
    .foggy-highlight-grid{grid-template-columns:1fr!important;}
    .foggy-highlight-cols{grid-template-columns:1fr!important;}
    .foggy-city-chips{flex-wrap:wrap;}
    .process-grid{grid-template-columns:1fr!important;}
    .faq-q{font-size:13px!important;}
    .hero::before{display:none;}
  }
  @media(max-width:400px){
    .logo-main{font-size:12px;}
    .footer-grid{grid-template-columns:1fr!important;}
    .areas-grid{grid-template-columns:1fr 1fr;}
  }
`;

function PhotoBox({ label, className = "", style = {}, src = null }) {
  if (src) {
    return (
      <div className={`photo-box ${className}`} style={{ minHeight: 160, padding: 0, overflow: "hidden", ...style }}>
        <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={`photo-box ${className}`} style={{ minHeight: 160, ...style }}>
      <span style={{ fontSize: 32, opacity: 0.5 }}>📷</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: 8, lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

function Header({ setPage, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Link's `to=` prop already performs navigation; nav() just closes the
  // mobile menu on click (kept name/signature so existing call sites work).
  const nav = () => setMenuOpen(false);

  return (
    <>
      <div className="topbar">
        <span>🕐 Mon–Sat: 7am–7pm | Emergency: 24/7</span>
        <span>📍 Serving All of Northern Virginia</span>
      </div>
      <div className="emergency-bar">
        🚨 24/7 Emergency Board-Up — Call Now: <a href={PHONE_HREF}>{PHONE}</a>
      </div>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" onClick={() => nav({ type: "home" })}>
            <span className="logo-main">{COMPANY}</span>
            <span className="logo-sub">{TAGLINE}</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="nav-desktop">
            <Link to="/" className={`nav-item ${currentPage.type === "home" ? "active" : ""}`} onClick={() => nav({ type: "home" })}>Home</Link>
            <div className="nav-dropdown">
              <span className={`nav-item ${currentPage.type === "service" ? "active" : ""}`}>Services ▾</span>
              <div className="dropdown-menu">
                <div className="dropdown-section">Commercial</div>
                {COMMERCIAL_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`} className="dropdown-item" onClick={() => nav({ type: "service", key: s.key })}>🏢 {s.name}</Link>)}
                <div className="dropdown-section">Residential</div>
                {RESIDENTIAL_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`} className="dropdown-item" onClick={() => nav({ type: "service", key: s.key })}>🏠 {s.name}</Link>)}
                <div className="dropdown-section">Shower Doors</div>
                {SHOWER_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`} className="dropdown-item" onClick={() => nav({ type: "service", key: s.key })}>🚿 {s.name}</Link>)}
                <div className="dropdown-section">Foggy Windows</div>
                <Link to="/foggy-window" className="dropdown-item" style={{ fontWeight: 700, color: "#0F4C81" }} onClick={() => nav({ type: "foggy-window" })}>🌫️ Foggy Window / Broken Seal Repair</Link>
              </div>
            </div>
            <div className="nav-dropdown">
              <span className={`nav-item ${currentPage.type === "foggy-window" || currentPage.type === "foggy-city" ? "active" : ""}`} style={{ color: currentPage.type === "foggy-window" || currentPage.type === "foggy-city" ? undefined : "#0F4C81", fontWeight: 700 }}>🌫️ Foggy Windows ▾</span>
              <div className="dropdown-menu" style={{ minWidth: 260 }}>
                <div className="dropdown-section">Foggy Window Services</div>
                <Link to="/foggy-window" className="dropdown-item" style={{ fontWeight: 700, color: "#0F4C81" }} onClick={() => nav({ type: "foggy-window" })}>🌫️ All Foggy Window Repair</Link>
                <Link to="/service/foggy-window-repair" className="dropdown-item" onClick={() => nav({ type: "service", key: "foggy-window-repair" })}>💧 Foggy Window Repair</Link>
                <Link to="/service/broken-seal-repair" className="dropdown-item" onClick={() => nav({ type: "service", key: "broken-seal-repair" })}>🔧 Broken Seal Repair</Link>
                <Link to="/service/igd-replacement" className="dropdown-item" onClick={() => nav({ type: "service", key: "igd-replacement" })}>🪟 IGU Replacement</Link>
                <Link to="/service/double-pane-replacement" className="dropdown-item" onClick={() => nav({ type: "service", key: "double-pane-replacement" })}>⚡ Double Pane Replacement</Link>
                <Link to="/service/low-e-glass" className="dropdown-item" onClick={() => nav({ type: "service", key: "low-e-glass" })}>🌟 Low-E Glass Upgrade</Link>
                <div className="dropdown-section">Foggy Window — By City</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 8px" }}>
                  {FOGGY_CITIES.map(c => <Link key={c.key} to={`/foggy-city/${c.key}`} className="dropdown-item" onClick={() => nav({ type: "foggy-city", key: c.key })}>{c.name}</Link>)}
                </div>
              </div>
            </div>
            <Link to="/gallery" className={`nav-item ${currentPage.type === "gallery" ? "active" : ""}`} onClick={() => nav({ type: "gallery" })}>Gallery</Link>
            <div className="nav-dropdown">
              <span className={`nav-item ${currentPage.type === "city" ? "active" : ""}`}>Areas ▾</span>
              <div className="dropdown-menu" style={{ minWidth: 280 }}>
                <div className="dropdown-section">Service Areas</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 8px" }}>
                  {CITIES.map(c => <Link key={c.key} to={`/city/${c.key}`} className="dropdown-item" onClick={() => nav({ type: "city", key: c.key })}>{c.name}</Link>)}
                </div>
              </div>
            </div>
            <Link to="/blog" className={`nav-item ${currentPage.type === "blog" ? "active" : ""}`} onClick={() => nav({ type: "blog" })}>Blog</Link>
            <Link to="/contact" className={`nav-item ${currentPage.type === "contact" ? "active" : ""}`} onClick={() => nav({ type: "contact" })}>Contact</Link>
          </nav>

          <div className="header-phone">
            <a href={PHONE_HREF}>{PHONE}</a>
            <span>Free Estimates • Fast Response</span>
          </div>

          {/* MOBILE CONTROLS */}
          <a href={PHONE_HREF} className="mob-call-btn">📞 Call Now</a>
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-DOWN MENU */}
      <div className={`mob-menu ${menuOpen ? "open" : ""}`}>
        <div className="mob-menu-hdr">
          <span className="mob-menu-logo">Commercial Glass NoVA</span>
          <button className="mob-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="mob-cta">
          <a href={PHONE_HREF}>{PHONE}</a>
          <span>Free Estimates • 24/7 Emergency</span>
        </div>
        <div className="mob-sec">
          <div className="mob-sec-title">Navigation</div>
          <Link to="/" className="mob-lnk" onClick={() => nav({ type: "home" })}>🏠 Home <span style={{color:"#ccc"}}>›</span></Link>
          <Link to="/gallery" className="mob-lnk" onClick={() => nav({ type: "gallery" })}>📷 Project Gallery <span style={{color:"#ccc"}}>›</span></Link>
          <Link to="/blog" className="mob-lnk" onClick={() => nav({ type: "blog" })}>📰 Blog <span style={{color:"#ccc"}}>›</span></Link>
          <Link to="/contact" className="mob-lnk" onClick={() => nav({ type: "contact" })}>📨 Contact / Free Estimate <span style={{color:"#ccc"}}>›</span></Link>
        </div>
        <div className="mob-divider" />
        <div className="mob-sec">
          <div className="mob-sec-title">Commercial Services</div>
          {COMMERCIAL_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`} className="mob-sub" onClick={() => nav({ type: "service", key: s.key })}>🏢 {s.name}</Link>)}
        </div>
        <div className="mob-divider" />
        <div className="mob-sec">
          <div className="mob-sec-title">Residential &amp; Shower</div>
          {RESIDENTIAL_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`} className="mob-sub" onClick={() => nav({ type: "service", key: s.key })}>🏠 {s.name}</Link>)}
          {SHOWER_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`} className="mob-sub" onClick={() => nav({ type: "service", key: s.key })}>🚿 {s.name}</Link>)}
        </div>
        <div className="mob-divider" />
        <div className="mob-sec">
          <div className="mob-sec-title">🌫️ Foggy Window Repair</div>
          <Link to="/foggy-window" className="mob-sub" style={{ fontWeight: 700, color: "#0F4C81" }} onClick={() => nav({ type: "foggy-window" })}>🌫️ All Foggy Window Services</Link>
          {FOGGY_CITIES.map(c => <Link key={c.key} to={`/foggy-city/${c.key}`} className="mob-sub" onClick={() => nav({ type: "foggy-city", key: c.key })}>📍 {c.name} Foggy Windows</Link>)}
        </div>
        <div className="mob-divider" />
        <div className="mob-sec">
          <div className="mob-sec-title">Service Areas</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {CITIES.map(c => <Link key={c.key} to={`/city/${c.key}`} className="mob-sub" onClick={() => nav({ type: "city", key: c.key })}>📍 {c.name}</Link>)}
          </div>
        </div>
        <div style={{ height: 48 }} />
      </div>

      {/* STICKY CALL BAR - mobile only */}
      <div className="sticky-call">
        <a href={PHONE_HREF}>📞 Tap to Call — Free Estimate: (703) 609-3508</a>
      </div>
    </>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">{COMPANY}</div>
            <p className="footer-about">Northern Virginia's trusted commercial and residential glass repair company. Serving Alexandria, Arlington, Fairfax, and all surrounding areas with fast, professional service.</p>
            <a href={PHONE_HREF} className="footer-phone">{PHONE}</a>
            <p style={{ fontSize: 12, marginTop: 8, color: "rgba(255,255,255,0.5)" }}>📧 info@commercialglassdoorwindowrepairservices.com<br />📍 Serving All of Northern Virginia</p>
          </div>
          <div className="footer-col">
            <h4>Commercial</h4>
            {COMMERCIAL_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`}>{s.name}</Link>)}
          </div>
          <div className="footer-col">
            <h4>Residential</h4>
            {RESIDENTIAL_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`}>{s.name}</Link>)}
            <h4 style={{ marginTop: 16 }}>Shower Doors</h4>
            {SHOWER_SERVICES.map(s => <Link key={s.key} to={`/service/${s.key}`}>{s.name}</Link>)}
          </div>
          <div className="footer-col">
            <h4>Service Areas</h4>
            {CITIES.map(c => <Link key={c.key} to={`/city/${c.key}`}>{c.name}</Link>)}
            <Link to="/gallery" style={{ marginTop: 8, color: "#FFD700" }}>📷 Project Gallery</Link>
            <h4 style={{ marginTop: 14, color: "#FFD700" }}>🌫️ Foggy Windows</h4>
            <Link to="/foggy-window" style={{ color: "#FFD700" }}>Foggy Window Repair</Link>
            {FOGGY_CITIES.slice(0, 8).map(c => <Link key={c.key} to={`/foggy-city/${c.key}`}>{c.name} Foggy Windows</Link>)}
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2025–2026 Commercial Glass Door &amp; Window Repair Services. All rights reserved.</span>
          <span>Northern Virginia Glass Repair Experts | Licensed &amp; Insured</span>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ setPage }) {
  const REVIEWS = [
    { text: "Called at 9pm after our storefront was shattered. They had a board-up crew there within the hour and came back the next morning with the replacement glass. Incredible service.", author: "Michael R.", loc: "Alexandria, VA" },
    { text: "We manage 12 commercial properties in NoVA and these guys are our go-to for all glass repairs. Fast, professional, and fair pricing.", author: "Sandra T.", loc: "Fairfax, VA" },
    { text: "Our Target store had a door that wouldn't close properly. They diagnosed it as a failed closer and had a new LCN unit installed same day. Great work.", author: "James K.", loc: "Arlington, VA" },
    { text: "Beautiful frameless shower doors installed perfectly. Very clean, professional crew. Would 100% recommend.", author: "Patricia L.", loc: "McLean, VA" },
    { text: "Fast response for an emergency board-up after a break-in. They secured the property, kept it weathertight overnight, and replaced the glass the next day.", author: "David M.", loc: "Reston, VA" },
    { text: "Got 3 quotes for our storefront glass replacement. These guys were the most competitive AND fastest response time. Very happy.", author: "Karen W.", loc: "Herndon, VA" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">⭐ Northern Virginia's #1 Glass Repair Company</div>
          <h1>Commercial Glass Door &amp; <span>Window Repair</span> Services</h1>
          <p>Fast, professional glass repair for commercial storefronts, residential windows, and custom frameless shower doors throughout Northern Virginia. Same-day service available.</p>
          <div className="hero-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 Call (703) 609-3508</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Get Free Estimate →</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>24/7</strong><span>Emergency Service</span></div>
            <div className="hero-stat"><strong>17+</strong><span>Cities Served</span></div>
            <div className="hero-stat"><strong>1,200+</strong><span>Jobs Completed</span></div>
            <div className="hero-stat"><strong>Same Day</strong><span>Service Available</span></div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-inner">
          <div className="trust-item"><span>✅</span><span>Licensed &amp; Insured</span></div>
          <div className="trust-item"><span>⚡</span><span>Same-Day Service</span></div>
          <div className="trust-item"><span>🔧</span><span>All Commercial Brands</span></div>
          <div className="trust-item"><span>📍</span><span>Northern Virginia Local</span></div>
          <div className="trust-item"><span>🆓</span><span>Free Estimates</span></div>
        </div>
      </div>

      {/* PHOTO GRID */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">Real Jobs. Real Results.</div>
          <div className="section-sub">Photos from our actual projects across Northern Virginia — storefronts, commercial doors, residential windows, and more.</div>
          <div className="photo-grid-hero">
            <PhotoBox label="Completed storefront glass wall installation" className="tall" style={{ minHeight: "100%" }} src={P.hero1} />
            <PhotoBox label="Full-height commercial glass wall exterior view" src={P.hero2} />
            <PhotoBox label="Emergency board-up — shattered storefront" className="red-bg" src={P.em1} />
            <PhotoBox label="Stainless steel commercial door" src={P.sf8} />
            <PhotoBox label="Technician installing glass at Target" src={P.act1} />
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="btn-primary" onClick={() => setPage({ type: "gallery" })} style={{ background: "#0F4C81", color: "#fff" }}>📷 View Full Gallery</button>
          </div>
        </div>
      </section>

      {/* COMMERCIAL SERVICES */}
      <section className="section">
        <div className="container">
          <div className="section-title">Commercial Glass Services</div>
          <div className="section-sub">We serve retail stores, office buildings, restaurants, hotels, and commercial properties of all sizes across Northern Virginia.</div>
          <div className="services-grid">
            {COMMERCIAL_SERVICES.map(s => (
              <div key={s.key} className="service-card" onClick={() => setPage({ type: "service", key: s.key })}>
                <div className="service-icon">🏢</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="service-card-link">Learn More →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESIDENTIAL & SHOWER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">Residential &amp; Shower Door Services</div>
          <div className="section-sub">From broken window panes to custom frameless shower doors, we handle all residential glass needs in Northern Virginia.</div>
          <div className="services-grid">
            {[...RESIDENTIAL_SERVICES, ...SHOWER_SERVICES].map(s => (
              <div key={s.key} className="service-card" onClick={() => setPage({ type: "service", key: s.key })}>
                <div className="service-icon">{["frameless-shower","shower-enclosures","shower-door-repair"].includes(s.key) ? "🚿" : "🏠"}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="service-card-link">Learn More →</span>
              </div>
            ))}
          </div>

          {/* SHOWER DOOR PHOTO SHOWCASE */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "2px solid #e0e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="section-title" style={{ marginBottom: 4 }}>🚿 Custom Shower Door Gallery</div>
                <p style={{ fontSize: 14, color: "#666" }}>Recent shower door installations by our team across Northern Virginia</p>
              </div>
              <button onClick={() => setPage({ type: "gallery" })} className="btn-primary" style={{ background: "#0F4C81", color: "#fff", fontSize: 13, padding: "10px 20px" }}>View All Projects</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {[
                { src: P.sh_hero1, alt: "Custom frameless shower — marble tile" },
                { src: P.sh_hero2, alt: "Frameless door — gold hardware" },
                { src: P.sh_encl1, alt: "Corner shower — rain showerhead" },
                { src: P.sh_repair1, alt: "Frameless door — Carrara marble" },
                { src: P.sh_gal1, alt: "Sliding door — modern bathroom" },
                { src: P.sh_encl2, alt: "Frameless corner — subway tile" },
              ].map((photo, i) => (
                <div key={i} onClick={() => setPage({ type: "gallery" })}
                  style={{ aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.1)"; }}>
                  <img src={photo.src} alt={photo.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY */}
      <div className="emerg-section">
        <div className="container">
          <h2>🚨 24/7 Emergency Glass Board-Up Service</h2>
          <p>Broken storefront glass? Vandalism? Accident? We respond fast — any hour, any day across Northern Virginia.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 Call Now: {PHONE}</a>
          </div>
        </div>
      </div>

      {/* FOGGY WINDOW HIGHLIGHT */}
      <section className="section" style={{ background: "#EBF5FB", borderTop: "4px solid #1E88E5" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1E88E5", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "1px", padding: "4px 12px", borderRadius: 20, marginBottom: 12, textTransform: "uppercase" }}>🌫️ Residential Service</div>
              <div className="section-title">Foggy Window Repair &amp; Broken Seal Replacement</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", marginBottom: 16 }}>
                Seeing fog, haze, or condensation <strong>between your window panes</strong>? That's a failed window seal — and you probably don't need to replace the whole window.
              </p>
              <div style={{ background: "#FFD700", borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 17, fontWeight: 900, color: "#0F4C81", textTransform: "uppercase", marginBottom: 4 }}>💰 Save Hundreds — IGU Replacement Only</div>
                <p style={{ fontSize: 13, color: "#0F4C81", lineHeight: 1.6, fontWeight: 600 }}>Most foggy windows do NOT need full window replacement. In many cases we can replace only the insulated glass unit, saving homeowners hundreds or even thousands of dollars.</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => setPage({ type: "foggy-window" })} style={{ background: "#0F4C81", color: "#fff" }}>🌫️ Learn About Foggy Window Repair</button>
                <a href={PHONE_HREF} className="btn-primary">📞 {PHONE}</a>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "🌫️", label: "Foggy Window Repair" },
                { icon: "🔧", label: "Broken Seal Repair" },
                { icon: "💧", label: "Condensation Between Panes" },
                { icon: "🪟", label: "Double Pane Replacement" },
                { icon: "🏠", label: "Triple Pane IGU" },
                { icon: "⚡", label: "Low-E Glass Upgrade" },
                { icon: "🔍", label: "All Window Brands" },
                { icon: "📍", label: "17 Cities Served" },
              ].map(item => (
                <div key={item.label} onClick={() => setPage({ type: "foggy-window" })} style={{ background: "#fff", border: "1px solid #c5dff8", borderRadius: 8, padding: "14px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F4C81" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* CITY LINKS */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #c5dff8" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Foggy Window Repair — All Service Areas:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FOGGY_CITIES.map(c => (
                <span key={c.key} onClick={() => setPage({ type: "foggy-city", key: c.key })} style={{ background: "#fff", border: "1px solid #1E88E5", color: "#0F4C81", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="section">
        <div className="container">
          <div className="section-title">Service Areas in Northern Virginia</div>
          <div className="section-sub">We proudly serve businesses and homeowners across Northern Virginia. Click your city for local service information.</div>
          <div className="areas-grid">
            {CITIES.map(c => (
              <div key={c.key} className="area-card" onClick={() => setPage({ type: "city", key: c.key })}>
                <h4>{c.name}</h4>
                <span>{c.county}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">What Our Customers Say</div>
          <div className="section-sub">Real reviews from real customers across Northern Virginia.</div>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">{r.author}</div>
                <div className="review-loc">{r.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-title">Glass Repair Tips &amp; Resources</div>
          <div className="section-sub">Helpful guides for Northern Virginia business owners and homeowners.</div>
          <div className="blog-grid">
            {BLOG_POSTS.slice(0, 3).map(p => (
              <div key={p.key} className="blog-card" onClick={() => setPage({ type: "blog" })}>
                <div className="blog-img" style={{padding:0,overflow:"hidden",height:200}}>
                  <img src={
                    p.key === 'how-to-choose' ? P.sf1 :
                    p.key === 'emergency-boardup-guide' ? P.em1 :
                    p.key === 'frameless-shower-cost' ? P.sh_hero1 :
                    p.key === 'storefront-glass-types' ? P.sf3 :
                    p.key === 'maintain-commercial-doors' ? P.dr1 :
                    p.key === 'nova-glass-laws' ? P.sf8 : P.hero1
                  } alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                </div>
                <div className="blog-content">
                  <div className="blog-cat">{p.cat}</div>
                  <h3>{p.title}</h3>
                  <div className="blog-date">{p.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button className="btn-primary" onClick={() => setPage({ type: "blog" })} style={{ background: "#0F4C81", color: "#fff" }}>View All Articles</button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Call now or request a free estimate. We serve all of Northern Virginia with fast, professional glass repair.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 {PHONE}</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Request Free Estimate</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ServicePage({ svc, setPage }) {
  const otherServices = ALL_SERVICES.filter(s => s.key !== svc.key).slice(0, 5);
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setPage({ type: "home" })} style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>Home</span>
            <span>›</span> Services <span>›</span> {svc.name}
          </div>
          <h1>{svc.name} in Northern Virginia</h1>
          <p>Professional {svc.name.toLowerCase()} serving Alexandria, Arlington, Fairfax, McLean, and all of Northern Virginia. Licensed, insured, and fast.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="service-content">
            <div className="service-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                <PhotoBox label={`${svc.name} — job photo 1`} style={{ minHeight: 200, borderRadius: 8 }}
                  src={svc.key === "frameless-shower" ? P.sh_hero1 : svc.key === "shower-enclosures" ? P.sh_encl1 : svc.key === "shower-door-repair" ? P.sh_repair1 : P.sf1} />
                <PhotoBox label={`${svc.name} — job photo 2`} style={{ minHeight: 200, borderRadius: 8 }}
                  src={svc.key === "frameless-shower" ? P.sh_hero2 : svc.key === "shower-enclosures" ? P.sh_encl2 : svc.key === "shower-door-repair" ? P.sh_repair2 : P.sf2} />
                {(svc.key === "frameless-shower" || svc.key === "shower-enclosures" || svc.key === "shower-door-repair") && (
                  <>
                    <PhotoBox label={`${svc.name} — job photo 3`} style={{ minHeight: 200, borderRadius: 8 }}
                      src={svc.key === "frameless-shower" ? P.sh_hero3 : svc.key === "shower-enclosures" ? P.sh_encl3 : P.sh_repair3} />
                    <PhotoBox label={`${svc.name} — job photo 4`} style={{ minHeight: 200, borderRadius: 8 }}
                      src={svc.key === "frameless-shower" ? P.sh_gal1 : svc.key === "shower-enclosures" ? P.sh_gal2 : P.sh_gal3} />
                    <PhotoBox label={`${svc.name} — job photo 5`} style={{ minHeight: 200, borderRadius: 8 }}
                      src={svc.key === "frameless-shower" ? P.sh_gal1 : svc.key === "shower-enclosures" ? P.sh_gal2 : P.sh_gal3} />
                  </>
                )}
              </div>

              <h2>About Our {svc.name} Service</h2>
              <p>{svc.desc} Our licensed technicians serve homeowners and businesses in Alexandria, Arlington, Fairfax, McLean, Reston, Herndon, Ashburn, and all surrounding communities throughout Northern Virginia.</p>
              <p>When you call us for {svc.name.toLowerCase()}, you can expect a fast response, honest pricing, and high-quality workmanship backed by our satisfaction guarantee. We use only premium materials from trusted manufacturers.</p>

              <h2>Why Choose Us?</h2>
              <ul>
                <li>Same-day service available for most requests</li>
                <li>Licensed and fully insured technicians</li>
                <li>Free estimates — no surprise charges</li>
                <li>All commercial and residential brands serviced</li>
                <li>24/7 emergency service for urgent repairs</li>
                <li>Serving all of Northern Virginia</li>
              </ul>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, margin: "24px 0" }}>
                {[1, 2, 3, 4].map(i => (
                  <PhotoBox key={i} label={`Project photo ${i}`} style={{ minHeight: 120, borderRadius: 6 }} src={[P.act1, P.dr1, P.sf3, P.em2][i-1] || P.sf4} />
                ))}
              </div>

              <h2>Service Areas</h2>
              <p>We provide {svc.name.toLowerCase()} throughout Northern Virginia, including:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {CITIES.map(c => (
                  <span key={c.key} onClick={() => setPage({ type: "city", key: c.key })} style={{ background: "#F0F7FF", color: "#0F4C81", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid #c5dff8" }}>{c.name}</span>
                ))}
              </div>

              <h2>Related Services</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {otherServices.map(s => (
                  <div key={s.key} onClick={() => setPage({ type: "service", key: s.key })} style={{ padding: "12px 16px", border: "1px solid #e0e8f0", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#0F4C81", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {s.name} <span style={{ color: "#1E88E5" }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar">
              <div className="sidebar-card">
                <h3>Get a Free Estimate</h3>
                <a href={PHONE_HREF} className="ph-big">{PHONE}</a>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Free Estimates • Fast Response • Same-Day Available</p>
                <ul className="sidebar-list">
                  <li>Licensed &amp; Insured</li>
                  <li>No Hidden Fees</li>
                  <li>All Brands Serviced</li>
                  <li>24/7 Emergency Line</li>
                  <li>Serving All of NoVA</li>
                </ul>
              </div>
              <div className="sidebar-card" style={{ background: "#1a2332" }}>
                <h3>Service Areas</h3>
                <div className="cities-list">
                  {CITIES.map(c => <a key={c.key} onClick={() => setPage({ type: "city", key: c.key })}>{c.name}</a>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="cta-section">
        <div className="container">
          <h2>Need {svc.name}?</h2>
          <p>Call now for a fast, free estimate. We serve all of Northern Virginia.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 {PHONE}</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Request Estimate</button>
          </div>
        </div>
      </div>
    </>
  );
}

function CityPage({ city, setPage }) {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setPage({ type: "home" })} style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>Home</span>
            <span>›</span> Service Areas <span>›</span> {city.name}
          </div>
          <h1>Commercial Glass Services in {city.name}</h1>
          <p>Businesses in {city.name} depend on clean, secure storefront glass to attract customers and protect their assets. We provide fast, professional glass repair and installation throughout {city.name} and {city.county}.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="service-content">
            <div className="service-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
                {[1, 2, 3, 4].map(i => (
                  <PhotoBox key={i} label={`${city.name} job photo ${i}`} style={{ minHeight: 130, borderRadius: 6 }} src={[P.sf4, P.act2, P.dr2, P.res1][i-1] || P.sf5} />
                ))}
              </div>

              <h2>Commercial Glass Services in {city.name}</h2>
              <p>Businesses in {city.name} depend on clean, secure storefront glass to attract customers and protect their assets. Our commercial glass services in {city.name} include everything from emergency board-up to full storefront installation.</p>

              <div className="city-services">
                {COMMERCIAL_SERVICES.map(s => (
                  <div key={s.key} className="city-service-item" onClick={() => setPage({ type: "service", key: s.key })}>
                    <h4>{s.name}</h4>
                    <p>Professional service for {city.name} businesses</p>
                  </div>
                ))}
              </div>

              <h2 style={{ marginTop: 32 }}>Residential Glass in {city.name}</h2>
              <p>We also serve homeowners in {city.name} with window glass repair, replacement, and custom frameless shower doors.</p>
              <div className="city-services">
                {[...RESIDENTIAL_SERVICES, ...SHOWER_SERVICES].map(s => (
                  <div key={s.key} className="city-service-item" onClick={() => setPage({ type: "service", key: s.key })}>
                    <h4>{s.name}</h4>
                    <p>Residential service in {city.name}</p>
                  </div>
                ))}
              </div>

              <h2 style={{ marginTop: 32 }}>Why {city.name} Businesses Choose Us</h2>
              <ul>
                <li>Fastest response time in {city.county}</li>
                <li>Same-day commercial glass repair available</li>
                <li>24/7 emergency board-up for {city.name} businesses</li>
                <li>Licensed, insured, and locally operated</li>
                <li>Free estimates with no obligation</li>
                <li>Hundreds of completed jobs in {city.name} and surrounding area</li>
              </ul>

              <h2 style={{ marginTop: 32 }}>Other Service Areas Near {city.name}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {CITIES.filter(c => c.key !== city.key).map(c => (
                  <span key={c.key} onClick={() => setPage({ type: "city", key: c.key })} style={{ background: "#F0F7FF", color: "#0F4C81", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid #c5dff8" }}>{c.name}</span>
                ))}
              </div>
            </div>

            <div className="sidebar">
              <div className="sidebar-card">
                <h3>Serving {city.name}</h3>
                <a href={PHONE_HREF} className="ph-big">{PHONE}</a>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Free Estimates • Same-Day Available</p>
                <ul className="sidebar-list">
                  <li>Licensed &amp; Insured</li>
                  <li>Emergency 24/7</li>
                  <li>Free Estimates</li>
                  <li>All Brands</li>
                </ul>
              </div>
              <div className="sidebar-card" style={{ background: "#1a2332" }}>
                <h3>All Service Areas</h3>
                <div className="cities-list">
                  {CITIES.map(c => <a key={c.key} onClick={() => setPage({ type: "city", key: c.key })} style={{ background: city.key === c.key ? "rgba(255,215,0,0.3)" : undefined }}>{c.name}</a>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="container">
          <h2>Glass Repair in {city.name}?</h2>
          <p>Call now for a free estimate. We're your local glass repair experts in {city.name}, {city.county}.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 {PHONE}</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Get Free Estimate</button>
          </div>
        </div>
      </div>
    </>
  );
}

const GAL_TABS = [
  { k: "all",        l: "All Projects" },
  { k: "storefront", l: "Storefronts" },
  { k: "emergency",  l: "Emergency Board-Up" },
  { k: "doors",      l: "Commercial Doors" },
  { k: "residential",l: "Residential" },
  { k: "shower",     l: "🚿 Shower Doors" },
  { k: "action",     l: "Team at Work" },
];

// Map each tab to real P keys
const GAL_PHOTO_MAP = {
  storefront: ["hero1","hero2","hero3","sf1","sf2","sf3","sf5","sf6","sf7","sf9","sf10"],
  emergency:  ["em1","em2","em3","em4","em5","em6","em7","em8"],
  doors:      ["sf8","dr1","dr2","dr3","dr4","dr5","dr6","dr7","dr8"],
  residential:["res1","res2","res3","res4","res5","res6","res7","res8","res9","res10","res11","res12"],
  shower:     ["sh_hero1","sh_hero2","sh_hero3","sh_encl1","sh_encl2","sh_encl3","sh_repair1","sh_repair2","sh_repair3","sh_gal1","sh_gal2","sh_gal3"],
  action:     ["act1","act2","act3","act4","act5","act6","act7","act8"],
};
GAL_PHOTO_MAP.all = [
  ...GAL_PHOTO_MAP.storefront,
  ...GAL_PHOTO_MAP.emergency,
  ...GAL_PHOTO_MAP.doors,
  ...GAL_PHOTO_MAP.residential,
  ...GAL_PHOTO_MAP.shower,
  ...GAL_PHOTO_MAP.action,
];

const GAL_ALT = {
  hero1:"Completed full-height commercial glass wall installation",
  hero2:"Commercial glass wall exterior with service van",
  hero3:"Suite R8 commercial door repair completed",
  sf1:"Alo Yoga luxury retail storefront doors",
  sf2:"Solidcore storefront glass completed",
  sf3:"Aritzia double glass doors",
  sf5:"Solidcore sliding glass door",
  sf6:"H&M storefront glass wall",
  sf7:"Bluemercury storefront glass",
  sf8:"Stainless steel commercial door",
  sf9:"Dunkin Donuts door completed",
  sf10:"Solidcore storefront doors",
  em1:"Emergency board-up at Coffee & More",
  em2:"Retail store board-up service",
  em3:"Commercial board-up — door secured",
  em4:"Board-up from inside view",
  em5:"Board-up exterior completed",
  em6:"Retail store board-up — night job",
  em7:"Window board-up service",
  em8:"Storefront board-up service",
  dr1:"Solidcore door installation in progress",
  dr2:"Commercial door work at retail location",
  dr3:"Hollister storefront door service",
  dr4:"Solidcore commercial door",
  dr5:"Panda Express storefront",
  dr6:"Dunkin door service",
  dr7:"Storefront door installation",
  dr8:"Door frame assembly",
  res1:"Arch window replacement — exterior",
  res2:"Arch window with crystal chandelier — completed",
  res3:"Arch transom window — interior",
  res4:"Residential window glass replacement",
  res5:"Sliding glass door — exterior",
  res6:"Sliding glass door — interior",
  res7:"Sliding door replacement completed",
  res8:"Sliding glass door repair",
  res9:"Residential window — clean install",
  res10:"Window glass replacement completed",
  res11:"Interior sliding door view",
  res12:"Interior window replacement",
  act1:"Technician installing glass at Target",
  act2:"Target window installation — wide shot",
  act3:"Full-height glass wall with scaffolding",
  act4:"Work van on site — glass wall project",
  act5:"Technician on scaffold — residential window wall",
  act6:"Solidcore door installation work",
  act7:"Measuring glass — precision work",
  act8:"Door hardware installation detail",
};

function GalleryPage() {
  const [tab, setTab] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const keys = (GAL_PHOTO_MAP[tab] || GAL_PHOTO_MAP.all).filter(k => P[k]);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Project Gallery</h1>
          <p>Real work from real Northern Virginia projects — commercial glass, storefronts, emergency board-up, residential windows, and more. Click any photo to enlarge.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* TABS */}
          <div className="gallery-tabs">
            {GAL_TABS.map(t => (
              <button key={t.k} className={`gtab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>
                {t.l}
              </button>
            ))}
          </div>

          <p style={{ marginBottom: 20, fontSize: 13, color: "#666", fontWeight: 600 }}>
            📷 {keys.length} real project photos — Northern Virginia glass repair
          </p>

          {/* PHOTO GRID */}
          <div className="gallery-grid">
            {keys.map((key, i) => (
              <div
                key={key}
                onClick={() => setLightbox(key)}
                style={{
                  aspectRatio: "4/3",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)"; }}
              >
                <img
                  src={P[key]}
                  alt={GAL_ALT[key] || "Glass repair project Northern Virginia"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "20px 10px 8px", color: "#fff", fontSize: 11, fontWeight: 600 }}>
                  {GAL_ALT[key] || "Glass repair project"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "#fff", fontSize: 36, cursor: "pointer", lineHeight: 1 }}>✕</button>
          <img
            src={P[lightbox]}
            alt={GAL_ALT[lightbox]}
            style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}
            onClick={e => e.stopPropagation()}
          />
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>
            {GAL_ALT[lightbox]} · Tap outside to close
          </div>
        </div>
      )}

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Project?</h2>
          <p>Call now for a free estimate. We serve all of Northern Virginia.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 {PHONE}</a>
          </div>
        </div>
      </div>
    </>
  );
}

function BlogPage({ setPage }) {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Glass Repair Tips &amp; Resources</h1>
          <p>Helpful guides for Northern Virginia business owners and homeowners about commercial glass, storefront repair, and residential windows.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {BLOG_POSTS.map(p => (
              <div key={p.key} className="blog-card">
                <div className="blog-img" style={{padding:0,overflow:"hidden",height:200}}>
                  <img src={
                    p.key === 'how-to-choose' ? P.sf1 :
                    p.key === 'emergency-boardup-guide' ? P.em1 :
                    p.key === 'frameless-shower-cost' ? P.sh_hero1 :
                    p.key === 'storefront-glass-types' ? P.sf3 :
                    p.key === 'maintain-commercial-doors' ? P.dr1 :
                    p.key === 'nova-glass-laws' ? P.sf8 : P.hero1
                  } alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                </div>
                <div className="blog-content">
                  <div className="blog-cat">{p.cat}</div>
                  <h3>{p.title}</h3>
                  <div className="blog-date">{p.date}</div>
                  <p style={{ fontSize: 12, color: "#666", marginTop: 8, lineHeight: 1.6 }}>Read our expert guide on this topic for Northern Virginia business owners and homeowners.</p>
                  <span style={{ display: "inline-block", marginTop: 12, fontSize: 12, fontWeight: 700, color: "#1E88E5" }}>Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "", city: "", message: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mojzknjv", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus("success"); setFormData({ name: "", phone: "", email: "", service: "", city: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div style={{ background: "#e8f5e9", border: "2px solid #2e7d32", borderRadius: 10, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <div style={{ fontFamily: "Barlow Condensed", fontSize: 24, fontWeight: 800, color: "#2e7d32", marginBottom: 8 }}>Request Sent!</div>
        <p style={{ color: "#333", marginBottom: 16 }}>Thank you! We typically respond within 1 hour during business hours.</p>
        <p style={{ color: "#555", fontSize: 14 }}>For immediate help call <a href="tel:7036093508" style={{ color: "#0F4C81", fontWeight: 700 }}>(703) 609-3508</a></p>
        <button style={{ marginTop: 16, background: "#0F4C81", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", cursor: "pointer", fontWeight: 700 }} onClick={() => setStatus("idle")}>Send Another Request</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group"><label>Your Name *</label><input type="text" name="name" required placeholder="John Smith" value={formData.name} onChange={handleChange} /></div>
      <div className="form-group"><label>Phone Number *</label><input type="tel" name="phone" required placeholder="(703) 555-0000" value={formData.phone} onChange={handleChange} /></div>
      <div className="form-group"><label>Email Address</label><input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} /></div>
      <div className="form-group"><label>Service Needed</label><select name="service" value={formData.service} onChange={handleChange}><option value="">Select a service...</option>{ALL_SERVICES.map(s => <option key={s.key} value={s.name}>{s.name}</option>)}</select></div>
      <div className="form-group"><label>City / Location</label><select name="city" value={formData.city} onChange={handleChange}><option value="">Select your city...</option>{CITIES.map(c => <option key={c.key} value={c.name}>{c.name}</option>)}</select></div>
      <div className="form-group"><label>Describe the Issue *</label><textarea name="message" required placeholder="Please describe what needs to be repaired or replaced..." value={formData.message} onChange={handleChange} /></div>
      {status === "error" && (<div style={{ background: "#ffebee", border: "1px solid #c62828", borderRadius: 6, padding: "10px 14px", marginBottom: 12, color: "#c62828", fontSize: 14 }}>Something went wrong. Please call us at <a href="tel:7036093508" style={{ color: "#c62828", fontWeight: 700 }}>(703) 609-3508</a> or try again.</div>)}
      <button className="form-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "⏳ Sending..." : "📨 Send My Request"}</button>
      <p style={{ fontSize: 11, color: "#888", marginTop: 10, textAlign: "center" }}>We typically respond within 1 hour. Or call: <a href="tel:7036093508" style={{color:"#0F4C81",fontWeight:700}}>(703) 609-3508</a></p>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Request a free estimate or ask a question. We respond fast — usually within the hour during business hours.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <div className="contact-row">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Phone (Call or Text)</div>
                  <div className="contact-val"><a href={PHONE_HREF} style={{ color: "#0F4C81", fontWeight: 700 }}>{PHONE}</a></div>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-val">info@commercialglassdoorwindowrepairservices.com</div>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-icon">🕐</div>
                <div>
                  <div className="contact-label">Hours</div>
                  <div className="contact-val">Mon–Sat: 7am–7pm<br /><span style={{ color: "#C0392B", fontWeight: 700 }}>Emergency: 24/7</span></div>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Service Area</div>
                  <div className="contact-val">All of Northern Virginia</div>
                </div>
              </div>
              <div style={{ background: "#C0392B", color: "#fff", borderRadius: 8, padding: "20px", marginTop: 24 }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 20, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>🚨 Emergency? Call Now</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 12 }}>For broken storefronts, vandalism, or urgent glass repairs — we respond 24/7.</div>
                <a href={PHONE_HREF} style={{ fontFamily: "Barlow Condensed", fontSize: 26, fontWeight: 900, color: "#FFD700" }}>{PHONE}</a>
              </div>
            </div>
            <div className="contact-form">
              <h3>Request a Free Estimate</h3>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="John Smith" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="(703) 555-0000" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label>Service Needed</label>
                <select>
                  <option>Select a service...</option>
                  {ALL_SERVICES.map(s => <option key={s.key}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>City / Location</label>
                <select>
                  <option>Select your city...</option>
                  {CITIES.map(c => <option key={c.key}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Describe the Issue</label>
                <textarea placeholder="Please describe what needs to be repaired or replaced..." />
              </div>
              <button className="form-submit" onClick={(e) => { e.preventDefault(); alert("Thank you! We will contact you within 1 hour during business hours. For immediate assistance call (703) 609-3508."); }}>📨 Send My Request</button>
              <p style={{ fontSize: 11, color: "#888", marginTop: 10, textAlign: "center" }}>We typically respond within 1 hour during business hours. Or call us directly: <a href="tel:7036093508" style={{color:"#0F4C81",fontWeight:700}}>(703) 609-3508</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FoggyWindowPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const foggyServices = [
    { icon: "🌫️", name: "Foggy Window Repair", desc: "Cloudy or hazy windows from failed seals — we fix it without replacing the whole window." },
    { icon: "🔧", name: "Failed Window Seal Repair", desc: "Broken seal letting moisture in between panes? We replace the insulated glass unit." },
    { icon: "💧", name: "Condensation Between Panes", desc: "Moisture trapped inside your double pane windows — we remove and replace the IGU." },
    { icon: "🪟", name: "Double Pane Glass Replacement", desc: "Replace only the glass unit inside your existing frame. No full window replacement needed." },
    { icon: "🏠", name: "Triple Pane Replacement", desc: "Expert triple pane IGU replacement for maximum energy performance." },
    { icon: "⚡", name: "Low-E Glass Upgrade", desc: "Replace old glass with energy-efficient Low-E glass — lower bills, less UV damage." },
    { icon: "🔍", name: "Insulated Glass Unit (IGU)", desc: "We order custom-cut IGUs to match any window size, shape, or brand." },
  ];
  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#0F4C81,#1a3a5c)", color: "#fff", padding: "48px 16px" }}>
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.4)", color: "#FFD700", fontSize: 11, fontWeight: 700, letterSpacing: "1px", padding: "5px 14px", borderRadius: 20, marginBottom: 16, textTransform: "uppercase" }}>🪟 Northern Virginia Foggy Window Experts</div>
          <h1 style={{ fontFamily: "Barlow Condensed", fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.05, marginBottom: 16 }}>
            Foggy Window Repair &amp; <span style={{ color: "#FFD700" }}>Broken Seal</span> Replacement
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", maxWidth: 620, marginBottom: 20 }}>
            Cloudy, foggy, or hazy windows are caused by a failed window seal — not dirty glass. We replace only the insulated glass unit (IGU), restoring crystal-clear views and energy efficiency without replacing your entire window.
          </p>
          <div style={{ background: "rgba(255,215,0,0.15)", border: "2px solid #FFD700", borderRadius: 8, padding: "16px 20px", marginBottom: 24, maxWidth: 620 }}>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: 20, fontWeight: 900, color: "#FFD700", textTransform: "uppercase", marginBottom: 6 }}>💰 Save Hundreds — Don't Replace the Whole Window</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>Most foggy windows do NOT need full window replacement. In many cases we can replace only the insulated glass unit, saving homeowners hundreds or even thousands of dollars.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={PHONE_HREF} className="btn-primary">📞 Call (703) 609-3508</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Get Free Estimate →</button>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.15)", flexWrap: "wrap" }}>
            {[["IGU-Only", "Replacement"], ["Same-Day", "Service Avail."], ["All Window", "Brands"], ["Free", "Estimates"]].map(([a, b]) => (
              <div key={a} style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontFamily: "Barlow Condensed", fontSize: 26, fontWeight: 900, color: "#FFD700", lineHeight: 1 }}>{a}</strong>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <div className="section-title">What Causes Foggy Windows?</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", marginBottom: 14 }}>Foggy, cloudy, or hazy windows are caused by <strong>failed window seals</strong> — not dirty glass. Modern double and triple pane windows contain an insulated glass unit (IGU) filled with argon gas between two or three panes of glass.</p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", marginBottom: 14 }}>Over time, the seal around the IGU breaks down due to age, temperature cycling, and UV exposure. Once the seal fails, outside air and <strong>moisture infiltrates between the panes</strong>. This trapped moisture creates condensation — that foggy, wet appearance you see inside the glass.</p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", marginBottom: 20 }}>The glass itself is typically undamaged. The frame is fine. Only the insulated glass unit needs to be replaced — and that's exactly what we do throughout Northern Virginia.</p>
              <div style={{ background: "#0F4C81", color: "#fff", borderRadius: 8, padding: "16px 20px" }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 18, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Signs Your Window Seal Has Failed</div>
                {["Foggy or hazy appearance between panes", "Condensation you can't wipe away", "Moisture or water droplets inside glass", "Cloudy film that wasn't there before", "White mineral deposits on interior glass surface", "Visible distortion when looking through the window"].map(s => (
                  <div key={s} style={{ fontSize: 13, marginBottom: 5, display: "flex", gap: 8 }}><span style={{ color: "#FFD700" }}>✓</span>{s}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              <div style={{ background: "#fff", border: "1px solid #e0e8f0", borderRadius: 8, padding: 20, borderLeft: "4px solid #C0392B" }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 16, fontWeight: 800, color: "#C0392B", textTransform: "uppercase", marginBottom: 6 }}>❌ What You Don't Need</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>Full window replacement — frame, sash, everything — which costs $500–$1,500+ per window and requires a contractor.</p>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e0e8f0", borderRadius: 8, padding: 20, borderLeft: "4px solid #27ae60" }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 16, fontWeight: 800, color: "#27ae60", textTransform: "uppercase", marginBottom: 6 }}>✅ What You Do Need</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>Insulated glass unit (IGU) replacement only — we swap out just the glass inside your existing frame. Cost: $150–$400 per window.</p>
              </div>
              <div style={{ background: "#FFD700", borderRadius: 8, padding: 20 }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 16, fontWeight: 800, color: "#0F4C81", textTransform: "uppercase", marginBottom: 6 }}>💰 Average Savings</div>
                <p style={{ fontSize: 13, color: "#0F4C81", lineHeight: 1.6, fontWeight: 600 }}>Homeowners save 60–80% by replacing only the glass unit vs. the full window. On a 10-window home, that's often $5,000–$10,000 saved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">Foggy Window &amp; Residential Glass Services</div>
          <div className="section-sub">We serve homeowners throughout Northern Virginia with fast, affordable foggy window repair and insulated glass replacement.</div>
          <div className="services-grid">
            {foggyServices.map(s => (
              <div key={s.name} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">How Our Foggy Window Repair Process Works</div>
          <div className="section-sub">Simple, fast, and affordable. Most jobs completed in 1–2 visits.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
            {[
              { step: "1", title: "Free Estimate", desc: "We visit your home, assess the failed seals, and give you an honest quote — no obligation." },
              { step: "2", title: "Custom Glass Order", desc: "We measure and order custom-cut insulated glass units to exactly match your windows." },
              { step: "3", title: "Fast Installation", desc: "We return and install your new IGUs. Most windows take 30–60 minutes each." },
              { step: "4", title: "Crystal Clear Results", desc: "Your windows look brand new — clear, fog-free, and energy-efficient." },
            ].map(s => (
              <div key={s.step} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: 8, padding: "28px 24px 24px", position: "relative" }}>
                <div style={{ position: "absolute", top: -14, left: 20, background: "#0F4C81", color: "#FFD700", fontFamily: "Barlow Condensed", fontSize: 22, fontWeight: 900, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.step}</div>
                <h3 style={{ fontFamily: "Barlow Condensed", fontSize: 18, fontWeight: 800, color: "#0F4C81", textTransform: "uppercase", marginBottom: 8, marginTop: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">Residential Glass Repair — Real Projects</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
            {[P.res1, P.res2, P.res3, P.res4, P.res5, P.res6, P.res7, P.res8].filter(Boolean).map((src, i) => (
              <div key={i} style={{ aspectRatio: "4/3", borderRadius: 8, overflow: "hidden" }}>
                <img src={src} alt="Residential window glass repair Northern Virginia" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">Foggy Window FAQ</div>
          <div className="section-sub">Common questions about foggy window repair and insulated glass replacement in Northern Virginia.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 800 }}>
            {FOGGY_FAQS.map((faq, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: 8, overflow: "hidden" }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Barlow Condensed", fontSize: 16, fontWeight: 800, color: "#0F4C81", textTransform: "uppercase" }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 22, color: "#1E88E5", flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#444", lineHeight: 1.8, borderTop: "1px solid #f0f0f0" }}>
                    <p style={{ marginTop: 12 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">Foggy Window Repair — Service Areas</div>
          <div className="section-sub">We serve homeowners throughout Northern Virginia. Click your city for local foggy window repair information.</div>
          <div className="areas-grid">
            {FOGGY_CITIES.map(c => (
              <div key={c.key} className="area-card" onClick={() => setPage({ type: "foggy-city", key: c.key })}>
                <h4>{c.name}</h4>
                <span>{c.county}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="container">
          <h2>Foggy Windows in Northern Virginia?</h2>
          <p>Most foggy windows do NOT need full replacement. Call now for a free estimate.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 (703) 609-3508</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Request Free Estimate</button>
          </div>
        </div>
      </div>
    </>
  );
}

function FoggyCityPage({ city, setPage }) {
  const services = ["Foggy window repair", "Broken window seal replacement", "Condensation between panes fix", "Double pane glass replacement", "Triple pane IGU replacement", "Low-E glass upgrade", "Residential window glass repair", "Insulated glass unit replacement"];
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setPage({ type: "home" })} style={{ cursor: "pointer" }}>Home</span>
            <span>›</span>
            <span onClick={() => setPage({ type: "foggy-window" })} style={{ cursor: "pointer" }}>Foggy Window Repair</span>
            <span>›</span> {city.name}
          </div>
          <h1>Foggy Window Repair in {city.name}, VA</h1>
          <p>Professional foggy window repair and insulated glass unit replacement for homeowners in {city.name}, {city.county}. We fix cloudy, hazy, and moisture-damaged windows without replacing the whole window.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="service-content">
            <div className="service-body">
              <div style={{ background: "#FFD700", borderRadius: 8, padding: "18px 20px", marginBottom: 24 }}>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 18, fontWeight: 900, color: "#0F4C81", textTransform: "uppercase", marginBottom: 6 }}>💰 Save Hundreds in {city.name}</div>
                <p style={{ fontSize: 14, color: "#0F4C81", lineHeight: 1.6, fontWeight: 600 }}>Most foggy windows do NOT need full window replacement. In many cases we can replace only the insulated glass unit, saving {city.name} homeowners hundreds or even thousands of dollars.</p>
              </div>
              <h2>Foggy Window Repair in {city.name}</h2>
              <p>If you're seeing foggy, cloudy, or hazy glass in your {city.name} home, the problem is almost always a <strong>failed window seal</strong> — not dirty glass. Homeowners across {city.name} and {city.county} call us when they notice condensation or moisture trapped between their window panes.</p>
              <p>The good news: in most cases, you don't need to replace the entire window. We replace only the <strong>insulated glass unit (IGU)</strong> inside your existing frame — saving {city.name} homeowners 60–80% compared to full window replacement.</p>
              <h2>Foggy Window Services in {city.name}</h2>
              <div className="city-services">
                {services.map(s => (
                  <div key={s} className="city-service-item">
                    <h4>{s}</h4>
                    <p>Professional service for {city.name} homeowners</p>
                  </div>
                ))}
              </div>
              <h2 style={{ marginTop: 28 }}>What Causes Foggy Windows in {city.name} Homes?</h2>
              <p>The Northern Virginia climate — with its hot humid summers and cold winters — puts significant stress on window seals. The repeated expansion and contraction of window frames causes seals to break down over time. Once the hermetic seal of your insulated glass unit fails, outside humid air enters between the panes and creates that characteristic foggy, cloudy appearance.</p>
              <p>This is 100% a <strong>broken window seal</strong> issue. The condensation you see cannot be cleaned away because it's <em>inside</em> the sealed unit. The only fix is insulated glass unit replacement — and that's our specialty in {city.name}.</p>
              <h2 style={{ marginTop: 28 }}>Why {city.name} Homeowners Choose Us</h2>
              <ul>
                <li>We replace only the IGU — not the whole window — saving you money</li>
                <li>Same-day service available for {city.name} and {city.county}</li>
                <li>All window brands — Andersen, Pella, Marvin, Milgard, and more</li>
                <li>Free estimates with honest, upfront pricing</li>
                <li>Licensed and insured technicians</li>
                <li>Low-E and energy-efficient glass upgrade options</li>
              </ul>
              <h2 style={{ marginTop: 28 }}>Other Areas Near {city.name}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                {FOGGY_CITIES.filter(c => c.key !== city.key).map(c => (
                  <span key={c.key} onClick={() => setPage({ type: "foggy-city", key: c.key })} style={{ background: "#F0F7FF", color: "#0F4C81", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid #c5dff8" }}>{c.name}</span>
                ))}
              </div>
            </div>
            <div className="sidebar">
              <div className="sidebar-card">
                <h3>Free Estimate in {city.name}</h3>
                <a href={PHONE_HREF} className="ph-big">{PHONE}</a>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>Most foggy windows fixed without full replacement. Free estimates, same-day available.</p>
                <ul className="sidebar-list">
                  <li>IGU-Only Replacement</li>
                  <li>All Window Brands</li>
                  <li>Free Estimates</li>
                  <li>Licensed &amp; Insured</li>
                  <li>Low-E Upgrades</li>
                </ul>
              </div>
              <div className="sidebar-card" style={{ background: "#27ae60" }}>
                <h3 style={{ marginBottom: 10 }}>💰 Don't Replace the Whole Window!</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>Most {city.name} homeowners save 60–80% by replacing only the insulated glass unit vs. full window replacement. Call us first before buying new windows.</p>
                <a href={PHONE_HREF} style={{ display: "block", marginTop: 12, fontFamily: "Barlow Condensed", fontSize: 20, fontWeight: 900, color: "#FFD700" }}>{PHONE}</a>
              </div>
              <div className="sidebar-card" style={{ background: "#1a2332" }}>
                <h3>All Foggy Window Areas</h3>
                <div className="cities-list">
                  {FOGGY_CITIES.map(c => (
                    <a key={c.key} onClick={() => setPage({ type: "foggy-city", key: c.key })} style={{ background: city.key === c.key ? "rgba(255,215,0,0.3)" : undefined }}>{c.name}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="cta-section">
        <div className="container">
          <h2>Foggy Windows in {city.name}?</h2>
          <p>Call now — free estimates for {city.name} homeowners. We'll tell you if you need new glass or a full window.</p>
          <div className="cta-btns">
            <a href={PHONE_HREF} className="btn-primary">📞 {PHONE}</a>
            <button className="btn-secondary" onClick={() => setPage({ type: "contact" })}>Get Free Estimate</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceRoute({ setPage }) {
  const { key } = useParams();
  const svc = ALL_SERVICES.find(s => s.key === key) || ALL_SERVICES[0];
  return <ServicePage svc={svc} setPage={setPage} />;
}

function CityRoute({ setPage }) {
  const { key } = useParams();
  const city = CITIES.find(c => c.key === key) || CITIES[0];
  return <CityPage city={city} setPage={setPage} />;
}

function FoggyCityRoute({ setPage }) {
  const { key } = useParams();
  const city = FOGGY_CITIES.find(c => c.key === key) || FOGGY_CITIES[0];
  return <FoggyCityPage city={city} setPage={setPage} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // setPage keeps the same object-shaped API every existing component
  // already calls (setPage({ type, key })), but now drives a real URL
  // change via React Router instead of local state.
  const setPage = (page) => navigate(pageToPath(page));
  const currentPage = pathToPageType(location.pathname);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{css}</style>
      <Header setPage={setPage} currentPage={currentPage} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} />} />
          <Route path="/service/:key" element={<ServiceRoute setPage={setPage} />} />
          <Route path="/city/:key" element={<CityRoute setPage={setPage} />} />
          <Route path="/foggy-window" element={<FoggyWindowPage setPage={setPage} />} />
          <Route path="/foggy-city/:key" element={<FoggyCityRoute setPage={setPage} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage setPage={setPage} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage setPage={setPage} />} />
        </Routes>
      </main>
      <Footer setPage={setPage} />
      {showTop && (
        <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})}
          style={{ position:"fixed",bottom:70,right:16,width:44,height:44,borderRadius:"50%",background:"#0F4C81",color:"#fff",border:"none",cursor:"pointer",fontSize:20,zIndex:997,boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center" }}
          aria-label="Back to top">↑</button>
      )}
    </>
  );
}
