# Public Society

Landing page for Public Society — a bar site built as a club charter: a
membership stamp in the hero, scrolling bylaws, and each section numbered as an
Article.

Next.js (App Router) + React. No CSS framework — the page ships its own styles.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

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
