# Production / Local QA separation

`game.json` and existing PLAY/phone workflows remain LOCAL QA source builds.
They intentionally retain developer tools and the old localhost SDK substitute.
Never upload those exports to Yandex.

Production command: `powershell -File scripts/build-yandex.ps1` from this project.
Install build-only pinned dependencies first if absent:
`npm ci --prefix tools/release`.

The production pipeline generates ignored `release-game.json`, removes developer
branches and the mobile emulator before export, excludes DEV objects, switches to
`assets/game/yandex-production.js`, removes source-map references and replaces the
engine's debug-draw renderer with an inert compatibility implementation.
No query string can restore removed code. Production has no localhost ad success.

The builder refuses to overwrite an existing versioned ZIP. Preserve/rename a
previous candidate explicitly before a new build. Packaging calculates SHA256,
checks index/path/size constraints and extracts to a unique `_tmp-export` folder.
Run the tests against that folder's local server; SDK transport fixtures remain
outside the archive. See `scripts/yandex-qa-lib.js` for that test-only boundary.

Developer tools in a browser can always modify an arbitrary client-side game via
generic JavaScript/engine APIs. This release removes dedicated cheat/UI/query
entry points; it does not claim impossible protection against arbitrary code
execution in DevTools. There is no server-authoritative anti-cheat economy.
