# Media drop-in

The site references these paths. Drop the files in with these exact names and
they appear automatically — no code change needed. Until a file exists, the
page shows a styled placeholder panel rather than a broken image.

## Images — `public/images/`

| File | Used for | Suggested size |
| --- | --- | --- |
| `interior.jpg` | Hero background (and the video's poster frame) | 2400×1350, landscape |
| `storefront.jpg` | "Ceres' Premier Cocktail Lounge" section | 1600×1100 |
| `vip-table.jpg` | "VIP Tables" section | 1600×1000 |

From the photos already shot: the chandelier/dance-floor interior is
`interior.jpg`, the 4th Street exterior is `storefront.jpg`, and the reserved
table with candles is `vip-table.jpg`.

Export as JPEG, quality ~80. The hero image is the largest thing on the page —
keep it under about 400KB or it will slow the first load noticeably.

## Video — `public/video/`

| File | Used for |
| --- | --- |
| `walkthrough.mp4` | Hero background video |

For the walkthrough video:

- **H.264 MP4.** Widest support, and the only format the page requests.
- **Silent.** It is muted and cannot be unmuted — browsers block autoplay with
  sound. Strip the audio track entirely to save weight.
- **20–40 seconds, seamless loop.** It repeats indefinitely.
- **Under ~8MB.** It loads on every visit, including phones on cell data.
  1080p at a moderate bitrate is plenty behind a dark scrim.
- **No text or faces in the lower left** — the headline sits there.

Until `walkthrough.mp4` exists, the hero uses `interior.jpg` as a still. The
same still is the poster frame once the video lands, so it is worth choosing a
frame that matches the video's opening shot.

Visitors with "reduce motion" enabled in their OS never load the video and see
the still instead.
