# BUILD

ZIP: release/OrbitalSalvage_Yandex_1.0.0_closeout_final.zip

SHA256: 110E4C820112195FC7AACEFDC65A3E8CE49AA33646C64D36C99CA3040C3EE23E

Extracted test root: _tmp-export/yandex-zip-d6113e68ff1849a991ba891de4da6d28. HTTP: 127.0.0.1:4250.

Commit: the commit containing this report (release: complete yandex pre-draft closeout); exact hash delivered in final response. Archive was created before QA and has not changed.

Original D3642B… candidate was verified, then superseded. Preserved old ZIPs. Production changes: exact title, selection/drag prevention; WebKit orientation API capability guard; restore purchased Scanner early meteor warning (800 vs 640 units). No movement/economy/world/secret rework.

# TITLE

PASS. Rendered menu and project name: Космический сборщик. No uppercase or English alternate title in production game code. RU only.

# STATIC ZIP

PASS. Root index.html; 303 files, 7,129,503 bytes unpacked. ASCII paths, no spaces/backslash/absolute entries, no maps/docs/screenshots/QA fixtures. Missing resources 0; unknown instances 0. Evidence: yandex-artifact-audit.json.

# SDK STATIC

PASS. Official /sdk.js, single bounded initialization, late SDK recovery; i18n.lang read with RU fallback. Exact extracted adapter passed closeout-adapter.json. Actual Yandex service not locally simulated as proof of live integration.

# GAME READY

PASS local contract: intent deferred until ready UI/fonts; ready callback once. Draft verification still required.

# GAMEPLAY API

PASS local contract: transitions and pause/resume, duplicate calls guarded.

# ADS LOCAL

PASS. 24 cases, three rewarded actions × success/cancel/error/duplicate reward/duplicate close/repeat click/busy/late old callback. Production handler exercised through local SDK transport; reward at most once, audio suspended, phase frozen. No fake transport is shipped. No custom interstitial.

# DEV REMOVED

PASS. Static AST and runtime query/hotkey/global tests: yandex-security.json. No production QA observation hook; hooks used by tests are injected outside archive.

# CONTEXT MENU

PASS event prevention on canvas and available DOM buttons in menu/play/pause/journal/result/upgrades/sector select. See closeout-dom.json. Browser-native menu UI itself is not an OS GUI test.

# SELECTION / DRAG / LONG PRESS LAYER

PASS DOM event layer, user-select/-webkit-user-select/-webkit-touch-callout CSS and mobile long touch selection check. Physical Android/iOS system callout is NOT VERIFIED, not claimed as tested.

# SAVE

PASS local adversarial parser cases: empty/null/array/object/malformed/nonnumeric/NaN-like/negative/huge/missing fields/partial settings. Menu recovers, no uncaught error. Negative and huge user-edited balances are not clamped; this is resilience testing, not anti-cheat. All module reloads validated. Natural persistence: see each run below.

Cloud Save OFF. No Player API / IAP; no cloud feature invented.

# CHROMIUM

PASS (153.0.8010.12). Fresh context, menu/start/movement/loot/two contracts/pause/resume/journal/station/result/earned upgrade purchase/sector select/reload/death fixture. Runtime errors 0; critical resources 0. Purchased module and credits retained after reload in each engine; all 15 effects separately verified in Chromium.

# FIREFOX

PASS (153.0). Fresh context, menu/start/movement/loot/two contracts/pause/resume/journal/station/result/earned upgrade purchase/sector select/reload/death fixture. Runtime errors 0; critical resources 0. Purchased module and credits retained after reload in each engine; all 15 effects separately verified in Chromium.

# WEBKIT

PASS (26.5). Fresh context, menu/start/movement/loot/two contracts/pause/resume/journal/station/result/earned upgrade purchase/sector select/reload/death fixture. Runtime errors 0; critical resources 0. Purchased module and credits retained after reload in each engine; all 15 effects separately verified in Chromium.

# RESPONSIVE

PASS tested document/card bounds: 1920×1080,1600×900,1536×864,1440×900,1366×768,1280×720,1917×920; mobile 844×390,780×360,720×360,640×360; portrait 390×844,412×915. No page overflow. Mobile state fixtures cover menu/play/pause/journal/result/fail/upgrades/sector select. See closeout-dom.json and closeout-mobile-layout.json. All 37 screenshots reviewed in contact sheets; representative 640×360 gameplay, journal, pause, upgrades and portrait/secret frames also opened individually. responsive-* are desktop resize checks; mobile-* use touch-enabled mobile contexts. Contact sheets are QA material, not store screenshots. Not a claim of exhaustive physical-device UI QA.

# MOBILE TOUCH

PASS in Chromium mobile/CDP touch. Android/iPhone-like dimensions are emulations, not physical devices.

# ARCADE TOUCH

PASS. Touch left/right, auto-fire/score 140, lives 3→2→1→0, restart, UI pause/resume, SDK platform pause, exit; main save unchanged. No gameplay state writes in this Arcade run.

# BACKGROUND / LIFECYCLE

PASS controlled event contract, 10 duplicate pause/resume cycles. Position/HP/run/mission/phase frozen, AudioContext suspended; Arcade clock frozen. Real page bringToFront observation: hidden=false, focus=true; this headless engine did not change visibility. Consequently **real OS background NOT VERIFIED**, explicitly separate from handler tests. No computer-use performed.

# NATURAL RUN 1

PASS — 474.0 seconds; initial seed 3582882524; Sector 2 at 343.1 seconds. Fresh storage, read-only coordinates, real keyboard/buttons; no credits/HP/position/progression writes. Evidence closeout-natural-1.json, condensed timeline closeout-summary.json. Six checkpoints/cache/reload validated by report assertions, not merely script exit status.

# NATURAL RUN 2

PASS — 596.8 seconds; initial seed 2872852834; Sector 2 at 426.7 seconds. Fresh storage, read-only coordinates, real keyboard/buttons; no credits/HP/position/progression writes. Evidence closeout-natural-2.json, condensed timeline closeout-summary.json. Six checkpoints/cache/reload validated by report assertions, not merely script exit status.

# DEATH

PASS. Keyboard-only hazard approach, HP 3→2→1→0, death and fresh flight. 23.5 seconds, no HP or position writes. Second Chance separately verified by ads fixture.

# CONTRACTS

23/23. Isolated input-state fixtures around actual production pickup/stage/settlement/save handlers. Positive payout and empty/incomplete negative cases. These are not 23 natural playthroughs. Evidence yandex-contracts.json.

# MODULES

15/15 runtime. Fixtures fund purchases and arrange inputs, but never write module levels or replace effects. Actual purchase/save/reload/reset/refund handlers. Visual attachment visible after purchase/reload, absent after reset for each module.

| Module | Price | Expected | Before | After | Reload | Reset | Refund | Verdict |
|---|---:|---|---:|---:|---:|---:|---:|---|
| cargo | 180 | capacity permits ninth item | 0 | 1 | 1 | 0 | 135 | PASS |
| engine | 180 | +10% thrust/speed | 190 | 209.00000000000003 | 209.00000000000003 | 182.15252832256465 | 135 | PASS |
| hull | 200 | 3 to 4 health | 3 | 4 | 4 | 3 | 150 | PASS |
| magnet | 140 | pickup at 36 units | 0 | 1 | 1 | 0 | 105 | PASS |
| radar | 160 | station ETA | 0 | 1 | 1 | 0 | 120 | PASS |
| insurance | 180 | 25% cargo recovery | 0 | 25 | 25 | 0 | 135 | PASS |
| shield | 210 | absorb first damage | 2 | 3 | 3 | 2 | 157 | PASS |
| assist | 170 | +3 per collected slot | 12 | 15 | 15 | 12 | 127 | PASS |
| contract | 190 | +20% contract payout | 100 | 120 | 120 | 100 | 142 | PASS |
| repair | 175 | critical hull +1 once | 1 | 2 | 2 | 1 | 131 | PASS |
| scanner | 185 | early meteor warning | 0 | 1 | 1 | 0 | 138 | PASS |
| buffer | 240 | 1.1 seconds invulnerability | 0 | 0.9997000000000001 | 0.9999999999999999 | 0 | 180 | PASS |
| containment | 260 | first radiation strike absorbed | 0 | 1 | 1 | 0 | 195 | PASS |
| salvage | 280 | +20% energy value | 30 | 36 | 36 | 30 | 210 | PASS |
| decoder | 300 | +60 secret cache | 0 | 60 | 60 | 0 | 225 | PASS |

# SECRET

PASS exact-hash natural evidence. Earlier incomplete runs are excluded. A previous navigator failure came from omitted read-only secretStage telemetry and was corrected in QA only.

# PERFORMANCE

300.252 seconds continuous active keyboard traversal; 18005 frames. p50 16.70, p95 17.00, p99 17.20, max 19.70 ms. >20/>25/>33.3/>50/>100ms: 0/0/0/0/0. Instances 865 at start/1m/3m/5m and all 10 flight restarts. Heap ~26.1MB→24.3MB before restarts; allocation/GC oscillation, no monotonic growth. Headless desktop near-station traversal, concurrent QA possible; do not extrapolate to every device/heavy region. Evidence closeout-performance-active.json.

Full natural run 2 profile (including initial start, Sector 2 and secret): 35,554 frames; p95 17.0ms, p99 17.3ms, max 66.7ms. >20/>25/>33.3/>50/>100ms: 5/4/2/1/0. The initial start spikes coincide with first audio unlock (3.6ms measured) and world generation (19.3ms), while individual save writes were ≤0.1ms; correlation is not proof these explain all delay. Later isolated 20.2ms (chase) and 32.6ms (return) frames had no matching instrumented long handler. No recurring >33.3ms traversal stalls observed. No claim of zero spikes across the complete session. Instances remained 865; heap ~25.1→23.8MB. Detailed events: closeout-performance.json.

# STORE MEDIA

NOT PRESENT: no approved store icon/cover/screenshot package found. Favicon is not a store-media approval. Exact missing checklist: YANDEX_CONSOLE_FINAL.md. This is local unfinished publishing material, not Draft-only verification.

# CONSOLE DATA

READY text values in YANDEX_CONSOLE_FINAL.md; complete media package NOT READY. Russian only, Landscape, Cloud OFF, Monetization ON/rewarded. Requirements revision 18 August 2026 rechecked 15 September 2026 against official Yandex documentation.

# DRAFT-ONLY REMAINING

- Actual Yandex SDK / Debug Panel / iframe / CSP.
- Live production rewarded playback, startup ad if supplied by platform.
- Actual platform moderation.
- Physical Android/iPhone browser/system-callout checks if desired (emulation does not establish them).

# LOCAL REMAINING / VERDICT

Natural progression checks passed.

Store media package is missing; requested checklist supplied, not a false PASS. **NOT READY** as a complete publication package. Do not label READY FOR MODERATION. Remaining work is not exclusively Draft-side.
