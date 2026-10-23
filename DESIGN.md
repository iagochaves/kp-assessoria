---
name: KP Assessoria
description: Marketing e vendas para lojas de motos. Noite violeta, um brilho onde há dinheiro ou escolha, números em Archivo expandida.
colors:
  violet-night: "#160038"
  violet-ink: "#1A0147"
  violet-deep: "#4A1B97"
  violet-royal: "#4600B8"
  violet-electric: "#5C10D8"
  violet-band: "#732CE5"
  violet-core: "#7A2FF1"
  violet-glow: "#9D5CFF"
  lilac: "#CBB3FF"
  text-soft: "#D9CCFF"
  night-footer: "#0B001F"
  graphite: "#161616"
  navy-ink: "#021422"
  text-on-light-soft: "#3D3747"
  mist: "#DADADA"
  paper: "#F8F8F8"
  white: "#FFFFFF"
  error: "#FF8A85"
typography:
  display:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.35rem, 7.4vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 118"
  statement:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 4.6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 112"
  headline:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.6vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.028em"
    fontVariation: "\"wdth\" 115"
  numeral-xl:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"lnum\""
    fontVariation: "\"wdth\" 125"
  numeral:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "\"tnum\", \"lnum\""
    fontVariation: "\"wdth\" 125"
  title:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.6vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 108"
  title-sm:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
    fontVariation: "\"wdth\" 108"
  lede:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "\"wdth\" 100"
  button:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    letterSpacing: "0.01em"
    fontVariation: "\"wdth\" 108"
  label:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: "Archivo, Archivo Fallback, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "50%"
spacing:
  gap-tight: "10px"
  gap: "12px"
  gap-card: "16px"
  stack: "20px"
  card-pad: "clamp(20px, 3vw, 32px)"
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(72px, 10vw, 128px)"
  container: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.violet-glow}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "17px 26px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.violet-core}"
    textColor: "{colors.white}"
  quiz-card:
    backgroundColor: "{colors.violet-ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  quiz-tile:
    backgroundColor: "{colors.violet-night}"
    textColor: "{colors.white}"
    typography: "{typography.numeral}"
    rounded: "{rounded.md}"
    padding: "16px 16px 14px"
    height: "104px"
  quiz-tile-selected:
    backgroundColor: "{colors.violet-night}"
    textColor: "{colors.violet-glow}"
    rounded: "{rounded.md}"
  option-row:
    backgroundColor: "{colors.violet-night}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
    height: "56px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "14px"
    height: "50px"
  proof-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.lg}"
    padding: "20px 22px 22px"
  testimonial-card:
    backgroundColor: "{colors.violet-ink}"
    textColor: "{colors.text-soft}"
    rounded: "{rounded.lg}"
    padding: "16px 18px 20px"
  placa-photo:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.white}"
    typography: "{typography.numeral-xl}"
    rounded: "{rounded.lg}"
  partner-marquee:
    backgroundColor: "{colors.violet-band}"
    rounded: "{rounded.md}"
    padding: "14px 0"
  footer:
    backgroundColor: "{colors.night-footer}"
    textColor: "#B9B0D0"
    typography: "{typography.caption}"
    padding: "32px 0"
---

# Design System: KP Assessoria

> Rewritten on 2026-10-14 from the built "Diagnóstico ao vivo" landing page (`site/`, Astro). Ground truth is the shipped code: `site/src/styles/global.css`, `site/src/components/Hero.astro`, `site/src/pages/index.astro`. The violet family is locked brand and unchanged from the incumbent site; typography (Archivo) is now settled. Token mirror: `tokens/kp-tokens.css`.

## Overview

**Creative North Star: "Noite de Faturamento"**

KP lives at night: deep violet-black fields, one luminous violet that lights up wherever there is money or a choice to make, and white numerals set wide like a scoreboard. The page behaves like the end of a strong sales month: a dark room, bright numbers, real owners holding real plaques. Purple is not decoration; it is the uniform (the team literally wears it).

The system is dark-first and diagnostic. The first viewport is a working instrument, not a poster: a quiz card asks how many motorcycles the store sells, and the answer reveals a paper proof card from a partner store of that size. Every later section restates the same grammar: an expanded headline, a short soft-lilac paragraph, proof with names and numbers. One paper section (the Placas de Faturamento gallery) is the single light pause. Density is medium; headlines are big and wide, paragraphs short, vertical space generous.

Type does the work that ornament would do elsewhere. A single variable family, Archivo, is stretched wide (108–125%) for headlines and numbers and kept at normal width (100%) for reading. The emotional register is confident and commercial, closer to a sports scoreboard than a SaaS dashboard.

**Key Characteristics:**
- Dark violet canvas (`violet-night` / `violet-ink`) with one luminous accent (`violet-glow`).
- One family, two widths: expanded Archivo for headlines and numerals, normal width for reading.
- Money phrases and selected answers carry the glow; the rest of the headline stays white.
- Secondary text is lilac-tinted (`text-soft`), never grey.
- Real photography only: KP team in purple polos, owners with plaques, testimonial posters.
- Soft rectangles at 8 / 12 / 16px; circles only for small markers.
- Depth from violet light and dark drop, never grey haze on dark.

## Colors

One hue family, from night violet to pale lilac, plus paper and ink neutrals for the single light pause and the proof card.

### Primary
- **Violeta Brilho / Glow Violet** (`violet-glow`): the brand's voice. Primary button fill, the money phrase inside H1/H2 (`<em>`), the selected quiz tile numeral and its filled check, the progress bar, step-rail rings, FAQ plus icons, promise ticks, and the "1M" plaque numeral. As text on `violet-night` it reaches 4.96:1.
- **Violeta Núcleo / Core Violet** (`violet-core`): primary button hover fill (white on it is 5.99:1) and the hero's top-right light leak.
- **Violeta Faixa / Band Violet** (`violet-band`): the full-bleed partner-handle marquee strip under the hero. Nowhere else.

### Secondary
- **Violeta Elétrico** (`violet-electric`) and **Violeta Real** (`violet-royal`): the closing section's radial gradient stops. `violet-royal` is also the accent ink on paper: the proof card's big numeral and the owner name (10.1:1 on `paper`).
- **Violeta Profundo / Deep Violet** (`violet-deep`): media placeholders behind posters and video, the top stop of the quiz card gradient, scrollbar thumb.

### Tertiary
- **Lilás** (`lilac`): focus ring, the closing headline's highlighted phrase, testimonial owner names on dark, and (at 18–45% alpha) every hairline border on dark (`--line` = lilac @ 18%).
- **Lilás Suave / Soft Lilac** (`text-soft`): all secondary text on violet: ledes, hints, card copy, captions, FAQ answers (12.9:1 on `violet-night`).

### Neutral
- **Noite Violeta / Violet Night** (`violet-night`): hero, statement, testimonials and FAQ grounds; fill of tiles and option rows (at 65% alpha).
- **Tinta Violeta** (`violet-ink`): body background and the alternating dark sections (steps, team).
- **Noite Profunda / Footer Night** (`night-footer`): footer only. Neutral black is no longer used anywhere.
- **Grafite** (`graphite`): body text on paper and input text.
- **Tinta Marinho** (`navy-ink`): H2 on the paper Placas section.
- **Tinta Suave / Soft Ink** (`text-on-light-soft`): secondary text on paper (10.8:1).
- **Névoa** (`mist`): input border.
- **Papel** (`paper`): the Placas section and the proof card.
- **Branco** (`white`): primary text on dark, input fields, button labels.
- **Erro** (`error`): field and send errors on dark (8.1:1 on `violet-ink`), always paired with text and `aria-invalid`.

### Named Rules
**The One Glow Rule.** `violet-glow` is the only accent and it marks money or choice: one money phrase per headline, the selected answer, and the single primary action in view. Never two filled glow buttons in one viewport; the mobile dock hides while the quiz is on screen.

**The Dark-First Rule.** Sections default to `violet-night` / `violet-ink`, alternating. The paper Placas section is the single light pause; paper otherwise appears only inside the proof card. Do not add a second paper section.

**The Brand-Is-Purple Rule.** No second accent hue. Light comes from the violet family; errors use `error` on dark. Secondary text is lilac (`text-soft`), not grey.

## Typography

**Display Font:** Archivo variable (wght 100–900, wdth 62–125), self-hosted at `/fonts/archivo-var.woff2`, preloaded, `font-display: swap`
**Body Font:** Archivo (same file)
**Fallback:** "Archivo Fallback", a metric-matched local Arial (`size-adjust: 104%`, `ascent-override: 88%`, `descent-override: 21%`, `line-gap-override: 0%`), then `system-ui`

**Character:** a grotesk whose width axis is a design tool. Stretched to 115–125% it reads like a scoreboard: wide, heavy, numeric. At 100% it is a calm reading sans. One file, no pairing.

### Hierarchy
- **Display** (800, clamp(2.35rem → 4.6rem), 0.98, wdth 118): the H1 only. Money phrase in `violet-glow`.
- **Statement** (600 with 800 for facts, clamp(1.6rem → 4rem), 1.08, wdth 112): the "KP em números" paragraph; `text-soft` base, facts in white, the revenue phrase in glow. Max 27ch.
- **Headline** (800, clamp(1.9rem → 3.2rem), 1.04, wdth 115): every H2, max 20ch, `text-wrap: balance`. The closing H2 runs larger (clamp(2.1rem → 3.8rem)).
- **Numeral XL** (800, clamp(3rem → 4.5rem), 0.9, wdth 125): plaque milestone in the Placas photo caption ("350K", "1M").
- **Numeral** (800, wdth 125, tabular lining figures): quiz tile values (clamp(1.7rem → 2.3rem)), proof card result (clamp(2.2rem → 3rem)), testimonial poster result (2rem). The unit line under a numeral drops back to wdth 100, 600, 0.8125–0.9375rem.
- **Title** (700, clamp(1.35rem → 1.75rem), 1.15, wdth 108): quiz question. **Title SM** (700, 1.25rem, 1.2, wdth 108): step names. FAQ summary is 700, 1.125rem, wdth 104.
- **Lede** (400, clamp(1.05rem → 1.2rem), 46ch): hero lede. Section ledes are 1.0625rem, max 52ch, `text-soft`.
- **Body** (400, 1rem, 1.55, wdth 100): paragraphs, quotes, FAQ answers; max 52–60ch.
- **Button** (700, 1.1875rem, +0.01em, wdth 108). 19px bold counts as large text, so white on glow (3.88:1) passes AA; never set button labels smaller.
- **Label** (600, 0.875rem): field labels, owner lines. **Caption** (400, 0.8125rem): progress text, privacy note, header stat, footer.

### Named Rules
**The Numbers-Are-Bold Rule.** In every claim and testimonial the number and its unit are bold (700) inside regular text; standalone numbers are 800 and expanded to wdth 125 with `tabular-nums lining-nums`. That is how KP reads at a glance.

**The Width-Is-Voice Rule.** Expanded width (108–125%) is for headlines, numerals and button labels; reading text stays at 100%. Never expand a paragraph; never condense a number.

**The One-Family Rule.** Archivo is the only typeface. Do not add a second family or load static weights; the variable file covers every role.

## Layout

- Container `max-width: 1180px`, gutter clamp(16px → 48px). Sections pad clamp(72px → 128px) vertically; the statement uses clamp(64px → 128px), the close clamp(80px → 150px).
- Hero: logo left, revenue stat right; below, a single column on mobile (H1, lede, quiz, proof). From 980px a two-column grid `1.05fr 1fr` with areas "intro quiz / proof quiz": the quiz stands right, the proof reveals under the copy.
- Steps rail: vertical list with a 34px numbered circle and a glow-to-transparent connector on mobile; four columns with a horizontal connector from 900px.
- Placas: heading over a two-up 4:5 photo grid (from 560px); from 1000px heading left, `740px` grid right, bottom-aligned.
- Testimonials: horizontal scroll-snap rail (`min(78vw, 300px)` columns) below 1100px; five equal columns above.
- Team and FAQ: two columns from 900px (`1fr 1fr`, `.8fr 1.2fr`).
- Mobile (< 980px): a fixed CTA dock 12px from the edges appears once the quiz scrolls out of view.
- Internal rhythm: 10px between tiles/rows, 12px between fields and actions, 16px between cards, 20px from question to options.

## Elevation & Depth

Depth comes from light and from darkness below, not grey shadow. Dark cards sit on deep black-violet drops; the glow color itself is the lift for anything actionable. The hero carries two large radial light leaks (`violet-core` @ 55% top right, `violet-glow` @ 22% bottom left) behind content.

### Shadow Vocabulary
- **Glow CTA** (`box-shadow: 0 10px 28px -8px rgb(157 92 255 / .7)`; hover `0 14px 34px -8px rgb(157 92 255 / .85)`): primary buttons.
- **Glow Selected** (`box-shadow: 0 12px 30px -10px rgb(157 92 255 / .55)`): the selected quiz tile.
- **Night Drop** (`box-shadow: 0 30px 60px -20px rgb(0 0 0 / .55)`): quiz card and proof card on dark.
- **Paper Lift** (`box-shadow: 0 18px 40px -18px rgb(22 0 56 / .45)`): Placas photos on paper (violet-tinted, not grey).
- **Glow Media** (`box-shadow: 0 30px 70px -20px rgb(122 47 241 / .55)`): the team photo.
- **Dock** (`0 12px 32px -6px rgb(0 0 0 / .6), 0 10px 28px -8px rgb(157 92 255 / .7)`): sticky mobile CTA over content.

### Named Rules
**The Light-Not-Haze Rule.** On dark grounds, lift is a violet glow or a deep black drop with a strong negative spread; never a soft grey shadow.

## Shapes

Soft rectangles in three steps. `sm` (8px): buttons, inputs, skip link. `md` (12px): quiz tiles, option rows, partner handle images. `lg` (16px): quiz card, proof card and its empty state, testimonial cards, Placas photos, team photo. Circles (`full`) only for small markers: the tile check, play buttons, step numbers. Hairlines are 1px `--line` (lilac @ 18%) on dark; the proof empty state uses a 1px dashed lilac @ 30% border. No pills.

## Components

### Buttons
- **Shape:** gently rounded (8px), minimum height 56px, padding 17px 26px.
- **Primary:** `violet-glow` fill, white Button-type label, Glow CTA shadow. Labels name the action: "Continuar diagnóstico", "Pedir diagnóstico", "Fazer o diagnóstico".
- **Hover / Active / Focus:** fill shifts to `violet-core` and the glow deepens; active nudges down 1px; focus is the global 2px `lilac` outline at 3px offset.
- **Disabled / Busy:** 38% opacity, no shadow (quiz "next" until an answer is chosen); busy 70% with `aria-busy`.
- **Back:** text-only underlined `text-soft` link-button, 48px min height, beside the primary in quiz steps.

### Quiz card (signature)
- Gradient panel `linear-gradient(180deg, rgb(74 27 151 / .55), rgb(26 1 71 / .9))`, 1px `--line` border, 16px radius, Night Drop.
- Header: "Passo N de 4 · menos de 30 segundos" caption plus a 4px glow progress bar (max 160px) that scales 25% per step.
- **Number tiles:** 2×2 grid of 104px-tall tiles: Numeral value ("1–5", "6–15", "16–30", "30+") over a "motos/mês" unit, an empty 22px circle top-right. Rest: night @ 65% fill, lilac @ 28% border. Hover: glow border. **Selected:** glow border, glow @ 16% tint, Glow Selected shadow, numeral turns glow, the circle fills glow with a white check. Arrow keys move and select (radio group).
- **Option rows:** full-width 56px rows, 12px radius, 600 weight; selected = glow border + glow @ 16% tint.
- Steps fade up 10px over .45s. Privacy line with a lock icon closes the card.

### Inputs / Fields
- **Style:** white field, 8px radius, 1px `mist` border, 16px text (no iOS zoom), 50px min height, `graphite` text, label above at 0.875rem/600.
- **Focus:** 2px `lilac` outline at 2px offset plus a glow border.
- **Error:** `error` border and 1px ring, message in `error` below, `aria-invalid` and `aria-describedby` set; send failure shows a `role="alert"` line that keeps answers.

### Proof card (signature)
- `paper` card, 16px radius, Night Drop; poster column 150px from 560px, stacked below. Big result in `violet-royal` Numeral, quote at body size with bold numbers, owner line in `violet-royal` 700 with store in `text-on-light-soft`, a hairline-separated second partner result.
- **Reveal:** the one authored motion. On tile selection the card wipes in from the top with `clip-path: inset(0 0 100% 0 round 16px) → inset(0)` and `blur(6px) → 0` over .8s on `cubic-bezier(.16, 1, .3, 1)`. Before any answer, a dashed empty state explains what will appear.
- Centered 56px circular play button over the poster.

### Testimonial video cards
- `violet-ink` card, 1px `--line` border, 16px radius. 9:13 poster with a bottom night gradient carrying the result Numeral (2rem) and its unit.
- 48px circular play button **top-right** (night @ 45%, white @ 55% border, 4px backdrop blur; hover scale 1.06 and glow @ 60%).
- Video loads only on tap: the button is replaced by a `<video controls playsinline>`; the overlay hides once video is present.
- Quote in `text-soft` 0.9375rem with numbers bold white; owner line in `lilac` 700.

### Partner marquee
`violet-band` strip, 14px vertical padding, handle images 175×66 at 12px radius, 12px gap; duplicated track slides linearly over 60s, pauses on hover, edges masked 60px. Duplicates are `aria-hidden`.

### Steps rail
Ordered list on `violet-ink`: 34px circle numbers (800, tabular, `violet-night` fill, 1.5px glow ring) joined by a glow-to-10% connector; step name in Title SM, description in `text-soft` (max 34ch) with key phrases bold white.

### Placas gallery (signature)
On `paper`, the single light pause. Two 4:5 photos of owners holding plaques, 16px radius, Paper Lift. The caption sits on the photo over a night gradient: the milestone in Numeral XL (the top milestone "1M" in glow, others white) above "Placa de Faturamento KP" in `text-soft`. H2 in `navy-ink`, lede in `text-on-light-soft`.

### FAQ
`details` list with 1px `--line` rules top and bottom; summary 1.125rem/700, 48px min height, a glow SVG plus that rotates 45° (.3s) when open. Answers in `text-soft`, max 60ch. First item open.

### Closing section
Centered, `radial-gradient(120% 90% at 50% 0%, violet-electric, violet-royal 45%, violet-night 100%)`; larger H2 with the phrase highlighted in `lilac` (glow would vanish on the electric ground), `text-soft` line, one primary button back to the quiz.

### Navigation
No top nav. Header row: white monogram (124px) left, revenue stat caption right ("+R$18 milhões por mês" in white, wdth 112). Skip link to the quiz. Mobile sticky dock with the primary button. Footer on `night-footer`: monogram (96px), CNPJ line, "Voltar para o topo" link in white.

## Do's and Don'ts

### Do:
- **Do** keep every dark section on `violet-night` (#160038) or `violet-ink` (#1A0147), alternating.
- **Do** highlight exactly one money phrase per headline in `violet-glow` (#9D5CFF); use `lilac` instead on the electric closing gradient.
- **Do** set headlines and numerals in expanded Archivo (wdth 108–125) and reading text at wdth 100.
- **Do** use `text-soft` (#D9CCFF) for secondary text on violet and `text-on-light-soft` (#3D3747) on paper.
- **Do** bold numbers and units inside quotes and claims; use `tabular-nums lining-nums` on every numeral.
- **Do** use real KP team and client photos; posters first, video on tap.
- **Do** keep the proof reveal (clip-path + blur, .8s) as the page's only authored motion; everything else is state feedback under .6s, and all motion collapses under `prefers-reduced-motion`.
- **Do** keep tap targets at 48px minimum (56px for primary buttons and option rows).

### Don't:
- **Don't** introduce a second accent hue (no blue, orange, teal); light comes from the violet family.
- **Don't** set body copy in `violet-glow` or small text on `violet-glow` fills (white on glow is 3.88:1).
- **Don't** add eyebrow or kicker chips above headlines; the H2 carries the section on its own.
- **Don't** add a second typeface or static font files; Archivo variable is the only face.
- **Don't** use neutral black (#080808) grounds; the darkest surface is `night-footer` (#0B001F).
- **Don't** add a second paper section or put white/ghost buttons and white text on `paper`.
- **Don't** use stock photography or generic motorcycle renders.
- **Don't** auto-open popups or autoplay video.
