# Image Standards

Use shared image primitives from `src/components/media/` for all App Router render-layer image slots.

## Which Primitive To Use

- `HeroImage`: Full-bleed hero and LCP section imagery.
- `SectionImage`: Standard content-section images and large split-layout visuals.
- `CardImage`: Card media, tiles, thumbnails, and carousel images.
- `LogoImage`: Brand marks, partner/certification logos, compact identity marks.
- `AdminImage`: Dashboard/admin thumbnails and avatar-style utility media.

## Default `sizes` Rules

- `HeroImage`: `100vw`
- `SectionImage`: `(min-width: 1024px) 50vw, 100vw`
- `CardImage`: `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw`
- `LogoImage`: `(min-width: 1024px) 160px, 120px`
- `AdminImage`: `(min-width: 1024px) 320px, 100vw`

Override `sizes` only when the component has a tighter known max width than the default slot.

## Priority Rule

- Maximum `1` image with `priority` per page.
- Reserve `priority` for the true LCP hero image only.
- Do not use `priority` on logos, cards, badges, or secondary section images.

## Aspect Ratio And Layout Stability

- Every image must reserve space before load.
- Use explicit `width` + `height` when intrinsic dimensions are known.
- Use `fill` only inside a reserved box:
  - aspect-ratio wrappers (for fluid cards/sections), or
  - fixed-height/fixed-size containers that already reserve layout.
- Prefer stable wrappers such as `aspect-[16/9]`, `aspect-[4/3]`, etc. when image geometry is known.
- Surface defaults:
  - `CardImage` and `SectionImage`: default `surfaceTone="auto"`.
    - `auto` -> `none` for `.png`, `.svg`, `.webp`
    - `auto` -> `light` for `.jpg`, `.jpeg`
  - `AdminImage`: default `surfaceTone="auto"` (bounded dashboard thumbnail contexts).
    - `auto` -> `none` for `.png`, `.svg`, `.webp`
    - `auto` -> `light` for `.jpg`, `.jpeg`
  - `LogoImage`: default `surfaceTone="none"` (preserve transparent brand marks).
  - `HeroImage`: default `surfaceTone="none"`; enable when a hero sits on a flat surface and needs a fallback.
- Opt out with `surfaceTone="none"` for transparent assets or where the section already defines its own backdrop.

## Raw `next/image` Usage

- Do not import raw `next/image` in app render code.
- Import the slot primitive from `src/components/media/` instead.
- Keep behavior and styling in place; image refactors should be render-layer only.
