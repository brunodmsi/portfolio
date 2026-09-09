# Sinapse líquida

Bruno De Masi's portfolio as a conducting bundle of wet optical fibers. This is the isolated comparative implementation on branch `experience/sinapse`; it does not replace the original workspace or choose a final concept.

## Run

```bash
npm ci
npm run dev -- --hostname 0.0.0.0 --port 3101
```

Open `http://localhost:3101`. No environment variables or external data services are required. The exact editorial snapshot lives in `src/lib/portfolio.ts` and is traced to `docs/archaeology.md`. Contact uses real email and social links; nothing is sent by the application.

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start -- --hostname 0.0.0.0 --port 3101
```

Next 16.3.4 and React 19.2.3 are kept compatible with React Three Fiber 9.7.0. Three 0.186.0 is inside postprocessing 6.39.5's supported peer range. Fonts are self-hosted npm assets, so builds do not fetch Google Fonts.

## Folder map

```text
src/app/
  page.tsx                    Server entry; semantic content is prerendered
  layout.tsx                  Existing metadata and local variable fonts
  globals.css                 Editorial type, layout, responsive and static states
src/lib/portfolio.ts           Frozen biography, projects, languages and real links
src/components/sinapse/
  portfolio.tsx               HTML journey, native dialog, motion preference, Lenis
  world.tsx                   Persistent canvas, camera, quality and context lifecycle
  geometry.ts                Merged procedural tubes and four material junctions
  shaders.ts                 Commented GLSL and custom optical finishing pass
  static-filaments.tsx       Code-native fallback artwork and project silhouettes
  types.ts                   Mutable renderer input contract
docs/
  archaeology.md             Factual inventory and editorial limits
  concepts.md                Three authorized comparison directions
  implementation.md         Direction contract and review boundary
  assets.md                  Asset provenance
public/licenses.txt          Shader-source attribution and font licenses
```

## Journey and controls

Surface, About, Work, Languages and Contact are native HTML anchors. Desktop wheel scrolling receives Lenis smoothing; touch scrolling stays native. Pointer movement tensions nearby fibers. A press sends an impulse along the bundle, followed by a softer delayed return. Navigation and all essential content remain available before the WebGL module loads.

The four project junctions have different geometry and behavior: Buggy is a silver knot, wt a green helical cable, pi-platform a cobalt crystalline cage, and Flight Tracker a broad pearl orbit. Their accessible `Inspect …` and `Open … details` buttons move the camera into the selected junction and open a native HTML dialog. Escape, the backdrop, Close, and Return restore the view and initiating focus. The dialog makes the background inert, with explicit Tab/Shift+Tab wrapping to keep focus inside its controls. Project descriptions are the exact original copy; pi-platform has no invented description. Direct destination links also remain visible outside the dialog.

The twelve named language particles can be illuminated by touch, pointer, or keyboard. Their placement is compositional: it does not encode proficiency, ordering, hierarchy or dependencies. The four organizations are listed without inferred employer or client claims.

## Shader notes

`shaders.ts` documents each stage inline. The 3D simplex lattice adapts the MIT-licensed Ashima/Gustavson implementation; its full attribution is preserved in `public/licenses.txt`. A central-difference curl of the vector potential `(n,n,n)` creates a low-cost divergence-free displacement field. This is a deliberately economical curl construction, not a fluid solver.

Balanced vertex deformation combines the curl field, low-frequency movement, scroll phase, and pointer attraction. The compiled `LOW_QUALITY` shader uses one simplex sample and reuses it for optical variation, replacing the balanced shader's seven simplex evaluations per vertex. It keeps the same geometry family, pointer tension, pulse, Fresnel and thin-film treatment. The fragment shader uses angular Fresnel reflectance, a softbox-like procedural environment, wavelength-inspired RGB interference, and an absorbed refracted ray. This is an artistic thin-film/environment approximation rather than spectral path tracing. On the balanced tier, pi-platform additionally uses Three's physical transmission material and a small locally rendered environment.

A single conducting impulse travels along each tube's longitudinal UV coordinate, then returns more slowly at lower intensity. The finishing pass keeps grain and small chromatic offsets at the edge of the WebGL image. HTML text is composed afterward and remains sharp. Restrained bloom is present only on the balanced tier.

## Performance and fallbacks

| Tier | Rendering budget |
| --- | --- |
| Balanced desktop | DPR 1.4; 46 hero strands × 138 segments; 13 spine strands; 360 suspended particles; half-resolution bloom and one combined grain/fringe pass; one physical transmission node |
| Low/startup/mobile | DPR 1; 22 hero strands × 72 segments; 7 spine strands; 130 particles; one simplex sample per vertex; no postprocessing or transmission; lower node geometry |
| Still / unavailable / exhausted budget | No canvas; static procedural SVG and full semantic HTML; no ongoing animation |

Every device starts low. Desktop can earn one promotion to balanced after 2.2 seconds of uninterrupted measured frame intervals at or below 18.5 ms. This is measured headroom, not a fixed loading delay or an interaction gate. The full HTML/SVG composition is visible immediately, and the canvas remains transparent until its first three frames have rendered. Geometry and objects keep the same layout in both animated tiers.

The elapsed-time watchdog samples raw `performance.now()` intervals while the tab is visible. A one-second window averaging over 25 ms reduces balanced to low; over 40 ms in low enters `still-budget`. There is no minimum frame count before evaluation. Severe intervals over 120 ms accumulate toward a 350 ms early-exit budget, so a single sufficiently long interval can trigger the exit. Healthy intervals drain that severe budget. Samples reset across tier and visibility changes, with only the first draw treated as compilation warmup. A GL call already in flight cannot be interrupted, so these are detection budgets rather than a promise that a blocking frame can be preempted. After a decline there is no automatic re-promotion; budget exhaustion has no automatic retry.

Tubes are merged into a small number of draw calls, buffers/materials are disposed on tier changes, and the camera moves through a single persistent world. All project objects are still constructed in the current bounded implementation; section-based resource loading has not been added. Hidden tabs stop the canvas, desktop scrolling, and cursor loops. The watchdog uses no user-agent, webdriver, GPU-vendor, or Lighthouse detection.

`prefers-reduced-motion` starts in the still composition without loading the world. The Motion control allows an explicit override, saved locally when storage is available. A renderer creation failure, lost WebGL context, or exhausted budget changes the **effective** mode to still, unmounts the canvas, cancels Lenis/cursor/pointer animation helpers, and displays a truthful still-state hint plus `Retry motion`. It preserves the HTML details, focus behavior, navigation, links, and static artwork. Failures never overwrite the visitor's saved preference; only an explicit control press saves a choice or retries the scene. A late frame callback cannot reactivate a failed renderer.

At half the balanced GPU budget, use the existing low tier: its DPR change alone cuts rendered pixels by about 49%, with no transmission/bloom and one rather than seven simplex evaluations per vertex. If a further cut is needed, remove the second biography bundle and split the long spine for tighter culling while retaining the silhouette, camera navigation and HTML project inspection. The existing terminal still state keeps the page usable when low is already too expensive. Avoid cutting the semantic fallback or making text depend on rendering quality.

60 fps on a medium laptop and Lighthouse 90+ are targets, not measured claims. Headless software WebGL establishes behavior, not physical-device GPU performance. The root agent coordinates the production build and independent common review across all three concepts.

## Diagnostics

The root `.sinapse` exposes `data-mode` for the effective mode; `data-renderer` (`static`, `loading`, `ready`, `unavailable`, `context-lost`, `still-budget`); `data-motion-reason` (`preference`, `enabled`, `renderer`, `performance`); `data-scene-ready`; `data-quality`; and `data-pointer`. `still-budget` remains a distinct reported cause rather than being disguised as missing WebGL. The canvas receives `data-ready="true"` after its first three frames. These machine-readable values are not visible implementation copy.

The identity's accessible name begins with its visible `demasi.dev` label. Motion names contain the complete current visible text: `Motion on — pause animation`, `Motion off — enable animation`, or `Retry motion — try animation again` after a failed attempt. No motion hint invites a pulse while the renderer is loading or unavailable.

Final production measurements, test scope and limitations are recorded in [docs/verification.md](docs/verification.md). The independent [finish verdict](docs/finish-verdict.md) resolves S1–S3 at the named-fix scope. Local screenshots and audit reports remain in `.impeccable/review/`; the actual design system is documented in `DESIGN.md` and `.impeccable/design.json`.
