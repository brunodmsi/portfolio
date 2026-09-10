# Loose sparks — verification

Local delight extension to O Condutor on 10 September 2026. It adds seven walking pickups and a cosmetic halo/title, not a new level, mandatory challenge, or score system. Its contract is in [condutor.md](condutor.md#light-gamification--10-september-2026).

## Checks

- `npm run lint`: passed without warnings after removing an unused lint suppression.
- `npx tsc --noEmit` and `npm run build`: passed.
- `node --experimental-strip-types scripts/conductor-engine.test.mjs`: passed. Covers the existing movement/gates and the new unlock-aware collection, no idle/retrace farming, a complete route collecting all seven before gate three, a one-shot reward, and fresh replay state. Node's existing module-type inference warning is unchanged.
- Production Chromium 151 / Playwright, software WebGL: the full walking route, reward before completion, movement continuing after reward, pause, replay reset and Escape/focus return passed at 1440 × 900 and touch-emulated 390 × 844.
- A real emulated touch-event joystick movement collected the first spark. Subsequent full portrait traversal used real keyboard input; no teleport or test-only game-state mutation was used.
- At 320, 390 and 768 CSS pixels the page did not overflow, progress did not overlap Pause/Exit, and the reward text cleared both thumb controls. At 320 the reward ends 17px before the left stick begins.
- Scoped axe WCAG 2 A/AA and 2.1 AA checks reported zero violations in the supplied desktop/mobile reward states. This is not exhaustive assistive-technology or moving-pixel contrast validation.
- Reduced motion at 390px retained the still study and working continuation with zero canvases and zero running animations. The initial page had no game canvas before explicit Play; only the game canvas was present during play.
- No browser JavaScript/console errors were recorded in the two gameplay runs.

Evidence: `.impeccable/review/sparks/verification.json` and the twelve entry/start/pickup/reward/completion, compact and reduced captures. The final run began at `2026-09-10T02:15:56.699Z`.

The first browser run checked Escape focus before the application's deliberately scheduled next-frame focus restoration. The test was corrected to wait for that event, without setting focus itself. The complete rerun passed; no product change was required for that test timing issue.

## Cost and scope

The seven pickups share two instanced draw calls; the halo reuses existing character geometry with two inexpensive unlit materials. There are no new dependencies, textures, postprocessing passes, audio, network submissions or stored visitor data. Collection and cosmetic motion use simulation time, so the existing pause/visibility controls remain authoritative.

No physical-device frame-rate profiling or fresh Lighthouse run was performed for this addition. The Lighthouse numbers in `condutor-verification.md` predate the sparks and are not a new performance result. A half-budget version can first omit pickup cores (one instanced draw call) and retain the loop silhouette and native count; the cosmetic award does not justify weakening controls or the static edition.

The earlier F2 lower b/d corner-fill finding remains outside this requested extension and is not marked resolved. The prior design-system record is still historical; the local visual and motion decisions for this extension are recorded in the surface brief and README. See [the scoped reward review](sparks-review.md) for the independent judgment of this addition.
