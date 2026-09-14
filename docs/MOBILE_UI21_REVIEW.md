# MOBILE UI21 REVIEW

## Implemented

- Separate phone landscape presentation, scoped to touch/mobile or DEV emulator.
- Canvas and DOM use actual visualViewport dimensions/offsets; safe-area env
  padding on all sides. Mobile backing resolution follows usable pixels × DPR,
  rather than allocating a 1080-logical-height buffer × DPR regardless of size.
- Three compact HUD panels: 54 CSS px high; 48 at usable height <=320 px.
  Two-line contract name, progress/timer/reward; secondary context in journal.
- Station distance moved below left HUD. Navigation prompt moved out of center
  into a compact bottom dock; pause/journal retain 44 px touch targets.
- Existing smooth camera composition has mobile-specific protected margins:
  top safe inset +94 px, bottom +70 px, sides +28 px. No ship position clamp,
  movement/zoom change, or invisible wall. Touch on UI does not steer the ship.
- Mobile menu/journal/pause/settings and native upgrade/sector/result/fail/reset
  panels have compact type, internally scrolling bodies and pinned actions.
  Native action bridge calls existing handlers; rewards/save logic unchanged.
- Optional user-gesture fullscreen button and home-screen hint. No auto fullscreen.
- DEV simulator adds reduced browser heights and simulated safe insets.

## Verification

Three executable QA reports: mobile21-qa.json, mobile21-extended-qa.json,
mobile21-input-qa.json. All pass; captured JavaScript page errors: 0.
Tests use explicit state/input fixtures, not natural playthroughs.

- 640×360, 844×390, 844×300, 640×280; portrait 390×844, 412×915, 360×800.
- All eight existing DEV presets; rotated 844×294 with simulated browser bars
  and top/right/bottom/left insets 8/20/12/28 px.
- Simulated visualViewport 286 px high, offset 10 px, DPR2: canvas height 286 CSS
  px, backing height 572 px. Simulation is explicitly not physical browser chrome.
- Menu, journal, pause, upgrades, sector select, result, fail, reset confirmation,
  generic confirmation, settings, Arcade exit; short journal body scrolls while
  Continue stays visible (footer bottom 273 in 294 px viewport).
- Touch movement and blocked HUD dragging; upward flight minimum ship center Y
  120.29 px versus HUD bottom 60 px in the 640×360 fixture.
- Purchase deducts 500→320 credits and writes existing save; reload shows Continue.
  Native reset cancel, Sector2 launch, localhost rewarded revive/double reward.
- Desktop 1366×768 menu/game HUD regression passes; mobile layout inactive.
- LAN URL tested from PC browser with mobile emulation: http://192.168.10.15:4238/.
  Export refreshed in exports/worldart20, same root as existing PC/phone launch.
- Static audit: valid JSON, 145 object types, 869 instances, 222 resources;
  missing resources 0, unknown instances 0, invalid colors 0.
- All non-event game.json data equal pre-pass HEAD: resources, definitions,
  scene instances and project settings preserved.

## Screenshots

screenshots/MobileUI21: menu, flight, journal, pause, upward safe flight,
seven native/modal states, Arcade, six viewport states, safe insets, reload,
desktop menu/flight, DEV browser-bars/notch, short journal, visualViewport offset,
long timed contract. Screenshots visually reviewed, not only generated.

## Limitations / handoff

No physical Android/iPhone was available to the agent. Actual Yandex Browser /
Safari toolbar transitions and fullscreen support still need phone confirmation.
Ordinary pages cannot forcibly remove system/browser chrome. Browser-provided
safe-area values can be zero; viewport adaptation still operates.
Production ads were not verified; only existing local fallback actions were tested.
No new gameplay, economy, save schema or world-generation changes.

Implementation and available browser QA: DONE. Physical-device confirmation remains.
Commit/push identifier is supplied in the delivery message (this report is included
in that commit); no self-referential hash is embedded here.
