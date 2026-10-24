# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro (static output) + CSS custom properties, deployed to a static host/CDN. Chosen because the current WordPress/Elementor build fails Core Web Vitals on first mobile visit (CLS 1.01 on home, LCP 4.9s on /moto) and almost all traffic is paid mobile traffic hitting a cold cache. Astro ships zero JS by default, keeps the quiz as one small island, and lets fonts/images be self-hosted and preloaded. Revisit only if the team needs a CMS editor; then add a headless CMS, not Elementor.

## Users

**Primary: owner of a vehicle store in Brazil** (motorcycles, cars, trucks or multimarcas; motorcycle franchise dealers such as Shineray are the largest group). Small-to-mid operation, sells roughly 1–45 units/month, often in an interior city. Arrives from a paid ad (Meta/Instagram) on a phone, usually between customer interactions at the store. Job: "sell more vehicles this month, and stop wasting money on digital that doesn't turn into sales."

**Secondary:** store manager, sales leader or consultant who influences the decision (the quiz asks for role: Dono, Gerente, Consultor, Líder de vendas). Since 2026-10-24 the landing page addresses motos, carros, caminhões and multimarcas equally (owner decision, matching the original home); the quiz opens on segment and adapts the volume brackets.

## Product Purpose

KP Assessoria is a marketing and sales advisory for vehicle stores. It runs paid campaigns that generate leads, trains the store's sales team to close those leads, tracks the numbers that matter (investment, return, financing approval rate), and builds the store's local brand. Success for the client is measured in vehicles sold and revenue, not clicks. Success for the landing page is a qualified lead (role, segment, monthly volume, revenue, contact) that the KP team calls within 8 business hours.

## Positioning

Niche specialist: KP works only with vehicle stores, mostly motorcycles, and sells on results (revenue and units), not on marketing deliverables. It combines traffic + sales-team training + close follow-up ("sem hora pra sair, sem final de semana") in one offer. Signature ritual: **Placas de Faturamento**, physical revenue plaques awarded to clients when they hit milestones (e.g. 350K, 1M), photographed with the owners.

## Operating Context

- Funnel: paid ad → landing page (home or /moto) → 4-step qualification quiz or short form → WhatsApp / phone contact from a specialist within 8 business hours → meeting.
- Quiz fields: role; segment (Motos, Carros, Caminhões, Veículos em geral, Outros); monthly unit sales by segment; monthly gross revenue band; e-mail, name, phone, company name.
- Clients are concentrated in the Shineray dealer network plus regional multimarcas; owners talk to each other, so social proof by recognizable store name carries weight.
- Brazilian Portuguese only.

## Capabilities and Constraints

- Service pillars (as stated on the current site): customer acquisition campaigns; sales-team training; clear performance indicators; local brand authority ("nº 1 da região"); revenue-focused campaigns.
- Capacity is limited; scarcity message "nem sempre temos vagas abertas" is a real commercial constraint, not a gimmick.
- Legal entity: CNPJ 52.161.498/0001-78. Site previously developed by ByGrow.
- Undecided: whether the new site keeps a separate /moto page or merges into one motorcycle-first home; whether WhatsApp direct link replaces the form for some traffic.

## Brand Commitments

- Name: **KP Assessoria** (also "Assessoria KP" in legal footer).
- Logo: white serif monogram "KP" split by a thin vertical line, with "KP ASSESSORIA" set in spaced caps across it (`assets/brand/kp-monogram-white.png`). Used on dark violet backgrounds.
- Color: the violet/purple family is the brand and must be preserved (see DESIGN.md). Typeface may change.
- Voice: direct, salesy, results-first, Brazilian-informal ("Clientes novos batendo à sua porta", "Campanhas que fazem o caixa crescer", "Agarre a oportunidade"). Talks money and units, not marketing jargon. Confirmed binding by the owner.
- Photography: real KP team (purple polo shirts with the KP mark) and real clients with their plaques. No stock imagery. Confirmed binding by the owner.

## Evidence on Hand

Official numbers (confirmed, from the home page): **mais de R$18 milhões faturados por mês para clientes**, **+4 anos de experiência**, **+120 empresas assessoradas em todo Brasil**. The /moto page shows different figures (R$11MM/mês, +100 milhões); do not use those.

Testimonials (real, on the current site). **The new landing page uses only the five from the current home (Túlio, Lucas, Lívia, Renan, Vanessa), quoted verbatim with their video posters** (owner decision, 2026-10-14); João, Rian and Shineray Itaboraí appear only on /moto:
- Túlio, Shineray Bom Jesus da Lapa: 23 motos na primeira semana do lançamento da loja.
- Lucas, VR Multimarcas: de 7% para 27%+ de aprovação dos leads em 21 dias.
- Lívia, Avelloz: de quase zero para 8+ motos/mês pelo digital.
- Renan, Shineray Valinhos: de 5% para 20%+ de aprovação no financiamento; fecha 50%+ dos aprovados.
- Vanessa, VMA Motos: meta batida em 21 dias; digital de 2–3 para 16 motos/mês em menos de 60 dias.
- João, Shineray Ipojuca: R$350 mil de faturamento no primeiro mês.
- Rian, CEO Pacific Motors: faturamento dobrou; suporte 24h.
- Shineray Itaboraí: 45 dias, operação mais alinhada.

Assets: client video testimonials (vertical, currently huge unoptimized files), client Instagram handle chips (@vma_motos, @arenamotosvr, @urby.nh, etc.), plaque photos, team hero photo (`assets/brand/hero-time-kp.webp`), full-page reference screenshot (`.impeccable/ref/home-full.jpeg`).

Absent, must not be fabricated: pricing, contract terms, case studies with full data, press mentions, certifications, ad-platform partner badges.

## Product Principles

1. **Money and vehicles sold, not marketing.** Every claim is expressed in revenue, units sold or approval rate.
2. **Proof from people the visitor knows.** Named stores and owners outrank abstract claims; the Shineray network is the reference crowd.
3. **Phone-first, ad-first.** The page is judged on a mid-range Android over 4G, opened from an ad, in under 3 seconds.
4. **Qualify while converting.** The quiz exists so the sales team calls the right stores first; keep it short but keep the qualifying fields.
5. **Close and human.** KP sells presence and follow-up; the real team's faces are part of the offer.

## Accessibility & Inclusion

No formal standard required by the client. Target WCAG 2.2 AA for text contrast and tap targets, since visitors read on phones in bright store environments.
