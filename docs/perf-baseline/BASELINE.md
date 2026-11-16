# Performance Baseline — before redesign

- **Measured:** 2026-11-16, 08:29–09:15 UTC, from the developer's machine (Islamabad; Cloudflare ISB edge)
- **Site:** https://portfolio-frontend-osom.onrender.com/ (Render static site)
- **API:** https://portfolio-backend-osom.onrender.com/api (Render **free** web service)
- **Build:** `index-BqKv_EPz.js` / `index-Dg6BCnEa.css`, which is exactly commit `41342ef`. A local rebuild produced identical hashes.
- **Tools:** curl for raw timings; Lighthouse 12.6.0 in headless Edge with default simulated throttling. Scores are the **median of 4 runs** per form factor.

> The Vercel deployment URL isn't recorded in the repo, so only the Render deployment was measured.

## Root cause of the 15–30 s load

**The Render free-tier backend sleeps when idle, and the frontend shows nothing until it wakes.**

| Measurement | Result |
|---|---|
| `/api/profile` after 16.5 min idle (cold) | **31.87 s TTFB** |
| Same request immediately after (warm) | 0.57 s |
| Frontend HTML document | 0.10–0.59 s (served from Cloudflare cache) |

Render's free web services spin down after about 15 minutes without traffic. The first visitor after that waits about 30 seconds for the server to boot.

The frontend makes this worse. [PublicPortfolio.jsx](../../frontend/src/pages/PublicPortfolio.jsx) fires 11 API calls through `Promise.all` and renders a full-screen `<Loading />` until **every one** has settled. A visitor who arrives while the backend is asleep sees only a spinner for the whole cold start. That includes the hero (name, title, bio), even though its text rarely changes.

Every other cost below adds seconds at most. The cold start is the only measured cause in the 15–30 s range.

## Lighthouse scores (backend warm, median of 4)

| | Mobile | Desktop |
|---|---|---|
| **Performance** | **41** | **76.5** |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 82 | 82 |

Lighthouse never sees the cold start, because the backend was already awake for every run. **These scores are the best case.**

## Core metrics (median)

| Metric | Mobile | Desktop |
|---|---|---|
| Document TTFB | 201 ms | 12 ms |
| First Contentful Paint | 3.37 s | 0.98 s |
| Largest Contentful Paint | **7.05 s** | 2.11 s |
| Speed Index | 6.35 s | 2.09 s |
| Total Blocking Time | **1,360 ms** | 226 ms |
| Time to Interactive | 7.15 s | 2.11 s |
| Cumulative Layout Shift | 0.014 | 0.004 |
| Total page weight | 2,435 KB | 2,435 KB |
| Network requests | 39 | 39 |

LCP element: `<p class="hero-description">`, the bio text. It can't paint until the JS loads, the API calls finish, and the framer-motion fade-in completes.

## What the page downloads (one load, about 2.4 MB, 39 requests)

| Type | Requests | Transfer |
|---|---|---|
| Images (Cloudinary) | 15 | **1,895 KB** |
| Fonts | 7 | 306 KB (Font Awesome alone 253 KB) |
| JavaScript | 1 | 184 KB brotli / 592 KB raw |
| CSS | 3 | 36 KB |
| API (XHR) | 11 | 11 KB |
| HTML | 1 | 0.8 KB |

### Largest assets
| Size | Asset | Note |
|---|---|---|
| 349 KB | projects/oy8nenefuhbuxxo1cw3x.png | Original PNG, displayed at ~380 px wide |
| 238 KB | projects/brwsmtm0kyiufey01bao.png | Original PNG |
| 225 KB | certificates/ll3z8aht63jrtkp2wkyz.png | Original PNG |
| 184 KB | index-BqKv_EPz.js | Single bundle with public site + all 12 admin pages |
| 171 KB | education/rfta7vxyicceg6yrcbkk.jpg | Transcript image |
| 166 KB | projects/gek5qb0msaz75h3pmnfz.png | |
| 161 KB | education/mp9upoy56kaevjd3zcsy.jpg | |
| 147 KB | fa-solid-900.woff2 | Whole Font Awesome solid set for ~30 icons |
| 106 KB | fa-brands-400.woff2 | Whole brands set for ~6 icons |

The full per-file list is in [raw-network.txt](raw-network.txt).

## Secondary bottlenecks (in priority order)

1. **Rendering is gated on the API.** Nothing renders until all 11 requests finish, so a warm load still takes about 3.4 s on mobile before content appears.
2. **Images are unoptimized.** Uploads are served at original size and format, with no `f_auto`, `q_auto` or `w_` Cloudinary transforms and no `loading="lazy"`. Lighthouse estimates **~1.6 MB of savings** from right-sizing and ~1 MB from modern formats. Most of the images are below the fold.
3. **Bundles are never cached.** Every file is served with `Cache-Control: no-cache` because of the `/*` header in [render.yaml](../../render.yaml), including the hashed, immutable `/assets/*`. Repeat visitors re-validate everything.
4. **One JS chunk.** The admin dashboard ships to every public visitor. Lighthouse flags about 103 KB of unused JS.
5. **Font Awesome is the full webfont** (272 KB) for a few dozen icons. On top of that, the page requests 10 Google Font weights.
6. **Mounting everything at once costs main-thread time.** When the loading gate lifts, all 12 sections mount together. The trace shows a single 309 ms layout covering about 1,300 objects (more under mobile CPU throttling). There are also 15 non-composited infinite animations, such as the gradient-text shimmer and aurora background.

### Ruled out

The animated SVG hero ribbon ([HeroWave.jsx](../../frontend/src/components/sections/HeroWave.jsx)) looked like the main-thread hog, so it was A/B tested. Two local production builds were compared, identical except that one had the ribbon removed:

| Build | Perf | TBT | LCP |
|---|---|---|---|
| A — as deployed | 43 | 1,520 ms | 5.6 s |
| B — HeroWave removed | 44 | 1,610 ms | 5.9 s |

The differences are within run-to-run noise, so the ribbon isn't a meaningful cost.

## How to compare after the redesign

```bash
# deploy, then wait until the backend is warm, then run 3+ passes per form factor
lighthouse <url> --output=json --output-path=after-mobile-1.json
lighthouse <url> --preset=desktop --output=json --output-path=after-desktop-1.json
node docs/perf-baseline/compare.js mobile  after-mobile-*.json
node docs/perf-baseline/compare.js desktop after-desktop-*.json
```

To re-check the cold start, leave the backend idle for at least 16 minutes, then run `curl -w "%{time_starttransfer}\n" -o /dev/null -s <api>/profile`.

## Files
- `baseline.json`: machine-readable medians, used by `compare.js`
- `runs/{mobile,desktop}-{0..3}.json`: raw Lighthouse results. Run 0 of mobile is the outlier (perf 27, TBT 12.8 s, cold edge cache).
- `lighthouse-mobile-median.html`, `lighthouse-desktop-median.html`: full reports for representative runs; open in a browser
- `raw-network.txt`: curl timings, headers and per-asset sizes
