# Yandex release requirements — 2026-09-15

Official documentation consulted directly. Requirements page last revision:
2026-08-18. PASS below means the named local check, not platform moderation approval.
Platform account settings and actual ad delivery remain NOT VERIFIED until Draft.

| Requirement | Project / fix | Status | Official source |
|---|---|---|---|
| SDK integration | Dedicated production adapter, official /sdk.js loader | PASS code/local contract | [SDK](https://yandex.ru/dev/games/doc/ru/sdk/sdk-about) |
| Delayed initialization | Single init promise; bounded startup wait; late SDK retained | PASS code | [SDK](https://yandex.ru/dev/games/doc/ru/sdk/sdk-about) |
| Game Ready | Deferred until menu/resources/fonts usable; one notification | PASS local | [Loading](https://yandex.ru/dev/games/doc/ru/sdk/sdk-game-events) |
| Gameplay start/stop | State transitions, pause, menus, Arcade, background | PASS local | [Gameplay](https://yandex.ru/dev/games/doc/ru/sdk/sdk-game-events) |
| Platform pause/resume | game_api_pause/resume subscription; startup ads covered | PASS simulated events; Draft NOT VERIFIED | [Events](https://yandex.ru/dev/games/doc/ru/sdk/sdk-events) |
| Rewarded | x2, second chance, reroll use one adapter | PASS callbacks | [Ads](https://yandex.ru/dev/games/doc/ru/sdk/sdk-adv) |
| Reward confirmation | Only onRewarded followed by close; errors/cancel give nothing | PASS | [Ads](https://yandex.ru/dev/games/doc/ru/sdk/sdk-adv) |
| Duplicate ad clicks | Busy guard, once-only settlement | PASS | [Ads](https://yandex.ru/dev/games/doc/ru/sdk/sdk-adv) |
| Interstitial | No additional interstitial introduced; no active-flight ad interruptions | N/A | [Ads](https://yandex.ru/dev/games/doc/ru/sdk/sdk-adv) |
| Ad audio/game pause | Suspend AudioContext and all gameplay/UI mutation events | PASS local | [Events](https://yandex.ru/dev/games/doc/ru/sdk/sdk-events) |
| Guest saves | Existing localStorage, no purchases/account requirement | PASS local | [Save](https://yandex.ru/dev/games/doc/ru/requirements/1/9) |
| Cloud / Player API | Not used, must not advertise cloud support | N/A | [Player](https://yandex.ru/dev/games/doc/ru/sdk/sdk-player) |
| Corrupt storage | Primitive/malformed payload recovery before legacy readers | PASS | [Save](https://yandex.ru/dev/games/doc/ru/requirements/1/9) |
| Save milestones | Delivery, upgrades/reset, ad results; current flight is not a checkpoint | PASS local; disclose flight restart | [Save](https://yandex.ru/dev/games/doc/ru/requirements/1/9) |
| Language detection | Reads environment.i18n.lang on startup; RU-only release fallback | PASS code; Draft indicator NOT VERIFIED | [Language](https://yandex.ru/dev/games/doc/ru/requirements/2/14) |
| Desktop field <=2:1 | Cap only ultrawide desktop presentation, centered full height | PASS 1917×920 | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Keyboard/mouse | Existing movement retained; browser reserved keys no cheats | PASS local | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Mobile / rotation | Dynamic visualViewport, safe areas, landscape/rotate overlay | PASS emulation; device NOT VERIFIED | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Long press/context menu | Selection/callout/contextmenu disabled | PASS code | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Focus | Pause predicate and native blur/focus/visibility listeners implemented; automated tab switch kept document focused | NOT VERIFIED actual browser/background; SDK pause PASS | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| No developer UI | Removed at build time; no query activation or reward mock | PASS local | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Console/network | Browser harness checks plus extracted ZIP smoke | See final report | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Licenses | Existing CC0/OFL/project-original; license notices included | PASS inventory | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| External data/accounts | No external account, purchase, user data endpoint or cloud claim | PASS inventory | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements) |
| Archive | One root index.html, ASCII paths, <100 MB unpacked | PASS | [Upload](https://yandex.ru/dev/games/doc/ru/console/add-new-game) |
| Draft / iframe / SDK Debug Panel | Must test uploaded archive in platform environment | NOT VERIFIED | [Testing](https://yandex.ru/dev/games/doc/ru/console/add-new-game) |
| Listing / rating / promo / distribution | Console metadata not edited by this task | NOT VERIFIED | [Upload](https://yandex.ru/dev/games/doc/ru/console/add-new-game) |

The SDK substitute used by automated tests lives only in scripts/yandex-qa-lib.js,
not in the exported files or archive. A successful local callback-contract test
does not prove monetization/account configuration or actual ad inventory.
