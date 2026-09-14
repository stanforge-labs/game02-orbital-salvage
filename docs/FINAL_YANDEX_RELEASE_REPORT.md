# INITIAL AUDIT

2026-09-15. Base: main, 1eebdfb3dbf13a649a04a02c0610a1e5d9726725.
Scope: production isolation and release verification, not another gameplay rebuild.
Original game.json and existing LOCAL QA/phone workflow preserved.

# YANDEX REQUIREMENTS

Official sources and per-requirement scope: YANDEX_RELEASE_REQUIREMENTS.md.
Draft follow-up: YANDEX_DRAFT_CHECKLIST.md. Local tests use a test-only SDK transport;
this is NOT proof of actual Yandex SDK delivery, monetization or moderation approval.

# RELEASE BLOCKERS FOUND

- Export contained developer controls/query activation and localhost rewarded success fallback.
- SDK/platform pause and audio lifecycle were not sufficiently isolated for release.
- Malformed primitive/null local saves could reach legacy readers.
- Arcade Escape exited instead of providing a proper pause.
- Ultrawide desktop presentation exceeded 2:1.
- Engine session telemetry generated an unnecessary external request with HTTP 409.

# FIXED

- Build-time AST removal of developer handlers/UI/hooks and separate production clone.
- Dedicated production SDK/reward adapter; no mock reward or URL switch in ZIP.
- Platform pause blocks gameplay events and captured input; AudioContext suspended.
- Corrupt JSON guard and guarded settings writes.
- Arcade pause/resume/exit, mobile-accessible pause button; updated Escape help.
- Ultrawide desktop presentation capped at 2:1, full height; ordinary mobile layout retained.
- Optional GDevelop telemetry disabled in production project properties only.
- Late SDK success after startup timeout can restore rewarded requests; accelerated timer fixture passed.
- Production packaging, license notices, clean root index, extraction verification.

# SDK

LOCAL CONTRACT PASS: singleton init, bounded startup waiting, late completion handling,
one deferred LoadingAPI.ready, transition-based GameplayAPI.start/stop, platform events.
Official /sdk.js used. Russian language read from SDK, RU fallback; declare RU-only.
Actual SDK initialization/Game Ready indicator inside Draft: NOT VERIFIED.

# ADS

All existing rewarded actions use one production adapter: x2 delivered reward,
Second Chance, free reroll. Reward requires onRewarded and closing the ad.
Cancellation/error gives zero; duplicate callbacks settle once; busy guard rejects overlap.
LOCAL fixtures verify x2 cancellation/duplicate success, revival, reroll cancellation/success.
No new interstitial: avoiding unnecessary active-session interruption. Platform startup
advertising pause/resume is handled through SDK events.
Actual inventory/ad account/real video playback: NOT VERIFIED. No fake success in archive.

# SAVE

Natural progression survives reload. All 15 purchases survive reload; reset removes
modules and returns floor(SpentCredits * .75). Credits, tech/progression use existing save.
Corrupted null, array and malformed JSON recover to menu, without uncaught error.
Audio settings persist in effect test. No cloud/Player API; do not advertise cloud save.
An unfinished flight is not a checkpoint: reload preserves settled progression, starts a new flight.
Every possible adversarial malformed numeric field was not exhaustively tested.

# UI

Menu, game, pause, journal, result, death, upgrades, sector selection and reset layouts checked.
No game movement/zoom/economy/world generation changes.
Production shortcut/query test: F3/F4/F6/F7/F8/F9/F10/F11/F12, dev/devhud/qa query,
injected old mobile test flags do not activate tools; exported QA hooks absent.
Browser's own DevTools cannot be disabled by a webpage. This is removal of shipped cheats,
not a claim that arbitrary JavaScript execution cannot edit client state.

# MOBILE

PASS Chromium emulation: 640x360, 844x390, 844x294 reduced usable height,
390x844 portrait rotate. Desktop: 1920x1080, 1600x900, 1536x864, 1440x900,
1366x768, 1280x720, 1917x920. Modal bounds/pause checked; existing dynamic viewport retained.
Physical Android/iPhone, real browser chrome/safe insets, touch Arcade and actual LAN phone
interaction: NOT VERIFIED during this audit. These are not simulated-device PASS claims.

# PERFORMANCE

Evidence: yandex-performance.json and yandex-performance-summary.json.
Continuous natural run 2: 557.379 seconds, 33,476 frames; p50 16.7ms,
p95 17.1ms, p99 17.3ms, max 50ms. Frames >20: 1; >25: 1; >33.3: 1;
>50: 0; >100: 0. Thresholds are strictly greater, so the 50ms frame is not >50.
The spike coincided with first-flight audio unlock/context creation, save writes and
world generation. CPU sample 5.9ms; this does not isolate a single root cause or prove
absence of first-use SVG decode. No recurrent traversal spikes observed in this sample.
Instances remained 865. Heap first 24,908,046, last 34,449,843 bytes;
range 21,507,694–36,161,540 with collection, not a proof of zero long-term leaks.
Ten real restart actions: 865 instances and 11 buttons throughout, sampled audio voices 3–4.
Natural profiling used read-only instrumentation and screenshots, no simultaneous browser QA.
Not a physical-phone 60fps guarantee. Long background/foreground soak remains unverified.

# NATURAL RUN 1

539.038 seconds (8m59s). Fresh storage, real keyboard/click input, coordinate-aware
read-only navigator. No credit/HP/progression/position writes. First contracts, loot,
returns, purchases, multistage mission, Sector 2 unlock, signal/key/gate, six safe points,
secret cache, station/result, reload/continue. Final 11 contracts, 457 credits. Errors: 0.
Evidence: yandex-natural-1.json. This is automated natural control, not a blind human run.

# NATURAL RUN 2

About 560.2 seconds (9m20s). Same fresh-save natural-input method, 11 contracts,
507 credits after reload, secret completed. Errors: 0. Evidence: yandex-natural-2.json.
Run 1 used initial production export; run 2 used the extracted first candidate ZIP.
After these runs: input/audio pause hardening, telemetry removal, late SDK fix and Arcade help correction.
Final ZIP received focused regression and smoke tests; two whole natural runs were NOT
repeated against its exact final hash. Core progression did not change, but chronology matters.

# CONTRACTS 23/23

yandex-contracts.json: 23 distinct contracts, positive completion/payout/save and empty-return
negative case. These are explicit isolated state/position fixtures using actual game handlers,
not 23 natural playthroughs. Two natural runs additionally exercised ordinary and staged missions.

# UPGRADES 15/15

yandex-fixtures.json: all 15 purchase prices, installation, reload and reset/refund checked.
Pool excludes installed modules; completed state reached. Effects fixture separately verifies
buffer, salvage, decoder and containment, including once-only effects. Other effects inspected
in source and exercised in natural runs, but not individually quantified in 15 separate runtime
experiments. Therefore exhaustive per-module effect/visual acceptance is PARTIAL.

# SECRET

Signal -> key -> gate -> route -> six scan pockets -> cache -> return passed twice naturally.
Screenshots 11–16 show actual progression states. 15-lasers shows an inactive timing window;
16-cache is post-collection reward state, not a close-up of the cache object.

# ARCADE

Pointer/autofire, score 100, damage/death, restart, exit and pause/resume tested.
Pool 42 in effect fixture. Main progression reload preserved. Touch-specific interaction and
actual OS background behavior remain NOT VERIFIED. New Escape pause description matches behavior.

# AUDIO

AudioContext and event traces confirm click/hover/pickup/hit/warning/contract/gate/ambience.
Settings reload checked. Platform pause suspends context and blocks input unlock until resume.
This is runtime evidence, not a listening review on physical phone speakers.
Automated tab switch kept document.hasFocus=true; actual blur/background audio QA NOT VERIFIED.

# ASSETS/LICENSES

THIRD_PARTY_ASSETS.md updated: existing Kenney CC0, Exo 2/Russo One OFL,
project-original SVGs and included GDevelop engine license. OFL notices copied into ZIP.
No new art/external asset pack. acorn/acorn-walk/terser are build-only dependencies, not shipped.
No intentional external telemetry endpoint after removal. Local network trace includes
Kaspersky-injected requests from the host environment, not archive code; protection unchanged.
Draft SDK network/CSP remains to be verified on-platform.

# FINAL ZIP

C:\Yandex Games\02 Orbital Salvage\release\OrbitalSalvage_Yandex_1.0.0.zip

303 files; 7,129,302 bytes unpacked. Root index.html, ASCII filenames, no docs/screenshots,
QA transport, source project or test saves. Missing resources 0; unknown instances 0;
developer activation literals checked by AST: 0. Extracted under project _tmp-export and served
independently for menu/start/move/collect/return/result/upgrades/reload/sector/death smoke.
Reproduction: scripts/build-yandex.ps1. Existing archives are never silently overwritten.

# SHA256

9DB3CD88FCB8D7558365FCF2C7C17B4BE9D2C0174A8728A68256A543D8E15655

# REMAINING

- Actual Yandex Draft SDK/Debug Panel/rewarded/startup ad/iframe/CSP verification.
- Actual tab/OS background-resume and physical Android/iPhone testing.
- Exact final-hash two full natural runs not repeated after small final hardening changes.
- Exhaustive individual runtime effects of all 15 modules and touch Arcade not fully proven.
- Listing/rating/promo/monetization settings belong to console preparation, not this ZIP audit.

Screenshots: screenshots/FinalYandexRelease/ (21 numbered captures plus viewport captures).
Not every numbered capture is a close-up; scene descriptions above state the limits.
Git delivery commit is the commit containing this report; use git log -1 --format=%H --
docs/FINAL_YANDEX_RELEASE_REPORT.md. Remote verification is reported in the handoff.

# VERDICT

NOT READY under the requested all-checks-proven gate. Production candidate ZIP is built
for Draft verification, but unverified platform/device scenarios must not be called PASS.
