# Asset provenance

All O Condutor and Sinapse visual work is authored as code-native geometry, SVG, or shader source. No new raster artwork has been generated, sourced, or shipped.

| Asset | Origin | Treatment |
| --- | --- | --- |
| `src/components/conductor/engine.ts` | Authored level geometry | Typed `b`, `d`, `m`, dot, bridges, gates, and collision paths |
| `src/components/conductor/experience.tsx` | Authored component | Inline SVG still circuit study and native controls |
| `src/components/conductor/world.tsx` | Authored Three geometry | Generated ribbon paths, gate forms, footprints, pulse ring, and dust points |
| `src/components/conductor/collectibles.tsx` | Authored instanced Three geometry | Seven loose loops of light; torus and sphere geometry, no texture assets |
| `src/components/conductor/shaders.ts` | Authored GLSL | Procedural strand and footprint appearance; no image textures or full-screen pass |
| `src/components/conductor/character.tsx` and `metal.ts` | Authored Three geometry and GLSL | Procedural mercury walker, reflection-field material, and a cosmetic halo reusing the existing torus/bead geometry |
| `src/components/sinapse/geometry.ts` and `static-filaments.tsx` | Authored procedural geometry and SVG | Ambient filament renderer and its static counterpart |
| `src/app/icon.png` | Inherited unchanged from the original portfolio repository | Existing application icon; not new artwork |
| `src/app/apple-icon.png` | Inherited unchanged from the original portfolio repository | Existing Apple application icon; not new artwork |
| Archivo variable Latin | `@fontsource-variable/archivo` 5.3.0; Omnibus-Type | Unmodified, self-hosted through Next font |
| Geist Mono variable Latin | `@fontsource-variable/geist-mono` 5.2.7; Vercel | Unmodified, self-hosted through Next font |
| Interface icons | `lucide-react`, ISC | SVG/icon components; no raster icons added |

Full shader-source and font license notices ship in `public/licenses.txt`. Review screenshots, if present in local review folders, are development evidence rather than shipping artwork. Inherited unused Next starter SVGs are not referenced by the interface.
