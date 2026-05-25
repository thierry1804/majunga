---
name: Mada Booking
description: Système visuel éditorial pour le tourisme local à Majunga, Madagascar
colors:
  warm-sand-cream: "#faf7f2"
  sand-drift: "#f5ede0"
  sand-border: "#e8dcc8"
  deep-ocean-teal: "#145555"
  ocean-mid: "#1a6b6b"
  ocean-deep: "#0f4444"
  ocean-abyss: "#062626"
  terracotta-clay: "#c45c3e"
  terracotta-warm: "#d4704f"
  ink-charcoal: "#2a2520"
  ink-muted: "#5c5349"
  ink-light: "#8a8078"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  sm: "0.5rem"
  md: "0.625rem"
  lg: "0.75rem"
  xl: "0.75rem"
spacing:
  section-y: "5rem"
  section-y-md: "7rem"
  content-max: "72rem"
  gutter: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.deep-ocean-teal}"
    textColor: "{colors.warm-sand-cream}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ocean-deep}"
    textColor: "{colors.warm-sand-cream}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.terracotta-clay}"
    textColor: "{colors.warm-sand-cream}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary-hover:
    backgroundColor: "#a84d34"
    textColor: "{colors.warm-sand-cream}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ocean-deep}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  section-label:
    typography: "{typography.label}"
    textColor: "{colors.deep-ocean-teal}"
---

# Design System: Mada Booking

## Overview

**Creative North Star: "The Coastal Gazette"**

Mada Booking reads like a local travel gazette, not a resort booking engine. Warm sand surfaces, deep ocean teal for trust and navigation, terracotta for the moments that ask for action. Typography splits editorial display (Fraunces) from practical body copy (DM Sans). Sections breathe with generous vertical rhythm; depth comes from tonal shifts (sand-50, white, sand-100) and ink-tinted shadows, not from stacked card shells.

The system rejects generic tourism clichés: corporate blue/orange pairs, centered hero stacks, pill badges, glass panels everywhere, and decorative motion without purpose. Motion is choreographed for brand surfaces (hero entrance, scroll reveals, section wave dividers) and respects `prefers-reduced-motion`.

**Key Characteristics:**
- Full palette: sand neutrals + ocean primary + terracotta action accent
- Editorial serif headlines with humanist sans body (max 65ch for prose)
- Tonal section layering over nested card grids
- Ink-tinted shadows (`rgba(42, 37, 32, ...)`) instead of pure black
- Scroll-driven reveals and hero parallax; no bounce easing
- i18n-first copy (FR / EN / IT); French as fallback

## Colors

A warm coastal palette rooted in Majunga's sand, mangrove water, and laterite earth. Never pure black or pure white.

### Primary
- **Deep Ocean Teal** (#145555 / oklch(35% 0.06 195)): Primary buttons, nav active states, footer background, hero overlay base. The anchor of trust.
- **Ocean Mid** (#1a6b6b / oklch(40% 0.07 195)): Links, icon accents, selection highlight tints.
- **Ocean Abyss** (#062626 / oklch(15% 0.04 195)): Hero gradient overlays, modal backdrop tint.

### Secondary
- **Terracotta Clay** (#c45c3e / oklch(55% 0.14 35)): Secondary CTAs, brand wordmark accent ("Booking"), price emphasis, delayed flight indicators. Reserved for action, not decoration.
- **Terracotta Warm** (#d4704f): Hover states on terracotta surfaces.

### Neutral
- **Warm Sand Cream** (#faf7f2): Default page background, primary surface.
- **Sand Drift** (#f5ede0): Alternate section background (shuttle), form containers.
- **Sand Border** (#e8dcc8): Borders, dividers, skeleton loaders.
- **Ink Charcoal** (#2a2520): Primary text. Tinted warm, never #000.
- **Ink Muted** (#5c5349): Body secondary, table headers, descriptions.
- **Ink Light** (#8a8078): Meta labels, placeholders, disabled text.

### Named Rules
**The Two-Accent Rule.** Ocean carries navigation and structure. Terracotta carries conversion. They never compete on the same element.

**The Sand Floor Rule.** At least 60% of any public page surface is sand-family neutrals. Ocean and terracotta are accents, not wallpaper.

## Typography

**Display Font:** Fraunces (Georgia, serif fallback)
**Body Font:** DM Sans (system-ui fallback)
**Label Font:** DM Sans, uppercase tracked labels

**Character:** Editorial warmth without luxury pretension. Fraunces gives headlines a local-guide personality; DM Sans keeps forms, tables, and nav readable under tropical sunlight on mobile.

### Hierarchy
- **Display** (600, clamp 2.25–3.5rem, line-height 1.05): Hero H1 only. Italic terracotta for place names ("Majunga").
- **Headline** (600, clamp 1.875–2.75rem, line-height 1.1): Section titles via `SectionHeader`. Fraunces.
- **Title** (600, 1.25rem, line-height 1.3): Tour card titles, modal headers, table section labels.
- **Body** (400, 1rem, line-height 1.625, max 65ch): Descriptions, form labels, footer copy. DM Sans.
- **Label** (500, 0.75rem, letter-spacing 0.12em, uppercase): Section eyebrows (`.section-label`), weather widget header, footer column titles.

### Named Rules
**The One Serif Rule.** Fraunces appears only on display and headline levels. UI chrome, buttons, and forms stay DM Sans.

**The 65ch Rule.** Prose blocks (`.prose-body`, section descriptions) cap at 65 characters wide. Wider text reads like a template, not a guide.

## Elevation

Hybrid system: flat at rest, lifted on interaction. Depth between sections uses background tone shifts and SVG wave dividers, not drop shadows on every block.

### Shadow Vocabulary
- **Soft** (`0 2px 12px rgba(42, 37, 32, 0.06)`): Navbar on scroll, subtle hover lift.
- **Card** (`0 4px 24px rgba(42, 37, 32, 0.08)`): Mobile nav panel, booking form container.
- **Elevated** (`0 8px 32px rgba(42, 37, 32, 0.12)`): Tour detail offcanvas panel.

### Named Rules
**The Ink-Tinted Shadow Rule.** All shadows use warm ink rgba, never `rgba(0,0,0,...)`. If the shadow reads gray-cold, it is wrong.

**The Flat-By-Default Rule.** Tour cards, tables, and highlight rows have no shadow at rest. Elevation responds to state (hover scale on images, sticky nav, modal open).

## Components

### Buttons
- **Shape:** Gently rounded (10px / `rounded-lg`). Not pills.
- **Primary:** Deep Ocean Teal fill, sand cream text, px-5 py-2.5 (md). Hero and booking flows.
- **Secondary:** Terracotta fill. Hero CTA, high-intent actions.
- **Outline:** 1px ocean border, transparent fill. Card actions, shuttle table.
- **Ghost / Text:** Transparent, ocean text. Modal dismiss, tertiary links.
- **Hover / Focus / Active:** 200ms transition; hover darkens fill one step; `focus-visible: ring-2 ring-ocean-500`; active `scale(0.98)`. No bounce.

### Cards / Containers
- **Corner Style:** 12px (`rounded-xl`) for media; 8–10px for inner stat blocks.
- **Background:** White or sand-50; borders `sand-300` 1px when containment is needed.
- **Shadow Strategy:** None at rest on tour cards. Booking form uses `shadow-soft`.
- **Internal Padding:** p-5 to p-8 depending on density.

### Inputs / Fields
- **Style:** 1px sand-300 border, 10px radius, label above field.
- **Focus:** Border shifts to ocean-500, ring ocean-500.
- **Error:** Terracotta-600 text below field (inline, never alert()).

### Navigation
- **Default (hero):** Transparent background, sand-50 text links.
- **Scrolled:** sand-50/95 backdrop-blur, ink text, bottom border sand-200, shadow-soft.
- **Active section:** Underline with terracotta decoration (hero) or ocean-50 background (mobile).
- **Mobile:** Full-width panel, sand-50 bg, rounded-xl, shadow-card.

### Weather Widget (signature)
- **Context:** Hero only. Purposeful glass: `bg-ocean-800/40 backdrop-blur-sm` over photography.
- **Not reusable elsewhere.** No glassmorphism on admin or form surfaces.

### Section Dividers (signature)
- SVG wave transitions between section background tones (hero→sand, sand→white, white→sand-100).
- 40–56px height, `ease-out-expo` reveal on load.

### Motion (folded from implementation)
- **Easing:** `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `--ease-out-quart` for ambient loops.
- **Hero:** Staggered `HeroEntrance` (0–400ms), image parallax via transform.
- **Sections:** `RevealOnScroll` (Intersection Observer, 700ms fade+translate).
- **Reduced motion:** All animations disabled; scroll behavior auto.

## Do's and Don'ts

### Do:
- **Do** use sand-50 as the default canvas and alternate white / sand-100 for section rhythm.
- **Do** pair Fraunces headlines with DM Sans body text and cap prose at 65ch.
- **Do** tint shadows with ink charcoal rgba(42, 37, 32, ...).
- **Do** use terracotta exclusively for conversion CTAs and brand accent wordmark.
- **Do** animate with transform and opacity only; honor `prefers-reduced-motion`.
- **Do** use real Majunga-specific copy and i18n keys for all public strings.

### Don't:
- **Don't** use corporate blue (#2563eb) or generic orange (#f97316) accents.
- **Don't** use border-left or border-right greater than 1px as colored stripes on callouts.
- **Don't** apply glassmorphism (backdrop-blur panels) outside the hero weather widget.
- **Don't** use gradient text, pill-shaped badges, or centered hero-only layouts.
- **Don't** use bounce or elastic easing curves.
- **Don't** nest cards inside cards (booking form inside a card inside a section card).
- **Don't** use pure #000 or #fff anywhere in the system.
- **Don't** add decorative parallax blobs or circular gradient orbs.
