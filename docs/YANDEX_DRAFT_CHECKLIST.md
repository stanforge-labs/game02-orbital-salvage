# Yandex Draft checklist

Checked means the available local/export verification, NOT actual platform delivery.
The final report records the final artifact hash and remaining platform checks.

- [x] production ZIP; extracted for testing
- [x] root index.html, ASCII filenames, size below 100 MB
- [x] Yandex SDK init implementation, local API contract test
- [x] Game Ready deferred and once
- [x] rewarded SDK callback integration
- [x] ad failure / duplicate callback handling
- [x] interstitial decision: no extra interstitial; platform startup ad events handled
- [x] pause during ads / SDK events
- [x] pause on focus loss implementation (actual tab/background QA remains unverified)
- [x] audio pause
- [x] save/load and corrupt JSON recovery
- [x] desktop sizes
- [x] mobile browser emulation
- [x] landscape
- [x] portrait rotate
- [x] browser resize / viewport
- [x] no DEV activation through query or shortcuts
- [x] no shipped developer cheat controls
- [x] no active debug drawing implementation
- [x] no uncaught errors in completed local tests
- [x] assets/license inventory; OFL and engine license files included
- [x] first full natural progression
- [x] second full natural progression — see final report for artifact chronology
- [x] Sector 2
- [x] secret and cache
- [x] Arcade and pause
- [x] result/death fixture
- [x] extracted ZIP smoke test — see final report

## Required in the Yandex console (NOT VERIFIED here)

- [ ] Upload the ZIP to the intended game's Draft (do not create a duplicate game).
- [ ] Declare Russian, desktop + mobile, landscape. Do not claim cloud saves.
- [ ] Explain that completed flights/upgrades persist; unfinished flight restarts.
- [ ] Confirm SDK / Game Ready / language indicators in the platform Debug Panel.
- [ ] View each of the three real rewarded actions; test close and unavailable ads.
- [ ] Verify platform startup ad and return from ad/window switch.
- [ ] Repeat on physical Android Yandex/Chrome and iPhone Safari.
- [ ] Fill listing, age rating, controls, promo assets and monetization settings.
- [ ] Confirm no CSP/network/console errors inside the actual iframe.

Do not infer these checks from the local SDK transport substitute. It is not
contained in the ZIP and cannot verify your advertising account or inventory.
