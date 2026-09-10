# O Condutor — verification

Production preview on the selected `experience/sinapse` worktree, 10 September 2026. The original app, Abisso and Membrana remain separate. Earlier `docs/verification.md` and project-dialog captures describe the previous version, not this game.

## Reproducible checks

- `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- `node --experimental-strip-types scripts/conductor-engine.test.mjs`: normalized diagonal movement, pause, pulse cooldown, sequential locked bridges, corridor constraint and two fresh complete traversals. Node may print its harmless module-type inference warning for the import-free TypeScript file.
- Chromium 151 through Playwright with software WebGL. Desktop 1440 × 900; touch-emulated portrait 390 × 844; width checks at 320, 390 and 768. These are browser checks, not physical-phone or medium-laptop measurements.

Local evidence is in `.impeccable/review/conductor/`. `verification.json` records a complete three-connection journey using real keyboard events on desktop and portrait, actual touch-event joystick movement and Pulse, replay, Escape and initiating-focus restoration, stable paused time, explicit resume and offscreen pause. No game canvas is present before Play; the background canvas is absent while playing. No project listing or dialog remains.

The no-JavaScript page contains the geometric study and contact link. Reduced motion has zero canvases and zero running animations. Scoped axe WCAG 2 A/AA and 2.1 AA checks found no violations in the supplied game completion and reduced states; this is not a claim of exhaustive assistive-technology coverage.

## Recovery and budget

`resilience.json` records no-WebGL, actual `WEBGL_lose_context`, blur/pause/resume and synthetic frame-budget checks. Failure retains the still study, manual retry and contact; it never writes a motion preference. The terminal budget path was exercised by deliberately blocking every animation frame for 110 ms.

An earlier bursty 95 ms interval workload did not trigger the terminal budget within 22 seconds. That test did not establish that the renderer's sampled mean exceeded its 46 ms threshold. The deterministic per-frame test verifies the fallback path, not smoothness under every intermittent workload. The renderer gives each tier a 2.2-second warmup and a 2.2-second sample window, then lowers resolution or stops continued rendering. A GL call already executing cannot be interrupted.

## Initial-page measurement

Lighthouse 13.4.1, Chrome 151, production build, local server, no Play action. The initial-page scores do not measure gameplay frame rate. Reports remain in the conductor evidence directory; the post-audit browser-state probe was unavailable because Lighthouse closed its page.

| Profile | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop | 100 | 100 | 100 | 100 | 0.6 s | 30 ms | 0 |
| Simulated mobile | 85 | 100 | 100 | 100 | 2.6 s | 480 ms | 0 |

These measurements followed the second and final unattended correction batch. The full input journey and all four recovery checks also passed on this build. Final correction results and the independently scored scope belong in `condutor-finish-verdict.md`; no score from the former project-list version is reused.

## Review boundary

The build's two batched visual inspections are closed. The one design detector run returned exit 0 with no primary findings; its advisories concerned undocumented color/type values in the existing design record, including new game accents. The fresh review in `condutor-finish-review.md` requested F1 movement after Pulse, F2 clean final ribbon joins/dot, and F3 a visible entry continuation.

The final scoped verdict is **fix**, not ship: F1 and F3 are resolved. F2 is partial: the rectangular overlap fragments and dot wedge are resolved, but solid pale triangular fill remains outside the rounded lower b/d corners. Both unattended correction batches are exhausted. The preview remains available; another correction round or acceptance of the current finish requires the user's decision. `DESIGN.md` and its sidecar still describe the earlier project surface and are not yet refreshed: the finish-documentation handoff follows that decision and the last correction. No whole-surface approval is claimed.

60 fps on a medium laptop remains a target requiring physical-device profiling. No backend, account, third-party scene asset, external form submission, deployment or push was added. Suggested cuts for half the rendering budget are in the README.

Subsequent release decision: after the spark-reward extension, the user accepted the playable version and explicitly requested merging and pushing it to `main`. This accepts the current preview for that release; it does not change F2 to resolved or turn the earlier scoped review into whole-surface approval. The measurements above remain the pre-spark results.
