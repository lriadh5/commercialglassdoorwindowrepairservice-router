# Commercial Glass Door & Window Repair Services
## Website Deployment Guide

**Business:** Commercial Glass Door & Window Repair Services  
**Phone:** (703) 609-3508  
**Service Area:** Northern Virginia

---

## Project Structure

```
glass-site/
├── index.html          ← HTML entry point (has SEO meta tags + schema)
├── package.json        ← Project dependencies
├── vite.config.js      ← Build configuration
├── vercel.json         ← Vercel routing config
├── netlify.toml        ← Netlify build + routing config
├── .gitignore
├── public/
│   └── favicon.svg     ← Site icon
└── src/
    ├── main.jsx        ← React entry point
    └── App.jsx         ← Full website (all pages, photos embedded)
```

---

## Option 1: Deploy to VERCEL (Recommended — Free)

### Method A: Drag & Drop (Easiest — no account needed for preview)
1. Go to **vercel.com**
2. Sign up / log in (free)
3. Click **"Add New Project"**
4. Click **"Browse"** and select the entire `glass-site` folder
5. Vercel auto-detects Vite — click **"Deploy"**
6. Done! You get a live URL in ~2 minutes

### Method B: GitHub (Best for ongoing updates)
1. Create a free GitHub account at github.com
2. Create a new repository called `glass-site`
3. Upload all files from this folder to GitHub
4. Go to vercel.com → New Project → Import from GitHub
5. Select the repo → Deploy
6. Every time you update files on GitHub, Vercel auto-redeploys

### Connect Custom Domain on Vercel:
1. In Vercel dashboard → your project → Settings → Domains
2. Add: `commercialglassdoorwindowrepairservices.com`
3. Follow DNS instructions (update nameservers at your domain registrar)

---

## Option 2: Deploy to NETLIFY (Free)

### Drag & Drop:
1. Run `npm install && npm run build` first (creates `dist/` folder)
2. Go to **netlify.com** → sign up free
3. Drag the `dist/` folder to the Netlify drop zone
4. Done! Live URL instantly

### Or via Git (auto-deploy):
1. Push to GitHub
2. Netlify → New site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## Option 3: Deploy to GitHub Pages (Free)

1. Push to GitHub
2. Go to repo Settings → Pages
3. Set source to GitHub Actions
4. Add this workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Run Locally (Preview on Your Computer)

Requirements: Node.js installed (nodejs.org — download LTS version)

```bash
# 1. Open Terminal / Command Prompt
# 2. Navigate to this folder:
cd glass-site

# 3. Install dependencies (first time only):
npm install

# 4. Start local preview:
npm run dev

# 5. Open browser to: http://localhost:5173
```

---

## For Your Fiverr Developer

Tell them:
> "This is a Vite + React single-page app. Please deploy to Vercel (or Netlify) and connect the domain commercialglassdoorwindowrepairservices.com. The vercel.json and netlify.toml are already included. Just run npm install, connect to Vercel via GitHub, and set the custom domain."

---

## After Deployment — Next Steps

1. **Google Search Console** — Submit your sitemap at `yoursite.com/sitemap.xml`
2. **Google Analytics** — Add GA4 tracking code to `index.html`
3. **Google Business Profile** — Update your website URL
4. **Domain Email** — Set up info@commercialglassdoorwindowrepairservices.com via Google Workspace or Zoho Mail

---

*Built with React + Vite. All photos are embedded as base64 — no external image hosting needed.*
