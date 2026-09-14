# WORLD ART + MOBILE QA PASS

## INITIAL AUDIT

Base: main 533cda8f222755a8e75a69f484a6beaef2fd13f7 (Polish19).
The old environment repeated satellite/dish silhouettes and lacked substantial
off-route structure. Existing camera, movement, loot, missions and secret flow
were retained. Initial runtime inspection and successive screenshot reviews
guided the art placement; legacy reports were not treated as current proof.

## WEB RESEARCH

All eight requested references are documented with direct links and license
decisions in ART_DIRECTION.md. Kenney Space Kit, Simple Space, Space Shooter
Extension, Space Shooter Remastered and Space Station Kit: REFERENCE ONLY (CC0).
Wenrexa Space Modular Buildings: REFERENCE ONLY (explicit commercial permission).
ChaosShark Shipyard and Centrifuge: REFERENCE ONLY (CC0). Their modular assembly,
silhouette hierarchy and docking gaps informed original work; their differing
3D/pixel/rendered styles were not mixed into this game's vector palette.
Unrelated 3D mega-kits/non-CC0 debris search results: REJECTED for direct import.

## ASSETS IMPORTED

None. No external package, plugin or font installed.

## LICENSES

70 original project SVGs. Existing CC0/OFL dependencies remain documented in
THIRD_PARTY_ASSETS.md; no reference preview was copied into game resources.

## ART DIRECTION

Desaturated blue-steel machinery, recessed surfaces and broken structural
silhouettes support bright salvage. Large composed scenes use hulls, rings,
solar cells, tanks, docking forks and radio hardware, not oversized reward icons.
Medium/small SVG whitespace was trimmed after visual review. No decorative glow
or opacity pulse was added.

## ENVIRONMENT LIBRARY

16 large compositions; 24 medium variants (8 assemblies × 3 damage arrangements);
30 small variants (10 fragment types × 3 orientations). 70 SVGs total.
New independent background elements: 0; existing stars/haze retained.
These are modular variants, not 70 unique gameplay systems.

## REGIONS

Working orbit: repair/solar/tank hardware. Dock: open service structures.
Debris: fractured hulls and station rings. Graveyard: damaged satellites/dishes.
Cargo/caravan: cargo spines and transport remnants. Meteor channel: struck engine
and transport sections. Radiation: reactor/fuel/containment machinery.
Wreck: cruiser and engine breaks. Ghost station: habitats/drydocks/rings.
Signal/remote: instruments, relay pairs and anomaly cages. Relay: radio/solar.
Ore/energy: industrial power equipment. Secret interior retains dedicated art.
Related regions deliberately share modular construction language.

## WORLD GENERATION

Independent deterministic presentation pass: existing region graph → weighted
large scene → regional medium pieces → link-midpoint traces → off-route coverage
→ micro fragments. Same-family spacing 800; related silhouettes 650 world units.
Conservative bounds protect loot, hazards, events, key, gate and station approach.
Existing graph/resource coordinates and rewards are unchanged. This extends the
existing 2D network rather than claiming an entirely new mission graph.

## EMPTY SPACE

Jittered 420×355 coverage candidates add medium structures away from direct
objectives. Large scenes prefer side banks with clear flight space between them.
100-seed geometry sampling: maximum distance to scenic footprint 499 world units.
This is a spatial proxy, NOT a measured universal encounter-time guarantee.
Open breathing spaces remain intentional; world boundaries are not new regions.

## LOOT VS DECOR

Polish18 loot scale retained. Collectibles retain white/cyan/warm edges, while
decor uses lower saturation/opacity and no pickup treatment. No added loot spam.
Reviewed actual 1366×768 runtime captures, mobile and off-route views.

## METEORS / HAZARDS

Existing movement, collision bodies, warning cycles and chase are unchanged.
New scenery has clearance from hazards and no collision behavior. Six secret
safe pockets and reward flow remain intact. No open-world walls were introduced.

## PERFORMANCE

See world20-performance-summary.json and world20-perf-isolation.json. The full
traced run must not be described as spike-free: 945 frames exceeded 20 ms,
639 exceeded 50 ms and 53 exceeded 100 ms (max 173.5 ms). Instances stayed 869;
sampled heap ranged 21.9–40.7 MB, without monotonic growth. Detailed trace/QA
overhead and pre-optimization runtime costs are assessed separately below.

CPU sampling identified repeated PIXI text measurement/raster work; instrumentation
also exposed competing ProcPOI transform writers. Removed the obsolete writer,
cached identical non-HUD text setter assignments, and retained a single scenery
renderer. No camera or movement behavior changed. The initial perf-before fixture
entered Result and is NOT a valid traversal baseline (retained for transparency).
The valid pre-text-cache 120-second traversal recorded 101 frames >20 ms, 85
>33.3 ms, 35 >50 ms and 2 >100 ms; mean measured CPU work was 4.94 ms.

Final controlled 120-second traversal: 7,233 frames, p95 17.1 ms, p99 17.4 ms,
maximum 20 ms; counts >20 / >25 / >33.3 / >50 / >100 ms: 0 / 0 / 0 / 0 / 0.
Mean measured CPU work 2.96 ms. Instances 869 throughout all 48 play segments.
Only 4 ProcPOI, 9 Scenic18 and 7 ProcDecor configuration calls were needed.
This is an explicit DEV/invulnerable benchmark, not the natural progression run.
Chromium used ANGLE AMD Radeon D3D11, not software SwiftShader. These results do
not guarantee zero spikes on every machine or erase the earlier trace spikes.
Generation occurs only per world creation. Existing pools are reused; bounded
camera culling and cached sprite configuration avoid per-frame construction.
DEV guide geometry is sampled at 10 Hz, while its FPS counter remains rAF-based.

## MOBILE TEST MODE

DEV → MOBILE TEST MODE. Real isolated iframe viewport with presets 360×640,
375×667, 390×844, 393×873, 412×915, 430×932, 720×1280, 1280×720.
Portrait/Landscape/Rotate/Reset, touch simulation, safe areas, UI/gameplay bounds,
hazard outlines and telemetry. Closing discards private save changes.
Fixed stale PIXI container scale after repeated portrait/landscape transitions.
Host DPR is reported, not spoofed. This is not physical Android validation.
Final full-size review caught navigation covering Pause at 844×390. A minimum
78 px bottom reservation now gives 12 px clearance above the toolbar. The mobile
flow was repeated after the fix: 598 measured frames, p95 17 ms, maximum 17.5 ms,
no frames >33.3 ms and no runtime errors. Both new captures were visually reviewed.

## DEV PANEL

Clickable existing tools retained, including seed, sectors, secret, resources,
contracts and upgrades. Mobile helper is gated to localhost/explicit DEV mode.
No dependency on remembering function keys. No production SDK rewrite.

## GENERATION QA

100 seed/sector cases: deterministic output, station/hazard/resource clearance,
connected graph, valid key/gate positions, no overlapping new large/medium
footprints and exact unchanged gameplay snapshot. All pass.
15 visual seeds: 130013, 230032, 330051, 430070, 530089, 630108, 730127, 830146,
930165, 1030184, 1130203, 1230222, 1330241, 1430260, 1530279.
First five also traversed with real keyboard input in four directions, including
diagonal/off-route paths, from explicit DEV start fixtures. These are not five
natural progression runs. All mandatory frames were opened at full size.

## FULL PLAYTEST

Fresh isolated storage; real clicks/keyboard, read-only coordinate-aware navigator.
No teleport, HP/credit grant or progress writes in this run.
First loot 7.52 s; first return 34.70 s; first purchase 98.06 s.
Sector 2 at 449.08 s; locked signal 463.89 s; key 477.61 s; gate 492.86 s;
secret completed/cache=true at 557.21 s; station return 572.70 s;
reload/continue 578.71 s. End-to-end report including trace flush: 608.35 s.
Cache retained existing +240 cargo value/+1 tech part. Final credits 425 and
7 tech parts persisted. Eleven contracts completed. Arcade and pause checked.
The early 5-second QA attempt was rejected; its missing resume-state wait was
fixed before this complete run. Automated navigation is not a newcomer study.
The full run preceded the final presentation-only transform/text caches and
small-landscape CSS correction. Export, mobile, UI, secret restoration, ads and
save regressions were checked after cache changes; mobile flow and export were
checked again after the final CSS correction. Progression code was unchanged.

## RESPONSIVE

1920×1080, 1600×900, 1536×864, 1366×768, 1280×720, 1917×920,
1280×720 touch and 720×1280 portrait: existing safe-zone checks pass.
Mouse hover does not steer. Mobile preset rotation, save isolation and localhost
rewarded fallback tested separately. See machine-readable reports for results.

## SCREENSHOTS

screenshots/WorldArtGeneration20/: required 01–28, 15 seed frames, responsive
safe-zone evidence and natural-run checkpoints. The mandatory names match the
task. Final-art recaptures are documented in world20-final-views.json.
DEV scene fixtures are labeled separately from the fresh-save natural run.

## ASSETS/LICENSE FILES

assets/game/world20/manifest.json; scripts/world20-art.js;
docs/ART_DIRECTION.md; docs/WORLD_GENERATION.md; docs/MOBILE_TEST_MODE.md;
docs/THIRD_PARTY_ASSETS.md; docs/DEV_TOOLS.md.
PLAY_WORLD20.ps1 opens http://127.0.0.1:4237/ (or builds missing export).
Also fixed exporter Cyrillic restoration: behaviors are matched by type instead
of index after exporter inserts capability behaviors. Export regression verifies
the movement behavior and generated JavaScript.

## REMAINING

Physical-device GPU/touch/notch/Yandex-wrapper and production ads require final
platform QA. Existing external GDevelop analytics responds HTTP 409; tracked
separately from local resource/runtime errors. No optional new parallax layer or
ambient events were added. No detected local blocker remains. Some off-route
views intentionally remain sparse; the 499-unit coverage statistic is not a claim
that every viewport contains three large scene families.

## COMMIT

Implementation and evidence: cef90bc13b765ef71cdc116c0579c226557b1c2f.
This report's delivery-verification update is the following documentation commit.

## PUSH

Implementation push to origin/main succeeded; git ls-remote returned
cef90bc13b765ef71cdc116c0579c226557b1c2f, matching local HEAD.
Tracked working tree was clean. The pre-existing user archive
screenshots/FullReleaseRebuild14/FullReleaseRebuild14.zip remains untracked and
untouched. Final documentation commit/push hash is supplied in the final response.

## VERDICT

READY FOR FINAL RELEASE QA — local acceptance completed with the physical-device
and production-platform limitations above. This is not production ad certification.
