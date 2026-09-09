# Asset provenance

All new visible artwork is code-native geometry, authored for this implementation. No generated or sourced raster art is used.

| Asset | Origin | Treatment |
| --- | --- | --- |
| `src/components/sinapse/geometry.ts` | Procedural geometry authored in this implementation | Open tubes, material junctions, orbital paths |
| `src/components/sinapse/static-filaments.tsx` | Parametric SVG linework authored in this implementation | Static and no-WebGL visual counterpart |
| `src/app/icon.png` | Inherited unchanged from the original portfolio git repository | Original application icon |
| `src/app/apple-icon.png` | Inherited unchanged from the original portfolio git repository | Original Apple application icon |
| Archivo variable Latin | `@fontsource-variable/archivo` 5.3.0; Omnibus-Type | Unmodified, self-hosted through Next font |
| Geist Mono variable Latin | `@fontsource-variable/geist-mono` 5.2.7; Vercel | Unmodified, self-hosted through Next font |
| Interface icons | `lucide-react`, ISC | Consistent stroke icons; no raster icons added |

Full shader-source and font license notices ship at `public/licenses.txt`. Review screenshots in `.impeccable/review/` are development evidence, not shipping artwork. The existing unused Next starter SVGs in `public/` are inherited repository files and are not referenced by the interface.
