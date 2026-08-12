# Public Society Bar & Lounge

Website for Public Society Bar & Lounge — 805 4th Street, Ceres, California.

Next.js (App Router) + React, exported as a static site and hosted on GitHub
Pages. No CSS framework — the page ships its own styles.

**Live:** https://tlweave2.github.io/publicsociety/

## Running it

```bash
npm install
npm run dev      # http://localhost:3000/publicsociety
```

The `/publicsociety` suffix is not a typo — see *Deployment* below.

```bash
npm run build    # static export into out/
npm run preview  # serve out/ exactly as Pages does
```

## Editing the content

Everything you'll want to change lives in the consts at the top of
`app/page.jsx`:

| Const | What it controls |
| --- | --- |
| `INFO` | Address, phone, socials, and the four external links below |
| `HOURS` | The hours list in the footer |
| `PILLARS` | The three cards: Craft Cocktails / The Experience / Events & Nightlife |
| `MEDIA` | Paths to the hero video, hero poster, storefront and VIP photos |

### The four links that still need real URLs

Each one is an empty string today, and each degrades to something sensible
rather than a dead button:

| `INFO` key | What to put there | While it's empty |
| --- | --- | --- |
| `reservations` | Resy / Tock / OpenTable booking URL | Every "Reserve a Table" and "Book a VIP Table" button dials the phone number instead |
| `careersForm` | The Google Form for job applications | Careers shows "positions posted soon" plus phone and Instagram |
| `newsletter` | Mailing-list form action (Mailchimp etc.) | The footer signup becomes a "Follow @publicsocietylounge" link |
| `facebook` | The real Facebook page URL | Currently points at facebook.com generally |

Filling one in is a one-line change; nothing else needs touching.

## Photos and the walkthrough video

Drop files into `public/images/` and `public/video/` using the names in
[`docs/media.md`](docs/media.md). Until a file exists the page shows a styled
placeholder panel rather than a broken image, so the site stays presentable
while photography is in progress.

**The hero is a still image** (`interior.jpg`) behind a dark scrim. When the
walkthrough video is ready, drop it at `public/video/walkthrough.mp4` and set
`MEDIA.heroVideo` to `"/video/walkthrough.mp4"` — the hero then autoplays it
muted on a loop, with `interior.jpg` as its poster frame. While `heroVideo` is
an empty string no video is requested at all. `docs/media.md` has the encoding
requirements; the ones that matter are silent, H.264, seamless loop, and under
about 8MB.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
export and publishes it. No manual step.

**One-time setup:** in the repo's Settings → Pages, set *Source* to
**GitHub Actions**. The workflow cannot deploy until that is switched over.

A few things are load-bearing for Pages specifically:

- **`output: "export"`** in `next.config.mjs` — Pages serves static files and
  cannot run a Next server.
- **`basePath: "/publicsociety"`** — this is a *project* page, so the site is
  served from a subdirectory rather than the domain root. Without it every
  asset 404s. This is why the dev server also runs under `/publicsociety`:
  local and production paths stay identical.
- **`env.NEXT_PUBLIC_BASE_PATH`** — `basePath` rewrites framework URLs but
  *not* plain `<img src="/...">` or `<video src="/...">`. The page prefixes its
  own media URLs with this, via the `asset()` helper. Any new image or video
  must go through `asset()` or it will 404 in production while working locally.
- **`public/.nojekyll`** — Pages otherwise runs Jekyll, which strips
  directories beginning with an underscore, and Next puts every asset in
  `_next/`.
- **`images.unoptimized`** — Next's image optimizer needs a server.

### Moving to a custom domain

On a custom domain the site sits at the root, so the base path must be empty:

```bash
BASE_PATH= npm run build
```

Set `BASE_PATH` to an empty string in the workflow's build step, add a
`public/CNAME` file containing the domain, and set the domain in Settings →
Pages.

## Notes

- `app/page.jsx` is a client component — it uses `useState`/`useEffect` for the
  mobile nav, the scroll reveals, and the hero video.
- Visitors with "reduce motion" enabled never download the hero video; they get
  the poster still. Scroll reveals are disabled for them too.
- Anchor targets carry `scroll-margin-top` so the fixed nav doesn't cover a
  section heading when a nav link is clicked.
- Fonts (Cormorant Garamond, Jost) load from Google Fonts via an `@import`.
- There is no `next lint` script: that command was removed in Next 16.

## Not built yet

The design mockup's nav lists **Events**, **Private Events** and
**Reservations** as their own pages. Those aren't here — the mockup didn't
include copy for them, and that's the owners' to write. The current nav links
only to sections that exist. When the copy lands, they can become either new
sections or separate routes under `app/`.
