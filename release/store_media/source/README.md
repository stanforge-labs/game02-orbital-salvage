# Store media sources

Only this folder's final PNG/MP4 siblings are promotional deliverables; these sources and QA sheets are not uploaded to Yandex Console or included in the game ZIP.

## Icon and cover

- `icon.svg`, `cover.svg`: new vector compositions, rendered by `scripts/store-art.js`. Not game screenshots; no title/text and no outer border or rounded corners.
- `ship-vector.svg`: crisp vector adaptation of the game's `assets/game/ship_player.png`, derived from Kenney **Space Shooter Remastered / playerShip1_blue.png**, CC0. Original: https://kenney.nl/assets/space-shooter-remastered. Reuses the game's white/cyan/yellow silhouette; no external art.
- Embedded station, engine wreck, meteors and salvage items: project-original SVGs from `assets/game/`; original compositions and star field are project-original too.
- No AI-generated imagery, external stock images, third-party screenshots or new music.
- Asset licensing details: `docs/THIRD_PARTY_ASSETS.md`.

## Real gameplay capture

`scripts/store-capture.js` drives the unpacked production ZIP on local port 4250 via ordinary keyboard input and visible buttons. Its navigator reads coordinates, but never writes positions, HP, credits, inventory, seed or progression. Desktop and mobile contexts begin with fresh storage and earn upgrades / Sector 2 / secret access normally. The local SDK initialization transport stays outside the archive; no ad rewards are requested for media capture. No DEV mode or rendered QA overlay is enabled.

Desktop: 1920×1080. Mobile: real touch-capable mobile browser layout at 640×360 CSS pixels, DPR 2, yielding native 1280×720 screenshots. Mobile screenshots are not resized desktop frames and are not presented as physical-phone captures. `scripts/store-detail.js` continues the exact earned browser storage from the extra mobile capture for a crisp desktop Sector 2 PNG; no save fields are edited or fabricated.

The source capture timeline and final selection provenance are retained in `capture-evidence.json` and `selection.json`. Raw recordings and rejected candidates remain ignored under `_tmp-export/`, not in Git or the promotion upload package. Full-size screenshots are not composited, zoomed, recolored, annotated or staged. PNG conversion only removes the redundant alpha channel for the required 24-bit RGB format.

## Reproduction / tools

Install local build tools with `npm ci --prefix tools/media`. Render art using `node scripts/store-art.js`. Existing project Playwright setup is used for capture. Set `STORE_PLATFORM=desktop` or `mobile` before running `node scripts/store-capture.js` against the verified extracted ZIP server. Media selection/encoding and audit are separate scripts so the production build cannot be changed by media generation.

`sharp`, `ffmpeg-static` and `ffprobe-static` are local build tools, not runtime game dependencies and are not shipped inside the production archive. Their binaries, node_modules and raw recordings are excluded from Git. The MP4 is silent by design: Playwright capture provides video only; no synthetic game audio or copyrighted soundtrack is added.
