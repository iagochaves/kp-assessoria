# Plano: envio de lead no formato do n8n, tags de tracking e página de obrigado

Data: 2026-10-24
Escopo: `site/` (Astro). Objetivo: trocar o WordPress pela landing Astro sem quebrar o fluxo do n8n, a atribuição de mídia (Meta, GTM, Clarity) nem a jornada pós-lead.

---

## 1. O que existe hoje no WordPress (levantado em 2026-10-24)

### 1.1 Formulário (Elementor Pro, popups 459 e 773)

- O navegador envia para `admin-ajax.php`; quem chama o n8n é o **servidor** do WordPress.
- Webhook: `POST https://kpadm-n8n.a6hrr3.easypanel.host/webhook/0f7d41ea-76e5-4c56-b1ad-078b867e1c1c`
- Modo simples (`webhooks_advanced_data` desligado): corpo `application/x-www-form-urlencoded`, **chave = label do campo**, mais metadados do Elementor.
- Depois do envio: redirect para `/obrigado`.
- O n8n aceita CORS de qualquer origem (o `OPTIONS` devolve `access-control-allow-origin` igual ao Origin enviado, métodos `OPTIONS, POST`). Então o navegador pode postar direto, sem backend.

Valores reais confirmados na submission #1054 (22/10):

| Chave enviada ao n8n (label) | id Elementor | Valores possíveis (value) |
|---|---|---|
| `Qual sua função na empresa?` | field_2304df6 / funcao | `dono`, `gerente`, `consultor`, `lider`, `outro` |
| `O que você vende?` | venda | `Motos`, `Carros`, `Caminhoes`, `Veiculos em Geral`, `Outros` |
| `Quantas vendas faz mensalmente de motos?` | moto | `Ainda não abri a loja`, `Vendo de 1-4 motos/mês`, `Vendo 4-8 motos/mês`, `Vendo de 8-15 motos/mês`, `Vendo de 15-25 motos/mês`, `Vendo de 25-45 motos/mês`, `Acima de 45 motos/mês` |
| `Quantas vendas faz mensalmente de carros?` | carro | `Ainda não abri a loja`, `Vendo de 1-4 carros/mês`, `Vendo de 4-8 carros/mês`, `Vendo de 8-12 carros/mês`, `Vendo de 12-20 carros/mês`, `Vendo acima de 20 carros/mês` |
| `Quantas vendas faz mensalmente de caminhões?` | caminhao | `Ainda não abri a loja`, `Vendo de 1-2 caminhões/mês`, `Vendo de 2-3 caminhões/mês`, `Vendo de 3-6 caminhões/mês`, `Vendo acima de 6 caminhões/mês` |
| `Qual seu faturamento bruto mensal?` | geral **e** outros (mesmo label) | `Ainda nao tenho`, `Até 20 mil`, `De 20 mil a 40 mil`, `De 40 mil a 80 mil`, `De 80 mil a 120 mil`, `De 120 mil a 200 mil`, `De 200 mil a 300 mil`, `De 300 mil a 500 mil`, `Mais de 600 mil` |
| `Seu melhor e-mail` | email | texto |
| `Seu nome` | name | texto |
| `Número` | field_d2afb88 | só dígitos com DDI: `55DDNNNNNNNNN` |
| `Nome da sua empresa` | message | texto |
| `utm_source` … `utm_term` | utm_* | da URL; sem nenhuma UTM, `utm_source=orgânico` |
| metadados | — | `Date`, `Time`, `Page URL`, `User Agent`, `Remote IP`, `Powered by`, `form_id` (`f078c20`), `form_name` (`New Form`) |

Lógica do quiz no WP: Motos, Carros e Caminhões perguntam **volume**; Geral e Outros perguntam **faturamento**. Campos que não se aplicam vão vazios.

> Bug atual (não precisa ser replicado): `outros` e `geral` têm o mesmo label. No modo simples o último sobrescreve o anterior, então leads "Outros" provavelmente chegam no n8n com faturamento vazio. Na Astro mandamos uma única chave, preenchida com o valor de quem respondeu.

### 1.2 Tags

No HTML há só o **GTM-NPXMNQSL** (home e obrigado). Dentro do container (versão publicada):

| Tag | Disparo | Detalhe |
|---|---|---|
| Meta Pixel `PageView` | todas as páginas (`gtm.js`) | 2 pixels: `3785399351716268`, `1025889757007945`; envia `_fbc` e `_fbp` |
| Meta Pixel `Lead` | `gtm.formSubmit` **e** `gtm.elementId` contém `MQL` | advanced matching: lê `input#form-field-name`, `input#form-field-field_d2afb88`, `input#form-field-email` |
| Microsoft Clarity | todas as páginas | projeto `yfvwstk5lh` |
| 2 tags pausadas | — | provavelmente cookies `fn/ln/email/phone_cookie` |
| Listeners | — | 2 de clique (`__cl`) e 1 de form submit (`__fsl`) |

Não há GA4 nem Google Ads publicados.

Script MQL (só no popup 773): troca o `id` do `<form>` e do botão para `MQL` ou `TOP` e faz `dataLayer.push` de `kp_prepare_lead_click`, `kp_form_submit` e `kp_form_submit_success`, com `clickId`, `formId`, `leadType`, `lead_type`, `isMQL` e `segmento`.

Regra MQL: `consultor` nunca é MQL. Fora isso:
- Motos: ≥ 8-15/mês
- Carros: ≥ 4-8/mês
- Caminhões: ≥ 2-3/mês
- Geral/Outros: faturamento ≥ 80-120 mil

**Ou seja: o Meta só recebe `Lead` de MQL.**

### 1.3 Página `/obrigado`

- Título "Cadastro · Concluído!"
- "Assista ao vídeo antes de entrar na comunidade" + "Em 2 minutos você entende exatamente o que acontece a partir de agora."
- Vídeo VSL `wp-content/uploads/2026/09/VSL-KP-01.mp4` com **autoplay e 165 MB**.
- Imagem `2025/11/Sem-nome-800-x-400-px-1.png`.
- Botão "ENTRAR NA COMUNIDADE AGORA" → `https://chat.whatsapp.com/BVVx0Efphb8AchpojshEGp`.
- O texto fala de um botão do Instagram que não existe na página.

---

## 2. Diferenças da Astro hoje que quebram a integração

1. Envia JSON com chaves próprias (`segmento`, `vendas_mes`, `nome`…), mas o n8n espera form-urlencoded com os labels.
2. As faixas de volume (`1-5`, `6-15`…), os cargos (`Dono ou sócio`…) e o faturamento (4 faixas) não batem com os valores do WP, então a regra de MQL e o que o n8n faz depois ficam errados.
3. Falta o segmento "Outros".
4. Pergunta faturamento para todos (no WP, só Geral e Outros).
5. Chama `fbq('track','Lead')` direto: o `fbq` só existe via GTM, e isso dispararia Lead também para TOP.
6. Não tem GTM nem página `/obrigado`; o fim é um passo dentro do quiz.
7. O e-mail é opcional na Astro e obrigatório no WP.

---

## 3. Plano de implementação

### Passo 1: alinhar o modelo do quiz ao WP (`src/data/content.ts`)
- `segments`: 5 opções. `value` = valor do WP (`Motos`, `Carros`, `Caminhoes`, `Veiculos em Geral`, `Outros`). O label visível pode continuar o da Astro.
- `brackets`: trocar pelas faixas do WP por segmento, inclusive "Ainda não abri a loja". `value` = texto exato do WP. Remapear `lead`/`also` (cartão de prova) para as novas faixas.
- Geral e Outros: o passo 2 vira **faturamento** com as 9 faixas do WP, no lugar de volume.
- `roles`: label visível livre; `value` = `dono|gerente|consultor|lider|outro`.
- Remover o passo "faturamento para todos", ou mantê-lo só para Geral/Outros (ver decisão D1).
- E-mail obrigatório (D2).

### Passo 2: montar o payload no formato Elementor (`src/lib/lead.ts`, novo)
- Função `buildElementorPayload(answers, contato)` que devolve `URLSearchParams` com as chaves exatas da tabela 1.1, campos não aplicáveis vazios, `Número` normalizado para `55` + DDD + número.
- UTMs com a mesma regra do WP (sem UTM → `utm_source=orgânico`).
- Metadados: o webhook real (execução de produção conferida em 2026-10-24) recebe só `form_id` = `f078c20` e `form_name` = `New Form`. `Date`, `Time`, `Page URL` etc. **não** chegam. Os campos de passo/HTML chegam como `No Label field_xxx` vazios e não são lidos.
- Chaves que o Code node do n8n lê: `O que você vende?`, `Qual sua função na empresa?`, `Quantas vendas faz mensalmente de motos?` / `...carros?` / `...caminhões?`, `Qual seu faturamento bruto mensal?`, `Seu nome`, `Seu melhor e-mail`, `Número`, `Nome da sua empresa`, `utm_source`, `utm_campaign`, `utm_content`, `utm_term`. Enviar essas, mais `utm_medium`, `form_id` e `form_name`.
- Chaves extras para diferenciar a origem sem quebrar nada: `origem` = `astro`, `lead_type` = `MQL|TOP`, `fbclid`.
- `fetch(endpoint, { method: 'POST', body: params })`. Sem header manual: o navegador manda `application/x-www-form-urlencoded`, que é uma requisição simples, sem preflight.
- Teste unitário (vitest) de `buildElementorPayload` e da regra MQL, um caso por segmento.

### Passo 3: regra MQL + dataLayer (`src/lib/mql.ts`)
- Portar `verificarMQL` com as mesmas listas.
- Replicar o contrato que o GTM lê:
  - `<form id="MQL|TOP" data-lead-type>`, atualizado a cada resposta.
  - Inputs com ids `form-field-name`, `form-field-field_d2afb88`, `form-field-email`, `form-field-message` (as labels continuam via `for`).
- Mesmos eventos: `kp_prepare_lead_click` (pointerdown no submit), `kp_form_submit`, `kp_form_submit_success`, com `clickId`, `formId`, `leadType`, `lead_type`, `isMQL`, `segmento`.
- Remover o `fbq(...)` direto e o evento `lead` antigo.
- Ordem no submit: validar → evento `submit` nativo (o listener `gtm.formSubmit` do GTM captura, a tag Lead lê o form id e os inputs) → `fetch` → `kp_form_submit_success` → redirect para `/obrigado`.
  - Risco: se o trigger do GTM tiver "Verificar validação" ligado, um `preventDefault` bloqueia o disparo. No WP funciona com o Elementor, que também faz `preventDefault`, então deve estar desligado. Confirmar no GTM Preview (Passo 6).

### Passo 4: GTM no layout (`src/layouts/Base.astro`)
- Snippet padrão do GTM-NPXMNQSL no `<head>` + `<noscript>` no início do `<body>`. Com isso chegam Pixel PageView, Lead (MQL) e Clarity sem tocar no container.
- ID via `PUBLIC_GTM_ID` no `.env`, sem GTM em dev para não sujar os dados.
- Performance: snippet `async` padrão. Não atrasar até a interação, para não perder PageView de quem sai rápido. Medir LCP/INP depois.
- `public/_headers`: se houver CSP, liberar `googletagmanager.com`, `connect.facebook.net`, `facebook.com`, `clarity.ms` e o domínio do n8n.

### Passo 5: página `/obrigado` (`src/pages/obrigado.astro`)
- Mesmo conteúdo e CTA do WP, no visual da Astro: confirmação, "Assista ao vídeo antes de entrar na comunidade", VSL, botão "Entrar na comunidade agora" → link do grupo do WhatsApp.
- `<meta name="robots" content="noindex">` e fora do sitemap.
- VSL: recomprimir os 165 MB (H.264 720p, ~2 Mbps, `+faststart`, sem áudio duplicado; algo como 15–25 MB) + poster. Sem autoplay com som: começa mudo com botão de play/som, ou carrega ao tocar (D4).
- Sem tag extra: o PageView vem do GTM. Lead **não** dispara aqui (já disparou no submit), para não contar em dobro.
- Corrigir ou remover a menção ao Instagram (D5).

### Passo 6: verificação antes de publicar
1. `vitest` do payload/MQL.
2. Payload real: apontar `PUBLIC_LEAD_ENDPOINT` para um webhook.site e comparar chave por chave com a tabela 1.1. Depois, um envio de teste no n8n de produção com nome `TESTE KP ASTRO`, combinado com quem cuida do CRM para apagar (D6).
3. GTM Preview (Tag Assistant) na URL de staging: PageView ×2 pixels e Clarity no load; `Lead` só com perfil MQL; nada de Lead com consultor ou volume baixo.
4. Meta Events Manager → Test Events: Lead com advanced matching (em/ph/fn) aceito.
5. Playwright: fluxo de cada segmento até `/obrigado`.
6. Lighthouse mobile da home com GTM ativo, comparado com o baseline sem GTM.

### Passo 7 (opcional, precisa de acesso ao GTM): limpeza
- Trocar o trigger da tag Lead de "form submit + id contém MQL" para o evento customizado `kp_form_submit_success` com `isMQL = true`. Assim o Lead só conta depois que o n8n respondeu ok, e a landing deixa de depender dos ids `form-field-*`.
- Corrigir no WP já: os 6 CTAs abrem o popup 459, que não tem o script MQL. Apontá-los para o 773 enquanto o WP estiver no ar.

---

## 3b. Achados no Code node do n8n (2026-10-24)

- Classificação A/B/C/D no n8n ≠ regra MQL do front: Caminhões `1-2` = B no n8n, mas TOP no front; Geral `40-80 mil` = B no n8n, mas TOP no front.
- Outros: o faturamento chega vazio (label duplicado, `geral` sobrescreve) → sempre C. E o `parseInt` dos dígitos classifica `Mais de 600 mil` (= 600) como C e `De 40 mil a 80 mil` (= 4080) como C. Outros nunca vira A.
- `utm_medium` chega, mas não vai para a saída.

## 4. Decisões

Respondidas em 2026-10-24: D1 = seguir o WP à risca; D2 = e-mail obrigatório; D4 = recomprimir e hospedar; D3/D7 = há acesso ao n8n e ao GTM (o Passo 7 entra no escopo; conferir as chaves usadas pelo n8n antes do Passo 2).

Ainda em aberto: D5, D6.


- **D1** Estrutura do quiz: seguir o WP à risca (volume para Motos/Carros/Caminhões, faturamento só para Geral/Outros) ou manter a pergunta extra de faturamento para todos? Recomendado: à risca. A pergunta extra mandaria um dado que o n8n não espera, com o mesmo label.
- **D2** E-mail obrigatório como no WP? Recomendado: sim (advanced matching do Meta + n8n).
- **D3** Há acesso ao fluxo do n8n? Com acesso, confirmo quais chaves ele usa e dá para migrar para JSON limpo depois. Sem acesso, replicamos tudo, metadados inclusos.
- **D4** VSL: recomprimir e hospedar no site (recomendado) ou continuar puxando do WordPress?
- **D5** Instagram na obrigado: adicionar o botão (@ da KP) ou tirar a frase?
- **D6** Quem pode apagar o lead de teste no CRM/n8n?
- **D7** Acesso ao GTM para o Passo 7?
