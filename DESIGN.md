---
name: "Bruno De Masi — Sinapse líquida"
description: "A conducting world of wet optical filaments, monumental type and near-black space."
colors:
  background: "#050505"
  foreground: "#edf1e9"
  accent: "#22c55e"
  headline-tint: "#a1d4b5"
  name-outline: "#d7e9dd"
  focus: "#91f7bc"
  link-hover: "#8ef4b1"
  project-rule: "#2d4837"
  project-label: "#9dbfa9"
  project-body: "#b3c4b9"
  motion-text: "#b5cbbd"
  node-silver: "#91c1ab"
  node-phosphor: "#60e890"
  node-cobalt: "#729cc0"
  node-pearl: "#d7ecda"
  material-silver: "#abc4b9"
  material-phosphor: "#35c666"
  material-cobalt: "#5c95c9"
  material-pearl: "#c4ded3"
typography:
  display:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(130px, 23.5vw, 400px)"
    fontWeight: 500
    lineHeight: 0.75
    letterSpacing: "-.04em"
    fontVariation: '"wdth" 78, "wght" 600'
  display-outline:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: ".98em"
    fontWeight: 500
    lineHeight: 0.75
    letterSpacing: "-.04em"
    fontVariation: '"wdth" 83, "wght" 560'
  headline:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(64px, 8.6vw, 154px)"
    fontWeight: 500
    lineHeight: 0.91
    letterSpacing: "-.04em"
    fontVariation: '"wdth" 90, "wght" 510'
  title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(35px, 4.5vw, 76px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-.035em"
  body:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  biography:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(20px, 2.12vw, 34px)"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "-.025em"
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "10px"
    fontWeight: 400
  control:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "13px"
    fontWeight: 400
  motion-control:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "11px"
    fontWeight: 400
  detail-title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(55px, 6.5vw, 115px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-.04em"
  detail-body:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(17px, 1.5vw, 23px)"
    fontWeight: 400
    lineHeight: 1.55
  portal-display:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(100px, 17vw, 285px)"
    fontWeight: 500
    lineHeight: 0.81
    letterSpacing: "-.04em"
    fontVariation: '"wdth" 82, "wght" 570'
  contact:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(22px, 3.25vw, 55px)"
    fontWeight: 400
    letterSpacing: "-.03em"
  language:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(15px, 1.55vw, 24px)"
    fontWeight: 400
    letterSpacing: "-.02em"
rounded:
  square: "0"
  circle: "50%"
spacing:
  space-8: "8px"
  space-12: "12px"
  space-16: "16px"
  space-20: "20px"
  space-24: "24px"
  space-28: "28px"
  space-32: "32px"
  space-40: "40px"
  space-60: "60px"
  space-70: "70px"
  space-100: "100px"
  space-120: "120px"
  page-gutter: "5.2vw"
  page-gutter-mobile: "6vw"
components:
  navigation:
    textColor: "{colors.foreground}"
    typography: "{typography.control}"
    padding: "12px 0"
  motion-control:
    textColor: "{colors.motion-text}"
    typography: "{typography.motion-control}"
  journey-link:
    textColor: "{colors.foreground}"
    typography: "{typography.control}"
  journey-circle:
    rounded: "{rounded.circle}"
    width: "48px"
    height: "48px"
  text-link:
    textColor: "{colors.foreground}"
    typography: "{typography.control}"
    padding: "10px 0"
  project-connection:
    textColor: "{colors.foreground}"
    padding: "0 0 50px"
  project-node:
    rounded: "{rounded.square}"
    width: "min(100%, 400px)"
    height: "330px"
  project-category:
    textColor: "{colors.project-label}"
    typography: "{typography.label}"
  language-particle:
    textColor: "{colors.foreground}"
    typography: "{typography.language}"
    padding: "12px 7px"
  project-detail:
    textColor: "{colors.foreground}"
    rounded: "{rounded.square}"
    padding: "100px 7vw 60px 2vw"
    width: "48%"
  contact-link:
    textColor: "{colors.foreground}"
    typography: "{typography.contact}"
    padding: "22px 0"
    width: "66%"
  conducting-name:
    textColor: "{colors.foreground}"
    typography: "{typography.display}"
    padding: "0 0 .07em"
---

# Design System: Bruno De Masi — Sinapse líquida

## Overview

**Creative North Star: "Sinapse líquida"**

Long-exposure photography of wet optical fibers is the material reference. Open, asymmetric bundles conduct silver, phosphor green and refracted cyan through near-black space. Monumental compressed lettering shares that space with the fibers; the smaller interface stays quiet, precise and legible.

The recurring language is a solid statement followed by an outlined or gently green continuation, generous editorial intervals, hairline connections and project objects built from strands. Depth belongs to the material and the continuous camera. Native HTML carries the words and actions, while the authored SVG edition preserves the same identity without animation.

**Key Characteristics:**

- Near-black ground with silver-green light and restrained cobalt refraction.
- Monumental Archivo Variable paired with small Geist Mono project labels.
- Open filament geometry, asymmetric spacing and hairline dividers.
- A continuous material world behind readable, keyboard-operable HTML.
- A complete still edition with truthful motion and recovery controls.

This is the implemented Sinapse system in `experience/sinapse`, extracted on 2026-09-09 from [the stylesheet](src/app/globals.css), [the interface](src/components/sinapse/portfolio.tsx), [the scene](src/components/sinapse/world.tsx), [the shaders](src/components/sinapse/shaders.ts), [the geometry](src/components/sinapse/geometry.ts) and [the static artwork](src/components/sinapse/static-filaments.tsx). The twelve supplied captures in `.impeccable/review/` were opened as visual evidence: desktop, mobile, about, reef, project, spectrum, contact, reduced, mobile-work, mobile-project, mobile-contact and fallback. The selected composition and seed (`0285d2ea`) remain in [the direction contract](docs/implementation.md).

The [finish verdict](docs/finish-verdict.md) clears S1–S3 from the [finish review](docs/finish-review.md); its ship disposition is restricted to those corrections. This document records the resulting system and does not certify temporal contrast, physical-device frame rate, 60 fps or the Lighthouse 90+ target. Sinapse remains one of the three authorized versions awaiting the user's comparison.

## Colors

The palette reads as graphite illuminated by phosphor and wet metal. Frontmatter values are normative; names below explain their application.

### Primary

- **Phosphor Green** (`accent`) is the inherited green, used by the navigation underline and the static filament gradient.
- **Soft Phosphor** (`headline-tint`) colors the second line of the about, work and languages headings.
- **Focus Light** (`focus`) is the global keyboard outline and an organization-link hover color. **Link Light** (`link-hover`) brightens project destinations, social links and project-title arrows.
- **Phosphor Node** (`node-phosphor`) is the SVG counterpart of the green project object. Its shader begins from **Phosphor Material** (`material-phosphor`).

### Secondary

- **Refracted Cobalt** (`node-cobalt`) identifies the static pi-platform object. **Cobalt Material** (`material-cobalt`) is its shader base, modulated by the optical environment and thin-film interference.
- Cyan-green in the conductors comes from the static gradient and procedural shader environment. It is a material variation, not an additional general UI accent.

### Neutral

- **Graphite Ground** (`background`) covers the document and the renderer's clear color. **Pale Silver** (`foreground`) carries primary text.
- **Silver Outline** (`name-outline`) strokes the desktop surname. The contact outline and mobile surname have their own observed stroke values in their component styles.
- **Moss Rule** (`project-rule`), **Technical Sage** (`project-label`) and **Body Sage** (`project-body`) separate and describe project entries without opaque containers.
- **Quiet Control** (`motion-text`) is the motion control's resting color.
- **Silver Node** and **Pearl Node** (`node-silver`, `node-pearl`) are SVG colors; **Silver Material** and **Pearl Material** (`material-silver`, `material-pearl`) are the corresponding shader inputs.

**The Material Color Rule.** Keep HTML/SVG colors distinct from shader base colors: lighting, refraction, fog and tone mapping determine the rendered material, so its base value is not a flat screen swatch.

The root declarations for `--muted` and `--line` are currently unconsumed; they have not been promoted into active visual roles here. The sidecar's eight-step OKLCH ramps are documentary synthesis for the panel, not source CSS, approved new color roles or measured render colors. The implementation has no existing tonal scale to reproduce.

## Typography

Archivo Variable is the display and body family, supplied through `--font-archivo` with a sans-serif fallback. Geist Mono is supplied through `--font-geist-mono` with a monospace fallback. Both are self-hosted Latin WOFF2 files loaded with `next/font/local`, variable weights (100–900) and `font-display: swap`; their sources and notices are recorded in [assets](docs/assets.md) and [licenses](public/licenses.txt).

Compressed, close-set display type supplies the mass; thin outlined continuations allow the filaments to remain visible. Body copy opens into a readable measure. Geist Mono is used by project category labels, including the detail view. Navigation, hints, motion text and most other small controls actually inherit Archivo.

The frontmatter records the desktop roles. Headings have a CSS weight of 500; where an explicit `wght` variation exists, that axis supplies the actual drawn weight. There is no single modular ratio: large roles use viewport clamps, while small controls have fixed sizes.

| Role | Application and behavior |
| --- | --- |
| Display / display-outline | The name uses uppercase HTML text, solid first line and transparent stroked surname. The surname's `.98em` size is relative to the display; its line spacing is inherited from the heading. |
| Headline | About, work and languages use balanced two-line headings with a soft-green continuation. |
| Title | Project names remain buttons inside real headings, with a thin outward arrow at the far edge. |
| Body / biography | Project copy has a maximum measure of 47ch; biography uses 35ch and `text-wrap: pretty`. |
| Label / control | Project categories use small monospace; navigation and editorial links use compact sans-serif. |
| Detail title / detail body | The selected project has a larger title and a 40ch description measure. Long project names can break anywhere. |
| Portal display / contact | The closing heading repeats the solid/outline relationship at a distinct scale; the address is a prominent text link. |

At mobile width (600px and below), the name uses a viewport size (32vw), line-height (.83), and axes (`wdth` 72, `wght` 610). The surname becomes (.96em), uses a thinner stroke (1px) and axes (`wdth` 70, `wght` 560). Section headings use (16vw); project names use (12.6vw); detail titles use (15vw). The portal uses (26vw), line-height (.89); the address uses (7.2vw). Biography becomes (22px/1.44) with a 27ch measure. At 360px and below, biography becomes (20px), language labels (12px), and the name (31.5vw).

**The Solid and Outline Rule.** Preserve the filled first line and transparent stroked continuation of the name and closing heading; keep them as selectable, semantic text.

## Layout

The shared shell is full width, with fluid desktop gutters from `page-gutter` and mobile gutters from `page-gutter-mobile`. It has no global maximum-width content box. Generous vertical intervals are tailored to each chapter; the spacing entries record reused values, not a universal grid to impose on every element. Project nodes, biography and descriptions have local width limits.

The header is absolute at the top, with a desktop height (106px), identity on the left, chapter navigation near the center, and motion control on the right. The five-dot depth marker is fixed on the right. The hero occupies at least one small viewport height and reserves a bottom area for the circular exploration link and interaction hint.

The biography uses two equal columns with a broad gap (9vw). Work uses two columns with a gap (6vw), open object fields and an alternating vertical offset (200px) on even entries. These entries are articles with a single top divider over the text. The language field places native buttons at explicit percentage coordinates within three crossing ellipses; placement expresses composition, not proficiency or dependencies.

| Boundary | Implemented adaptation |
| --- | --- |
| At least 1700px | Name changes to 23vw and hero vertical padding grows. |
| At most 900px | Biography becomes one column with a 23% inset; project columns remain, nodes shorten to 270px, and detail text occupies 52% width. |
| At most 600px | Desktop navigation and depth marker disappear. A fixed four-link bottom rail includes the safe-area inset. Work becomes one column, the alternating offset disappears, biography inset becomes 9%, and project nodes use 85% width and 290px height. |
| At most 360px | The language field shortens from 600px to 560px and its labels shrink; name and biography receive the compact adjustments described above. |

The mobile rail's links have minimum targets (52px wide × 45px high), an active green underline and a nearly opaque dark ground. The motion button has a minimum height (44px). These are observed component dimensions, not a claim that every current target has that minimum.

The detail occupies the viewport. On desktop the selected object is on the left and text occupies the right portion (48%, or 52% at the intermediate breakpoint). At mobile width, the object moves above the text; the dialogue reserves (36svh) before the panel. The canvas camera has a separate composition threshold (below 650px); desktop renderer promotion and the touch-device pointer safeguard use a separate boundary (700px).

## Elevation & Depth

The HTML interface has no card drop-shadow or blur vocabulary. Depth comes from actual conductor geometry, camera travel, light, subtle particles and dark absorption gradients behind text. A narrow inset edge light is the sole CSS box-shadow: `inset 1px 0 0 #225b483b, inset -1px 0 0 #749dd22e`. It traces the viewport sides rather than lifting a surface.

The desktop detail gradient runs from transparent near-black on the object side to nearly opaque near-black behind the copy. Its backdrop is a translucent dark layer. On mobile the gradient runs top to bottom. Static chapters add a dark translucent background, and the background artwork is reduced in opacity; these treatments protect the reading layer while retaining the filaments.

The high-quality scene adds restrained bloom (intensity .38), fine grain (.007), boundary-only chromatic fringing and a procedural light environment. The initial low tier keeps the conductor silhouette and removes those extra passes and the transmitting core material. These effects act on the WebGL image; the semantic text is composed afterward.

**The Reading Layer Rule.** Keep distortion and chromatic displacement in the artwork; HTML text, focus indicators and native controls remain in the readable foreground.

Motion follows the material: slow breathing, pointer tension, an outward impulse (0–3.1s), and a dimmer return (3.1–7.8s). The camera eases continuously through the scene and toward the selected project. Link arrows move diagonally by (4px), the navigation underline grows from the left, and the depth ring slides with a (.65s) eased transition. A fine-pointer cursor trails the pointer and grows around marked controls; it is absent on coarse pointers and in the still edition.

Rendering begins with the inexpensive scene. A visible-time budget may lower quality or enter the still edition; an explicit retry can attempt motion again. Reduced-motion preference, a manual pause, renderer failure and exhausted frame budget all preserve the HTML/SVG composition and remove active animation. This is documented behavior, not a benchmark result.

## Shapes

The recurring forms are open tubes, loops, hairline ellipses, small particles, thin arrows and corner registration marks. Project objects differ structurally: a silver knot for Buggy, a phosphor helix for wt, a cobalt angular cage for pi-platform, and pearl elliptical strands for Flight Tracker. The static edition expresses those identities through parametric SVG linework.

Text controls and the full-screen detail have square geometry. Circles belong to the exploration arrow, particle outlines, depth marker and cursor. Project text uses one top rule; the object itself remains open against the ground. There is no implemented card, chip, input or form family to extrapolate.

All new visible artwork is procedural geometry or authored SVG. The inherited application and Apple icons remain unchanged. No new shipping raster artwork is introduced; the source and font notices remain in [asset provenance](docs/assets.md) and [licenses](public/licenses.txt). Review captures are evidence, not shipping artwork.

## Components

### Identity and chapter navigation

A fine inline conductor mark precedes the small `demasi.dev` wordmark. Desktop links have a one-pixel phosphor underline that reveals on hover and `aria-current="location"`. On mobile those links form the bottom rail. The wordmark's accessible name includes its complete visible text and the return-to-surface action.

### Motion control and formation status

A text button pairs a small pause/play outline with `Motion on`, `Motion off` or `Retry motion`; `aria-pressed` follows effective motion. Hover brightens the text. Accessible names retain the complete visible label and add the action. Loading displays three growing strands and `Connecting the strands` in a polite live region without blocking content. Failure displays the still/retry wording; budget exhaustion explains that motion was paused for responsiveness. The hint describes tension or pulse only when the renderer is actually animating; otherwise it reads `Follow the connections.`

### Journey link and editorial text link

`Scroll to connect` pairs text with a thin circular down arrow. Its circle gains a dark green fill and brighter border on hover; it shrinks from (48px) to (40px) on mobile. `Follow the work` is an underlined text-and-arrow link with a broad internal gap (18px). Both retain the shared visible keyboard outline (2px with a 7px offset).

### Project connection

An open material object sits above a ruled text block, not inside a card. The object button contains an authored SVG counterpart, two corner marks and the `Inspect` action. Both object and title buttons open the same native detail dialog; the external destination stays independently available. A monospace category, large title and genuine short description form the hierarchy. pi-platform has no description and keeps that absence.

The object hint brightens on hover. The title arrow shifts outward and turns green; the external destination gains an underline. Each keyboard-operable button and link retains the global focus treatment. The shared sidecar specimen uses Buggy's real content and exact static-node formula.

### Language particle

A small filled dot, thin offset ring and language name form one native toggle button. Hover and selection brighten the label; the selected ring expands its offset from (6px) to (10px). Selection uses `aria-pressed` and can be toggled off. On mobile the dot and spacing become smaller. The twelve language positions are compositional only; the visual does not add proficiency levels or inferred relationships.

### In-world project detail

A native modal expands the selected object while a dark gradient supports the text. The panel carries the same category, title, available description and genuine external link. `Close` pairs with a thin cross; `Return to the connections` pairs with a left-pointing arrow. Opening focuses Close, keeps keyboard focus in the modal and hides the surrounding interface; closing, Escape or backdrop activation restores the previous focus and releases body scrolling. The static edition substitutes the corresponding SVG object in the same view.

### Contact destination

The address is a large text link with a single bottom rule and an outward arrow. It brightens on hover and the arrow moves diagonally. Social links use smaller text-and-arrow pairs. This implementation has a real `mailto:` destination and social links; it contains no email-submission form or invented form states.

### Conducting name and static artwork

The name is selectable HTML over an asymmetric filament bundle. The static bundle contains 44 parametric paths, varying line width and opacity through an authored metal gradient. It is present before WebGL is ready and reappears whenever the still edition is active. The hero's solid/outline pairing, project-node counterparts and contact linework share that material language.

The companion `.impeccable/design.json` contains nine scoped, framework-free HTML/CSS specimens of these actual patterns. SVGs are inline, utilities are expanded, and CSS variables retain source bindings with literal fallbacks. The detail and hero use bounded specimen frames so their viewport layout stays inside the panel. Specimens demonstrate appearance and CSS states; runtime navigation, selection, modal management and WebGL behavior remain owned by the application.

## Do's and Don'ts

### Do:

- Do keep the near-black ground, open conducting strands and silver-green material relationship.
- Do preserve Archivo's observed width/weight axes and the solid/outline name treatment.
- Do use Geist Mono for the project-category role; keep the other observed sans-serif controls in Archivo.
- Do preserve native text, real destinations, visible focus and the complete static artwork when motion is unavailable.
- Do make motion labels and interaction hints describe the renderer's effective state.
- Do retain the mobile bottom navigation, stacked project detail and safe-area spacing.

### Don't:

- Don't replace the chosen filament world with an opaque card grid or a closed skin around the organism.
- Don't distort the HTML reading layer with the artwork's lens or shader effects.
- Don't erase keyboard focus or make project content depend on hover or WebGL.
- Don't assign proficiency, dependencies or new factual project claims to decorative objects and language positions.
- Don't treat the synthesized panel ramps as implemented CSS tokens or turn shader base colors into flat UI equivalents.
- Don't present documentation or the restricted S1–S3 verdict as proof of 60 fps or Lighthouse 90+.
