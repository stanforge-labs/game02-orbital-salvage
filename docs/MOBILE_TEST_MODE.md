# Mobile Test Mode — World20

Open the localhost browser build → DEV → **MOBILE TEST MODE**.
Also available with the existing explicit `?dev=1` gate.
The tool is not shown in normal production gameplay.

## Controls

- Presets: 360×640, 375×667, 390×844, 393×873, 412×915, 430×932,
  720×1280, 1280×720.
- Portrait, Landscape, Rotate, Reset viewport.
- Touch simulation: mouse press/drag uses the existing touch steering handler.
  Merely moving the mouse does not steer. Disable it for keyboard/mouse checks.
- Safe area: green reference inset (24 top/bottom, 16 sides).
- UI bounds: DOM controls and native HUD bounds.
- Gameplay bounds: purple ship composition safe area.
- Hazard hitboxes: diagnostic outlines, never production art.
- Telemetry: actual inner viewport, aspect, orientation, host DPR, UI scale,
  input mode, approximate FPS, instance count and game state.
- Close test: destroys the child game and resumes the paused parent flight.

The tool uses a real iframe viewport, not a stretched screenshot. CSS scaling
only fits that viewport on the desktop. Controls, pause, sectors, upgrades and
Arcade run inside the same tested game build. Portrait retains rotate overlay.

## Save safety

Before any child game script runs, the emulator supplies a private in-memory
copy of browser storage. Child writes, resets and DEV grants do not persist to
the user's real game save. Closing and reopening discards test changes.
The main game's save implementation is not changed. The parent remains paused.
The child uses localhost ad fallback and never tries to fetch production SDK
just because an iframe has an empty hostname.

## Limits

This is a desktop viewport/input emulator, NOT physical Android verification.
DPR is reported from the host, not spoofed. GPU, thermal throttling, browser
chrome, actual notches and the Yandex wrapper/production ads require device QA.
Safe-area guides are explicit reference insets, not a claim of native notch
emulation. DOM UI bounds do not represent pixel-accurate glyph boundaries.

World20 also fixes a real resize bug exposed by rotating this tool: the prior
manual DPR resize left a stale scale on the PIXI scene container. Rendering now
applies resolution once, not both as DPR and scene scale. Camera zoom is unchanged.
