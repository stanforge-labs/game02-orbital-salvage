# POLISH19 — Visual coherence, player safe zone, microstutters

Date: 2026-09-14. Base: `b42bd30ff6effdbe5362a05224b3d1cc0c905cc7`.
Local build: `exports/polish19`; launcher: `PLAY_POLISH19.ps1`; http://127.0.0.1:4236/.

## INITIAL AUDIT

Read POLISH18_REVIEW, RELEASE17_REVIEW and DEV_TOOLS, opened Polish18 images,
then exercised the actual Polish18 browser export before editing. Holding W
reproduced the ship disappearing behind the top HUD: the camera retained its
old world-edge clamp while the ship could travel farther upward. The baseline
image is retained as `before-top-HUD.png`, not presented as a passing image.

Other confirmed issues: neighboring scenic objects repeatedly used satellite
silhouettes; several ostensibly different art families shared the same dish;
multiple legacy HUD writers caused synchronous text re-rasterization. During
final image review a legacy native Title glyph was also visible above the DOM
main menu. All four issues received targeted fixes.

## PLAYER SAFE ZONE

DONE. Composition constraints feed the existing exponential camera follow;
there is no ship teleport, new physical wall, steering change or zoom change.
The upper bound includes HUD height, viewport scaling, a 32-screen-pixel reserve
and silhouette allowance. A 0.12-second velocity lead starts compensation early.
Side and lower bounds protect the ship from the viewport/objective strip.
The existing smoothing coefficient remains 9; normal dead-zone behavior remains.

Continuous upward-flight samples at all landscape sizes stayed below the HUD.
Minimum ship top was approximately 430 logical pixels versus HUD bottom 270;
maximum sampled camera step was 3.32 world units. Left/right/world-bottom tests
also passed. World objects may still travel beneath opaque HUD, as requested.

## WORLD DIVERSITY

DONE. Regional weighted allocation uses the existing 12 art families, grouped
into 8 genuinely similar silhouette groups. Large objects (size >=90) cannot
repeat the same silhouette group within 620 world units. Primary POIs retain
regional priority; secondary objects select from the remaining weighted pool.
At a saturated junction, secondary decor becomes size 68 rather than another
competing large landmark. This is not a global scale or density reduction.

No new random clutter was added. Existing side-route clusters and their spacing
are retained; their family distribution now mixes repair, cargo, hull, solar,
reactor, stone and relay shapes. Ordinary edge-of-map air is intentional, not
filled with off-map gameplay objects. Three categories per frame is an art
target, not a guarantee for every possible camera position. Reviewed region and
side/diagonal frames do not show four identical large satellites.

## REGION ART DIRECTION

- Working orbit / docks: service structures, repair cranes, lighter satellite hardware.
- Debris field / wreck areas: fractured hulls, cargo sections and damaged solar structures.
- Satellite graveyard: dominant old solar assembly with smaller contrasting hardware.
- Meteor / ice areas: stone silhouettes with secondary technical remains.
- Radiation / station areas: cooling fins and split power hubs, not more antenna dishes.
- Sector 2 retains its larger wreck landmarks and dangerous energy regions.
- Secret keeps its existing mechanical corridor, six safe pockets and laser hardware.

## DECORATION

Six existing original SVG files were revised: scenic18-2/3, 12/13, 16/17.
Dish motifs became a repair crane, reactor cooling fins and station power hub.
Canvas dimensions, muted palette, resource IDs and instance pools are unchanged.
No external assets, new dependencies or extensions were installed. No decorative
pulse, reward outline, open-world wall or new collision geometry was introduced.

## LOOT READABILITY

Polish18 sizes and presentation are preserved: scrap 38x35, energy/data 45x45,
heavy 53x48, access key 70x70, secret cache 112x112 world units. Bright collectible
outlines contrast with muted scenic hardware. No rewards, collection radii,
loot positions or density changes were made by this pass.

## PERFORMANCE / MICROSTUTTERS

Two causes were measured and addressed, rather than inferred from p95:

1. Nine top-HUD text objects now have one final writer. Intermediate legacy
   formatting is suppressed only during flight, and unchanged setter values
   are cached. On comparable 18-second keyboard traversals, dirty/forced PIXI
   text-update calls fell from 172,803 to 40,830 (76.4%); measured text CPU time
   fell from 10,043.1 to 4,055.5 ms (59.6%). These are instrumented calls, not a
   claim that every call uploads a GPU texture. Baseline/final seeds differ;
   treat the comparison as supporting evidence, not a controlled hardware benchmark.
2. Cold AudioContext construction took 100 ms on the first gesture in the
   baseline. The silent graph is now prepared during scene loading and explicitly
   suspended until the existing gesture unlock. Unlock measured 4 ms in the
   short comparison and at most 3 ms in the final traversal. Muting, ads and
   persisted audio settings remain owned by the existing audio system.

Final continuous traversal: **556.046 seconds / 33,355 frames** at 1920x1080.
It includes Sector 1, diagonals, regional POIs, meteor warning/chase/escape,
upgrades/new flights, Sector 2, secret entry, laser rooms, cache and return.
No other browser QA was run concurrently with this measurement.

| Frame interval | Count |
|---|---:|
| >20 ms | 9 |
| >25 ms | 4 |
| >33.3 ms | 2 |
| >50 ms | 1 |
| >100 ms | 0 |

Median 16.7 ms; p95 17.1 ms; p99 17.3 ms; maximum 83.2 ms.
Counts normalize floating-point subtraction to 0.001 ms, so an exact 33.3 ms
interval is not miscounted as 33.30000000004 >33.3.

The 83.2 ms interval coincides with the first menu-to-flight world/UI transition:
generation 9.2 ms, synchronous layout in trace, save writes <=0.1 ms at that point.
It is not an in-flight recurring freeze and has not been concealed. One 20.6 ms
interval coincides with minor GC; the other isolated 20–33.4 ms intervals have
no long instrumented handler. Their render CPU samples were 7–11.7 ms; scheduling
and measurement overhead cannot be exclusively separated by this trace.

Maximum save write 0.9 ms. No traced decode operation >=1 ms during traversal;
no evidence of first-use SVG decode as the flight-spike cause. Existing resource
loading was retained, not replaced with speculative extra decoding.
Instance count stayed **869**, with **zero runtime scene-object creations** after
profile installation. Heap ranged 20.2–47.6 MB with GC; this is not a proof of
unlimited-session memory stability. No new per-frame scene-object spawning.

Raw frames, handler events, CDP GC/layout evidence and per-spike correlations:
`polish19-traversal-performance.json`, `polish19-trace-events.json`,
`polish19-performance-analysis.json`. The profiler is QA-only, not in game.json.

## HUD

DONE. Fixed protected text bands and a stable per-message side keep pickup,
streak and damage feedback away from the ship and upper HUD. Off-screen station
text is hidden when the compass already represents it; it is not misleadingly
relocated beside the ship. Long/timed contract text remains fitted by Polish18.
Removed the actual native `Title` object behind the new main menu (the previous
hide list referred to a nonexistent `MenuTitle`). No menu structure was rebuilt.

## NATURAL RUN

DONE with disclosed method: fresh isolated Chromium storage, actual keyboard and
mouse inputs driven by a read-only coordinate-aware navigator. No DEV teleport,
credits, HP changes, invulnerability or game-state writes. This is automated
natural input, not a claim of a human tester or a physical-device playthrough.

Final run checkpoints (seconds from runner start, before screenshot overhead):

| Checkpoint | Seconds |
|---|---:|
| Start | 4.318 |
| First loot | 8.349 |
| First upgrade | 89.920 |
| Sector 2 unlock | 402.941 |
| Sector 2 enter | 403.527 |
| Locked signal investigated | 433.949 |
| Key obtained | 439.745 |
| Gate / secret entry | 448.594 |
| Six checkpoints / cache / exit | 527.552 |
| Return to station | 555.548 |
| Reload / continue | 558.651 |

Several contracts and nine module purchases preceded Sector 2. Damage occurred
in the early route; the final secret was completed safely with installed modules.
The Sector 2 relay contract completed; final return paid 483, balance 554, preserved
after reload. Secret segment took approximately 79 seconds including navigation
and waiting. First development traversal also completed the cache/return/reload
in approximately 537 seconds; final art/audio/text changes were then rechecked
in the final route. No economy or pacing values were changed.

Escape paused time, resume worked, Arcade was entered through its real menu,
and sector select/upgrades/new flight were exercised. Additional Arcade test
scored 110, then checked death/restart with its existing 42-slot pool.
The final menu-only glyph fix was followed by a targeted menu/start/pause/menu
and silent-before-gesture check, not another unnecessary full progression run.

## RESPONSIVE

DONE: 1920x1080, 1600x900, 1536x864, 1366x768, 1280x720 desktop,
1917x920, 1280x720 touch simulation, 720x1280 rotate overlay.
Canvas fits each viewport. Hover alone did not move the ship. Touch input moved
it through the existing control path. Top/side/bottom safety and pause checked.
Physical Android and Yandex production ads were not tested.

## SEEDS

Eight visually inspected runtime fixtures:
130013, 230032, 330051, 430070, 530089, 630108, 730127, 830146.

Additionally 60 deterministic seeds (`130013 + i*100019`, i=0..59) checked family
spacing, idempotence and unchanged gameplay data/POI positions. All passed;
minimum measured same-large-silhouette separation 620.04 world units.
Existing 124–140 scenic/POI records were redistributed, not new scene instances.
Natural final Sector 2 seed: 3578768508. Natural run seeds are recorded separately
from fixtures; no substitution of the current seed into every report entry.

## SCREENSHOTS

54 PNGs in `screenshots/Polish19/`, all opened at original resolution and visually
reviewed. Explicit review manifest: `polish19-visual-review.json`.

01 menu; 02 start; 03 side route; 04 diagonal; 05 working orbit; 06 debris field;
07 satellite graveyard; 08 mixed viewport; 09 loot; 10 meteors; 11 chase;
12/13/14 top/left/right safe zone; 15 objective; 16 pause; 17 arcade;
18 upgrades; 19 sector select; 20 Sector 2 start; 21 environment; 22 hazard;
23 locked signal; 24 unlocked gate; 25 secret room; 26 lasers; 27 after cache;
28 result; 29 reload/continue; 30 heavy viewport.

Extras: access-key, cache-before-pickup, signal-locked, feedback-streak,
hud-long-timed, audio-settings, arcade-score, before-top-HUD, eight seed frames,
six desktop safe frames, touch-safe frame and portrait frame.
The numbered gate frame uses an explicitly disclosed unlocked-state fixture;
natural flow success is proven by the run log, not by that staged composition.

## REGRESSIONS

JSON valid; resources 152; object types 145; instances 869.
Missing resources 0; unknown instances 0; invalid colors 0; runtime errors 0.
23 contracts checked with success/negative paths; 15 modules purchased in targeted
QA; save/load, local rewarded flows, audio settings and Arcade checks passed.
The main play event is byte-identical to the base after removing the intentional
camera-composition insertion. Loot positions, hazards, rewards, secret graph and
mission data are unchanged by world19. No new feature, sector, currency or plugin.

## REMAINING

No detected gameplay blocker in the tested paths. One first-flight transition
interval of 83.2 ms remains; small isolated scheduling/GC intervals remain too.
This report does not promise zero stutter on every device or exhaustive coverage
of every generated viewport. Physical-device and production-Yandex verification
remain outside these localhost checks.

## COMMIT

Implementation and QA evidence commit on main:
`c835ef9f03dff4227da3541d22d3342fc4d6ffae`.
The following documentation-only commit records delivery verification; it does
not change the tested runtime. Its hash is HEAD in the final handoff.

## PUSH

SUCCESS: implementation pushed to origin/main; `git ls-remote` returned
`c835ef9f03dff4227da3541d22d3342fc4d6ffae`, equal to local HEAD at verification.
Tracked working tree was clean. Local build answered HTTP 200 on port 4236.
This delivery record is committed and pushed afterward, with final HEAD checked
again in the handoff. The pre-existing
user archive `screenshots/FullReleaseRebuild14/FullReleaseRebuild14.zip` is retained
untracked and is not part of this pass.

## VERDICT

READY FOR USER FINAL MANUAL TEST

This is a readiness verdict for the user's final manual test, not a claim of
production Yandex certification or freedom from all platform-specific issues.
