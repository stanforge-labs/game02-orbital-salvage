# World20 — layered environment generation

The deterministic gameplay generator (Release16/17) remains the owner of region
positions, resources, hazards, mission anchors, keys and secret progression.
World20 adds a pure presentation stage after Polish19. It does not move loot or
change any reward, collision, camera or movement parameter.

## Hierarchy

1. Existing seed → 9/11 region graph with non-horizontal spanning links and
   optional local cross-links. `routes20` describes their roles; it does not
   invent a new navigation/collision system.
2. Region → weighted thematic large scene palette, two placement attempts per
   region with multiple candidate sites.
3. Large scene → connected original modular artwork, broken edges and retained
   negative space, rather than one satellite icon.
4. Regional medium constructions → up to five candidates around each region.
   Actual graph links also receive midpoint construction traces where clear.
5. Off-route coverage → jittered 2D candidate sites, only where an existing
   composition is not already close.
6. Micro debris → small, faint fragments outside the scene silhouettes.

The primary/side/risk routes are inherited from the working mission graph.
No new loot branch, contract or economy is introduced. Thus this pass improves
environmental route composition, not the core mission graph architecture.

## Placement guarantees

- Maximum 110 composed scenic instances, 160 micro pool slots (150 occupied cap).
- Same large family: at least 800 world units.
- Related silhouette group: at least 650 world units, even across different assets.
- Regional large palette weights are 50/30/20; collision/spacing rejection can
  alter the final observed frequencies.
- Conservative scene radius: 0.47 × sprite width; scene separation adds 45.
- Loot/events/signal/key/gate clearance: scene radius + 72.
- Station clearance: scene radius + 300.
- Hazard clearance: scene radius + hazard size + 60.
- Decorations have no colliders and never physically close a route.
- Existing mission POIs keep their exact indices and coordinates; local hardware
  is visually subordinate to large scenes.
- All random selection is an independent seed-derived stream. Re-running the
  stage is deterministic and cannot consume gameplay randomness.

## Density and performance

Large scenes are 260–315 world units wide, medium scenes 105–159. SVG padding
means visible hardware occupies only part of that footprint. Small fragments
are dimmer and have no reward glow or pulse.
The existing pools are reused: ProcPOI, Scenic18, ProcDecor. No new scene
instances are created. Camera-rectangle culling includes a full sprite margin.
No environment generation runs in the frame loop.

Run `node scripts/world20-seeds.js` for 100 structural seed/sector cases.
`docs/world20-seeds.json` records actual seed IDs and geometry proxies.
Coverage is not a substitute for visual inspection or a gameplay timing claim.

Build: `node scripts/apply-integrated-pass10.js`, then the existing export script.
