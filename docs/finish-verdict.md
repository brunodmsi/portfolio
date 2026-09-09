## verdict

Verdict pass 1, restricted to S1–S3 from docs/finish-review.md. All twelve original screenshot paths were reopened and contain valid production recaptures. Evidence also includes sampled corrected source, the updated verification.json, and robustness.json; no browser, detector, or broader design review was run.

- S1 — resolved. The unchanged visible wordmark now has the accessible name “demasi.dev — Bruno De Masi, back to surface”. Motion names include the same visible “Motion on/off” or “Retry motion” text. The updated normal and reduced accessibility results are empty, with WCAG 2.1 A included by the capture harness; source and captured control data corroborate the name correction.
- S2 — resolved. FrameBudget now measures raw visible elapsed time, resets at tier/visibility boundaries, checks without a frame quota, and stops the frame loop before entering the still edition. robustness.json records the explicit 110 ms-per-rAF failure injection reaching still-budget in 1,441 ms with zero canvases and zero animations; a manual retry remounted and reached ready. This verifies the recovery path, not hardware fps or the Lighthouse target.
- S3 — resolved. fallback.png now shows “Retry motion”, “Still view · Retry motion to reconnect”, and “Follow the connections.” The diagnostics confirm the same effective static behavior after initialized-context loss, zero remaining canvases/animations, and no errors. The genuine content and static filament composition remain visible.

No material regression attributable to the correction batch was identified in the supplied recaptures.

## remaining

Clear for S1–S3. This ship disposition covers the scored fixes only; it does not certify the whole surface again, moving contrast, physical-device performance, or 60 fps. The original review remains intact and final design documentation is the separate finish handoff.

disposition: ship
