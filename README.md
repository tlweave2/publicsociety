# Public Society

Landing page for Public Society — a bar site built as a club charter: a
membership stamp in the hero, scrolling bylaws, and each section numbered as an
Article.

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
- **`public/.nojekyll`** — Pages otherwise runs Jekyll, which strips
  directories beginning with an underscore, and Next puts every asset in
  `_next/`.
- **`images.unoptimized`** — Next's image optimizer needs a server. Only
  matters if the photo frames switch to `next/image`.

### Moving to a custom domain

On a custom domain the site sits at the root, so the base path must be empty:

```bash
BASE_PATH= npm run build
```

Set `BASE_PATH` to an empty string in the workflow's build step, add a
`public/CNAME` file containing the domain, and set the domain in Settings →
Pages.

## Editing the content

Almost everything you'll want to change lives in the consts at the top of
`app/page.jsx`:

| Const | What it controls |
| --- | --- |
| `INFO` | Address, phone, Instagram, reservations link, newsletter link |
| `HOURS` | Opening hours — rendered in **both** the hero strip and Article III |
| `BYLAWS` | The scrolling marquee under the hero |
| `POURS` | The three drink columns in Article II |

`INFO.reservations` and `INFO.newsletter` are `"#"` placeholders. Point them at
the real Resy / Tock / OpenTable and Mailchimp URLs. The address and phone are
placeholders too.

`HOURS` is deliberately a single source of truth — edit it once and both places
update.

## Adding photos

Article I renders four `<Frame>` components that currently show numbered empty
slots. Drop images into `public/` and pass a `src`:

```jsx
<Frame src="/bar.jpg" alt="The long bar" caption="The long bar" tilt={-3} tall />
```

`tilt` is the rotation in degrees (frames straighten on hover) and `tall`
switches the frame from 4:3 to 3:4.

## Notes

- `app/page.jsx` is a client component — it uses `useState`/`useEffect` for the
  stamp animation, the mobile nav, and the scroll reveals.
- The member number and stamp date are generated in an effect rather than
  during render, so server and client markup match (no hydration mismatch).
- Fonts (Bodoni Moda, Archivo, Courier Prime) load from Google Fonts via an
  `@import` in the stylesheet.
- Motion is fully disabled under `prefers-reduced-motion`.
- There is no `next lint` script: that command was removed in Next 16.
