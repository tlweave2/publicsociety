# Media

## What the site uses

These three files are what the page references. They are optimized derivatives
— re-encoded and resized from the originals — not the camera files.

| File | Used for | Dimensions | Size |
| --- | --- | --- | --- |
| `public/images/interior.jpg` | Hero background (and the video's poster frame) | 1535×1024 | 249KB |
| `public/images/storefront.jpg` | "Ceres' Premier Cocktail Lounge" section | 1320×735 | 135KB |
| `public/images/bottle-service.jpg` | "VIP Tables" section | 1000×1500 | 221KB |

Paths are set in `MEDIA` at the top of `app/page.jsx`.

## Originals

`assets-source/` holds the uploaded originals, including shots not currently
used on the page:

| Original | Became |
| --- | --- |
| `8F02EAE9-9393-4ACA-A381-0634D392CFD7.PNG` | `interior.jpg` |
| `IMG_8539.jpg` | `storefront.jpg` |
| `publicsociety-662.jpg` | `bottle-service.jpg` |
| `publicsociety-661.jpg` | *unused* |
| `publicsociety-663.jpg` | *unused* |
| `ChatGPT Image Aug 11, 2026, 09_56_56 PM.png` | *unused (design comp)* |

That folder sits outside `public/` deliberately: everything under `public/` is
copied into the export and published, so keeping 3.3MB of originals there would
ship them to every visitor for no reason.

## Adding or replacing a photo

1. Put the original in `assets-source/`.
2. Generate an optimized version into `public/images/`. Roughly:

   ```js
   sharp(input)
     .rotate()                                   // honour EXIF orientation
     .resize({ width: 1600, withoutEnlargement: true })
     .jpeg({ quality: 82, mozjpeg: true, progressive: true })
     .toFile(output);
   ```

   Keep hero-sized images under about 300KB. The originals were 1.9MB and
   1.1MB; re-encoding cut them by 87% and 80% with no visible difference at
   display size.
3. Point the matching key in `MEDIA` at the new file.

New images must go through the `asset()` helper (they do automatically if you
use `MEDIA`), or they will 404 in production — `basePath` does not rewrite
plain `src` attributes.

Portrait images need a width cap or they tower over the copy beside them; see
`.ps-vip .ps-photo` for how the bottle shot is handled.

## Walkthrough video — `public/video/walkthrough.mp4`

Not added yet. The hero is currently the still image. When the video is ready,
drop it at that path and set `MEDIA.heroVideo` to `"/video/walkthrough.mp4"`;
`interior.jpg` automatically becomes its poster frame. While `heroVideo` is an
empty string, no video is requested at all.

Requirements:

- **H.264 MP4.** The only format the page requests.
- **Silent.** It is muted and cannot be unmuted — browsers block autoplay with
  sound. Strip the audio track entirely to save weight.
- **20–40 seconds, seamless loop.** It repeats indefinitely.
- **Under ~8MB.** It loads on every visit, including phones on cell data.
- **No key detail in the lower left** — the headline sits there.

Visitors with "reduce motion" enabled never load the video and see the still.
