# Sinapse líquida — O Condutor

This is the selected Sinapse implementation for Bruno De Masi’s portfolio. The former project-list surface at `#reef` is now **O Condutor**: a short, optional walking game that repairs three connections and resolves into the `bdm.` mark. The portfolio’s real biography, organisations, language list, and contact links remain ordinary HTML; the game does not invent project case studies or require completion.

Selected for `main` after the user accepted the playable version and its spark reward. The earlier lower-corner fill remains as described in the [scoped verdict](docs/condutor-finish-verdict.md). Base-game performance measurements and their limits are in [verification](docs/condutor-verification.md); the later light-gamification checks are in [sparks verification](docs/sparks-verification.md). The design-system record has not yet been refreshed for the game.

## Run

```bash
npm ci
npm run dev -- --hostname 0.0.0.0 --port 3101
```

Open `http://localhost:3101`. No environment variables, account, external data service, or audio are required.

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start -- --hostname 0.0.0.0 --port 3101
node --experimental-strip-types scripts/conductor-engine.test.mjs
```

Next 16.3.4, React 19.2.3, React Three Fiber 9.7.0, and Three 0.186.0 are used locally. Fonts are self-hosted npm assets; a build does not fetch Google Fonts.

## Folder map

```text
src/app/
  page.tsx                    Server entry
  layout.tsx                  Metadata and local variable fonts
  globals.css                 Editorial layout, responsive and still states
src/lib/portfolio.ts          Frozen biography, languages, organisations and real links
src/components/sinapse/
  portfolio.tsx               HTML portfolio, motion preference and game hand-off
  world.tsx                   Progressive ambient filament renderer
  geometry.ts                 Procedural background geometry
  shaders.ts                  Ambient renderer shaders
  static-filaments.tsx        Code-native static background artwork
  types.ts                    Ambient renderer input contract
src/components/conductor/
  engine.ts                   Import-free walking, collision, gates and level geometry
  collectibles.tsx             Seven instanced sparks and their pickup motion
  experience.tsx              Accessible stage, controls, pause and static study
  world.tsx                   Explicitly loaded game canvas and its frame budget
  shaders.ts                  Ribbon and footprint shaders; no full-screen pass
  character.tsx               Mercury walker geometry and gait
  metal.ts                    Procedural walker material
scripts/
  conductor-engine.test.mjs   Node type-stripping tests for the simulation
docs/
  archaeology.md              Factual source inventory and editorial limits
  condutor.md                 Approved O Condutor direction contract
  assets.md                   Asset provenance
```

## O Condutor

The stage is available as a geometric still study before the game WebGL canvas. The game canvas loads only after an explicit **Play the Conductor** action. A falling mercury drop forms into a walker, then the visitor follows authored `b`, `d`, `m`, and dot paths. A pulse beside each next gate restores its bridge; all three gates must be repaired in order. Completion raises the camera to the `bdm.` plan.

The game is focused within its play area. Controls are native and optional:

- WASD or arrow keys walk; Space sends a pulse.
- Touch uses the on-stage stick and **Pulse** button.
- Pause is explicit; window blur, a hidden tab, leaving the stage, or moving focus away pauses as well. Resume is explicit.
- Escape exits to the page. Normal page scrolling and every non-game link remain available.

Seven loose sparks now sit on the existing route. Walking into a live spark collects it automatically, once per run. Collecting all seven gives the mercury walker a crooked halo and the honorary title **Employee of the void. Salary: absolutely nothing.** It is purely cosmetic: no new button, speed bonus, score, countdown, account or required collection. The halo appears before the final connection, so walking continues with it equipped. **Walk again** resets the collection and reward; nothing is saved or sent elsewhere.

Pickups use two instanced draw calls and a short simulation-timed arc; the award reuses the character's existing geometry. Pausing also freezes the pickup/halo motion. The native counter and polite announcements expose collection status without moving focus. No extra rendering pass, texture, sound, library or backend was added.

Reduced motion starts with the still study and no game canvas. A visitor can enable motion before playing. A WebGL creation/context failure or the game’s budget fallback leaves the still study available with a manual retry; no essential portfolio content depends on the canvas.

While the game is mounted, it owns the only live canvas: the ambient Sinapse background is unmounted, along with its continuous input and scroll work. Exiting starts a fresh ambient-renderer attempt when motion remains enabled.

## Game rendering budget and fallbacks

The game starts at DPR 1 on desktop and mobile. Small viewports use lower character geometry without reducing the initial pixel resolution. A sustained frame-budget overrun selects DPR 0.7 and the low character setting: fewer lathe, capsule, sphere, torus, and bead segments, plus the lower-cost procedural metal shader. The canvas uses no antialiasing and the game has no postprocessing, environment pass, shadow map, or external texture.

The game checks visible wall-clock windows only after a warm-up period. A sustained expensive window first selects the low setting; another sustained expensive window stops the canvas and offers the still edition. This is a protective fallback, not a measured frame-rate claim.

If the low setting needs roughly another half-budget reduction, preserve the readable path silhouette and reduce authored detail in this order: halve ribbon cross-strips (8 to 4), dust points (180 to 90), retained footprints (96 to 48), and pulse-ring segments (80 to 40). Those are proposed cuts, not measurements. Do not remove the still study, controls, or native portfolio content.

## Historical context

The initial request asked for three comparative worktrees and a project-browsing experience. That request is retained as history in the archaeology and earlier documentation; it is not the active delivery requirement for this selected Sinapse worktree. The active requirement is the approved O Condutor replacement at `#reef`.

Historical verification and finish-review files are retained as records. They do not state a current O Condutor score or substitute for fresh production measurement.
