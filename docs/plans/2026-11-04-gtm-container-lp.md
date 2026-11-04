# GTM container próprio da LP + carregamento rápido do tracking — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar a landing `diagnostico.assessoriakp.com.br` do container compartilhado GTM-NPXMNQSL, dar a ela um container próprio, versionado no repo, e fazer o PageView do Meta disparar o mais cedo possível, para recuperar o connect rate (hoje ~30%).

**Architecture:** O container novo é um JSON de import do GTM versionado em `site/gtm/`, com testes que travam as regras (sem seletores do Elementor, PageView no trigger Initialization, Lead só via dataLayer). O site carrega o `gtm.js` assim que o `<head>` é lido (sem esperar `load`/idle) e publica o Lead como evento de dataLayer depois do sucesso do n8n, esperando o GTM antes de ir para `/obrigado/`. O WordPress continua no container antigo, que não muda.

**Tech Stack:** Astro 5, TypeScript, `node:test`, Google Tag Manager (formato de export v2), templates Meta Pixel / Event Id / Microsoft Clarity da galeria, Playwright (só para medição).

**Spec:** diagnóstico desta sessão (2026-11-04), resumido em "Contexto" abaixo. O PR #1 (pixel inline) foi fechado por decisão do dono: o caminho é um container GTM próprio.

## Contexto (medido em produção, 2026-11-04)

- Lighthouse mobile 99–100, LCP 1.1–1.6s, CLS 0. A página em si está rápida.
- O PageView sai muito depois da página estar visível (mediana de 3 rodadas, Pixel 7):

| Rede | LCP | gtm.js pedido | PageView |
|---|---|---|---|
| 4G | 0.3s | 0.4s | 1.2s |
| slow 4G | 0.5s | 1.0s | 4.1s |
| 3G | 0.9s | 3.8s | 14.3s |

- Causa: `Base.astro` só injeta o `gtm.js` depois do `load` + `requestIdleCallback` (timeout 2500ms) ou da primeira interação. Depois vem a cadeia `gtm.js` (131KB), `fbevents.js` (112KB), config do pixel (159KB) e só então o `/tr?ev=PageView`.
- Container atual (export v26) tem problemas próprios:
  - Nenhum trigger filtra hostname: o WordPress e a LP misturam PageView, Lead e Clarity.
  - As variáveis de advanced matching leem o DOM do Elementor (`input#form-field-*`), e o Lead depende do `form.id` conter "MQL". A LP imita o Elementor só para isso.
  - O Lead dispara no **envio do form** (`gtm.formSubmit`), antes de saber se o n8n aceitou o lead.
  - Os triggers "clique" e "CLICK DE ENVIAR FORMULARIO" não são usados, mas o container inclui dois click listeners por causa deles.
  - O Clarity recebe `{{Analytics Client ID}}` / `{{Analytics Session ID}}`, mas não existe GA4 no container: valores vazios.
  - `_fbc`/`_fbp` são mandados como custom data, o que não serve para nada (o pixel já lê esses cookies sozinho). As variáveis `(cookie)*_cookie` não são usadas.

## Global Constraints

- Pixel Meta: `3785399351716268` (o mesmo; não criar pixel novo, para não perder histórico e públicos).
- Clarity: projeto `yfvwstk5lh` (o mesmo).
- Previews e branch deploys continuam sem GTM (`PUBLIC_GTM_ID = ""` no `netlify.toml`). Testes nunca podem mandar eventos reais.
- Lead conta só MQL (classe n8n A ou B, `leadType()` em `src/lib/lead.ts`). Isso não muda.
- O contrato do webhook do n8n (`buildBody`) não muda; só ganha o campo extra `lead_id`. Quem chama o n8n passa a ser o servidor do Netlify, nunca o navegador.
- Nada de PII no dataLayer além do que o Lead precisa para advanced matching (`em`, `ph`, `fn`, `ln`), e só no evento `kp_lead`.
- Ordem de release obrigatória: container novo **publicado** antes do deploy do site que aponta para ele (senão a LP fica sem PageView).

## Review Focus

1. **GTM bloqueado (adblock, Brave, ITP):** `eventCallback` nunca roda. O usuário tem que ir para `/obrigado/` mesmo assim, em até 1500ms. Teste em Task 3.
2. **Clique duplo / reenvio no botão final:** só um `kp_lead` e um redirect por carregamento. Teste em Task 3 (o callback chamado duas vezes navega uma vez).
3. **Nome de uma palavra só ("Ana"):** `fn = "ana"`, `ln` ausente (não string vazia, que o Meta conta como valor ruim). Teste em Task 3.
4. **Telefone colado com +55 / autofill do iPhone:** `ph` sai com 12–13 dígitos começando com 55, igual `phone55`. Teste em Task 3.
5. **Lead TOP (classe C/D):** nenhum `kp_lead` com `lead_type: "MQL"`, e o trigger do container exige `lead_type = MQL`. Testes em Task 1 e Task 3.
6. **Lead marcado como spam pelo Akismet:** a função `formSubmitted` só roda para submissões verificadas, então esse lead não chega ao n8n nem ao email. Ele fica em Forms → `lead` → Spam. Checklist da Task 5 inclui olhar o Spam na primeira semana e marcar como verificado o que for real.

---

## File Structure

- `site/gtm/container.json`: create. JSON de import do GTM (formato de export v2) do container novo. É a fonte da verdade da configuração do GTM da LP.
- `site/gtm/container.test.ts`: create. Trava as regras do container.
- `site/gtm/README.md`: create. Como importar, publicar e atualizar o JSON depois de mexer no GTM pela UI.
- `site/public/__forms.html`, `site/src/lib/forms.ts`, `site/src/lib/forms.test.ts`: create. Form `lead` do Netlify Forms e a conversão Netlify Forms ↔ corpo do n8n.
- `site/netlify/functions/lead-to-n8n.mts`: create. Repassa cada submissão verificada ao n8n, pelo servidor.
- `site/src/lib/tracking.ts`: create. Monta o evento `kp_lead` e faz o "push, espera o GTM, depois navega".
- `site/src/lib/tracking.test.ts`: create.
- `site/src/components/Hero.astro`: modify. No sucesso do envio, troca o `location.assign` direto por `pushLeadThen()`.
- `site/src/layouts/Base.astro`: modify. Snippet GTM padrão, carregado na hora, mais `preconnect`.
- `netlify.toml` (raiz do repo): modify. `PUBLIC_GTM_ID` de produção passa a ser o container novo.
- `site/.env.example`: modify. Comentário do GTM.
- `site/scripts/measure-tracking.mjs`: create. Mede quando o PageView sai, com os beacons abortados (versão do script usado no diagnóstico).
- `site/package.json`: modify. Script `test` inclui `gtm/*.test.ts`; script `measure`; devDependency `playwright`.

---

### Task 1: Container GTM novo versionado

**Files:**
- Create: `site/gtm/container.json`, `site/gtm/container.test.ts`, `site/gtm/README.md`
- Modify: `site/package.json` (script `test` passa a ser `node --test src/lib/*.test.ts gtm/*.test.ts`)

**Interfaces:**
- Consumes: os blocos `customTemplate` "Meta Pixel" e "Microsoft Clarity - Official" de `~/Downloads/Google Tag Manager v26.json` (o "Event Id" fica de fora: o site gera o id), copiados com `templateData` e `galleryReference` intactos; remover `accountId`, `containerId`, `templateId`, `fingerprint`, `tagManagerUrl`, `path`.
- Produces: contrato com o site, que a Task 3 respeita:
  - evento de dataLayer `kp_lead`;
  - Data Layer Variables (versão 2): `lead_type`, `lead_class`, `event_id`, `user_data.em`, `user_data.ph`, `user_data.fn`, `user_data.ln`.

Conteúdo do container (`exportFormatVersion: 2`, `containerVersion` com `container.usageContext: ["WEB"]`):

| Tipo | Nome | Configuração |
|---|---|---|
| Tag (Meta Pixel template) | `Meta - PageView` | pixelId `{{Const - Meta Pixel ID}}`, standard `PageView`, `optInMetaCAPI: true` (paridade com o atual), advancedMatching `false`, sem objectPropertyList, `tagFiringOption: ONCE_PER_LOAD`, trigger `2147479573` (Initialization - All Pages) |
| Tag (Meta Pixel template) | `Meta - Lead (MQL)` | standard `Lead`, `eventId` `{{DLV - event_id}}`, advancedMatching `true` com `em/ph/fn/ln` vindos das DLVs, objectPropertyList `content_name = diagnostico-lp`, `lead_class = {{DLV - lead_class}}`, `ONCE_PER_LOAD`, trigger `CE - kp_lead MQL` |
| Tag (Clarity template) | `Clarity` | projectId `yfvwstk5lh`, sem userId/sessionId, trigger `Window Loaded` (Clarity não compete com o PageView) |
| Trigger | `CE - kp_lead MQL` | `CUSTOM_EVENT`, `customEventFilter` event equals `kp_lead`, `filter` `{{DLV - lead_type}}` equals `MQL` |
| Trigger | `Window Loaded` | `WINDOW_LOADED` |
| Variable | `Const - Meta Pixel ID` | `c`, `3785399351716268` |
| Variables | `DLV - lead_type`, `DLV - lead_class`, `DLV - event_id`, `DLV - user_data.em`, `DLV - user_data.ph`, `DLV - user_data.fn`, `DLV - user_data.ln` | tipo `v`, `dataLayerVersion: 2` |
| Built-ins | `Event`, `Page URL`, `Page Hostname` | só esses |

Sem triggers de clique, sem listener de form, sem variável de cookie, sem Custom JavaScript.

- [ ] **Step 1: Escrever `site/gtm/container.test.ts` (falha porque o JSON não existe)**

Carrega `gtm/container.json` com `readFileSync` e define `const v = json.containerVersion`. Testes:

```ts
test('every tag fires on a trigger that exists or is a GTM built-in', ...)
// para cada tag, cada firingTriggerId está em v.trigger[].triggerId ou em ['2147479553','2147479573']

test('PageView fires on Initialization - All Pages, once per load', ...)
// tag com standardEventName=PageView: firingTriggerId deepEqual ['2147479573'], tagFiringOption 'ONCE_PER_LOAD'

test('Lead fires only on kp_lead with lead_type MQL', ...)
// trigger da tag Lead: type 'CUSTOM_EVENT'; customEventFilter arg1 'kp_lead'; filter tem EQUALS {{DLV - lead_type}} 'MQL'

test('Lead advanced matching reads only dataLayer variables', ...)
// advancedMatchingList: nomes deepEqual ['em','ph','fn','ln']; valores deepEqual
// ['{{DLV - user_data.em}}','{{DLV - user_data.ph}}','{{DLV - user_data.fn}}','{{DLV - user_data.ln}}']; eventId '{{DLV - event_id}}'

test('no Elementor DOM reads, Custom JavaScript, cookie variables or click/form listeners', ...)
// JSON.stringify(json) não contém 'form-field-'; nenhuma variável com type 'jsm' ou 'k';
// nenhum trigger com type 'CLICK', 'LINK_CLICK' ou 'FORM_SUBMISSION'

test('pixel and Clarity ids are the production ones', ...)
// alguma variável c = '3785399351716268'; tag Clarity projectId 'yfvwstk5lh'

test('no account-specific ids left from the source export', ...)
// JSON.stringify não contém '6323984790' nem '235227490'
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && node --test gtm/container.test.ts`
Expected: FAIL com `ENOENT ... gtm/container.json`

- [ ] **Step 3: Escrever `site/gtm/container.json`** com o conteúdo da tabela acima. Cada tag/trigger/variable leva um `tagId`/`triggerId`/`variableId` numérico local ("1", "2", ...); o GTM remapeia no import. As tags de template usam `type: "cvt_<templateId local>"`, igual ao export de origem.

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npm test`
Expected: todos os testes de `src/lib` e `gtm` PASS.

- [ ] **Step 5: Escrever `site/gtm/README.md`** com o passo a passo (em português):
  1. GTM, conta 6323984790: criar container Web "KP - LP Diagnóstico".
  2. Admin → Import Container → `site/gtm/container.json`, workspace novo, **Overwrite**.
  3. Preview (Tag Assistant) em `https://diagnostico.assessoriakp.com.br/?gtm_debug=x` só depois da Task 5; antes disso, conferir só a lista de tags.
  4. Submit → Publish, versão "v1 - LP própria".
  5. Mudou algo na UI? Exportar a versão e substituir `container.json`, rodar `npm test`.

- [ ] **Step 6: Commit**

```bash
git add site/gtm site/package.json
git commit -m "Add the landing page's own GTM container as a versioned import file"
```

---

### Task 2: Lead salvo no Netlify Forms e repassado ao n8n pelo servidor

Hoje o navegador posta direto no webhook do n8n: se o n8n falha, o lead some, e bloqueador de anúncio/CORS podem barrar o envio. Depois desta task o navegador só fala com o próprio domínio (Netlify Forms), o lead fica gravado no Netlify antes de tudo e uma função do Netlify repassa ao n8n no formato de hoje.

**Files:**
- Create: `site/public/__forms.html` (skeleton estático do form `lead`)
- Create: `site/src/lib/forms.ts`, `site/src/lib/forms.test.ts`
- Create: `site/netlify/functions/lead-to-n8n.mts`
- Modify: `site/src/components/Hero.astro` (submit), `site/src/components/Hero.astro:32` (`data-endpoint` sai)
- Modify: `netlify.toml` (sai `PUBLIC_LEAD_ENDPOINT` de todos os contexts), `site/.env.example`, `site/package.json` (devDependency `@netlify/functions`)

**Interfaces:**
- Consumes: `LeadInput`, `buildBody`, `Body` de `src/lib/lead.ts` (o contrato do n8n não muda).
- Produces:
  - `FORM_NAME = 'lead'` e `FORM_FIELDS`: lista exata dos campos do form, `['form-name','lead_id','segment','venda','faixa','cargo','nome','email','telefone','empresa','search','page_url']`.
  - `toFormBody(i: LeadInput, leadId: string): URLSearchParams` (browser → Netlify Forms; inclui `form-name=lead`).
  - `fromFormData(d: Record<string,string>): { input: LeadInput; leadId: string }` (função → reconstrói o `LeadInput`).
  - `n8nBody(d: Record<string,string>): Body` = `{ ...buildBody(fromFormData(d).input), lead_id }`.
  - Env var de runtime `N8N_WEBHOOK_URL` (Netlify UI, escopo Functions). Variáveis do `netlify.toml` não chegam às functions em runtime, por isso vai pela UI.

- [ ] **Step 1: Escrever `src/lib/forms.test.ts`**

```ts
test('form body has exactly the registered fields', () => {
  assert.deepEqual([...toFormBody(base, 'id-1').keys()], FORM_FIELDS);
});
test('skeleton file declares the same fields', () => {
  const html = readFileSync('public/__forms.html', 'utf8');
  const names = [...html.matchAll(/name="([^"]+)"/g)].map((m) => m[1]).filter((n) => n !== 'lead');
  assert.deepEqual(names, FORM_FIELDS);
  assert.match(html, /<form name="lead" data-netlify="true" hidden>/);
});
test('n8n body from a Netlify submission equals the body the browser used to send', () => {
  const d = Object.fromEntries(toFormBody(base, 'id-1'));
  assert.deepEqual(n8nBody(d), { ...buildBody(base), lead_id: 'id-1' });
});
test('n8n body keeps fbclid and UTMs from the landing search', () => {
  const d = Object.fromEntries(toFormBody({ ...base, search: '?utm_source=facebookads&fbclid=xyz' }, 'id-2'));
  const b = n8nBody(d);
  assert.equal(b.utm_source, 'facebookads'); assert.equal(b.fbclid, 'xyz');
});
```

(`base` é o mesmo `LeadInput` de `lead.test.ts`.)

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && node --test src/lib/forms.test.ts`
Expected: FAIL, `Cannot find module './forms.ts'`

- [ ] **Step 3: Implementar `src/lib/forms.ts` e `public/__forms.html`**

Skeleton: `<form name="lead" data-netlify="true" hidden>`, `<input type="hidden" name="form-name" value="lead" />` e um `<input name="...">` para cada campo de `FORM_FIELDS` depois de `form-name`, na mesma ordem. `email` como `type="email"` (vira o Reply-to do email de notificação). Sem `netlify-honeypot`: o honeypot `.hp` do cliente continua decidindo antes do envio (o problema do autofill já foi resolvido lá).

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npm test`
Expected: PASS

- [ ] **Step 5: Implementar `netlify/functions/lead-to-n8n.mts`**

Sintaxe tipada do Netlify (`export default { formSubmitted(event: FormSubmittedEvent) { ... } }`), ignora submissões cujo `event.data['form-name'] !== 'lead'`. POST `application/x-www-form-urlencoded` de `new URLSearchParams(n8nBody(event.data))` para `process.env.N8N_WEBHOOK_URL`, `AbortSignal.timeout(8000)`, até 2 tentativas com 2s entre elas. Se as duas falharem, `console.error('[lead-to-n8n] n8n falhou', lead_id, status)` e termina: o lead continua salvo no Netlify Forms e no email de notificação. O `lead_id` vai no corpo para o n8n poder ignorar repetição, se um dia a segunda tentativa duplicar.

- [ ] **Step 6: Trocar o envio no `Hero.astro`**

No `submit`: `const leadId = crypto.randomUUID()`; `fetch('/__forms.html', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: toFormBody(lead(), leadId).toString() })`. `res.ok` falso continua mostrando `sendErr`, como hoje. Apagar o `data-endpoint` do `<form>` e o erro `PUBLIC_LEAD_ENDPOINT ausente`. Guardar `leadId` para a Task 3 usar como `event_id`.

- [ ] **Step 7: Configuração no Netlify (manual, dono ou eu com a CLI logada)**
  1. Forms → **Enable form detection**.
  2. `netlify env:set N8N_WEBHOOK_URL https://kpadm-n8n.a6hrr3.easypanel.host/webhook/0f7d41ea-76e5-4c56-b1ad-078b867e1c1c --context production --scope functions`
  3. `netlify env:set N8N_WEBHOOK_URL https://kpadm-n8n.a6hrr3.easypanel.host/webhook-test/0f7d41ea-76e5-4c56-b1ad-078b867e1c1c --context deploy-preview branch-deploy --scope functions`
  4. Forms → Submission notifications → **Email notification** do form `lead` para o email do time comercial. Esse email é o fallback: se o n8n falhar, o lead chega por ele.

- [ ] **Step 8: Testar num deploy preview**

Abrir o deploy preview, completar o quiz com email real e frases normais (dados de teste óbvios caem no spam do Akismet).
Expected: submissão em Forms → `lead` → Verified; log da função `lead-to-n8n` com status 200; execução nova no n8n de teste (com "Listen for test event" ligado); email de notificação chegou.

- [ ] **Step 9: Commit**

```bash
git add site/public/__forms.html site/src/lib/forms.ts site/src/lib/forms.test.ts site/netlify site/src/components/Hero.astro netlify.toml site/.env.example site/package.json site/package-lock.json
git commit -m "Save leads in Netlify Forms and forward them to n8n from a Netlify function"
```

---

### Task 3: Evento `kp_lead` e redirect que espera o GTM

**Files:**
- Create: `site/src/lib/tracking.ts`, `site/src/lib/tracking.test.ts`
- Modify: `site/src/components/Hero.astro` (bloco de sucesso do submit, linhas ~433–437)

**Interfaces:**
- Consumes: `classify`, `leadType`, `phone55`, `LeadClass`, `LeadInput` de `src/lib/lead.ts`; contrato da Task 1 (`kp_lead`, `lead_type`, `lead_class`, `event_id`, `user_data.{em,ph,fn,ln}`).
- Produces:
  - `leadEvent(i: Pick<LeadInput,'nome'|'email'|'telefone'>, c: LeadClass, eventId: string): LeadEvent`
  - `type LeadEvent = { event: 'kp_lead'; lead_type: 'MQL'|'TOP'; lead_class: LeadClass; event_id: string; user_data: { em: string; ph: string; fn: string; ln?: string } }`
  - `pushLeadThen(dl: unknown[], ev: LeadEvent, next: () => void, timeoutMs = 1500): void`

- [ ] **Step 1: Escrever `src/lib/tracking.test.ts`**

```ts
test('leadEvent normalizes user data for Meta advanced matching', () => {
  const e = leadEvent({ nome: ' Ana Paula Souza ', email: ' Ana@Loja.COM ', telefone: '+55 (31) 99999-8888' }, 'A', 'id-1');
  assert.deepEqual(e, { event: 'kp_lead', lead_type: 'MQL', lead_class: 'A', event_id: 'id-1',
    user_data: { em: 'ana@loja.com', ph: '5531999998888', fn: 'ana', ln: 'souza' } });
});
test('single-word name has no ln key', () => {
  const e = leadEvent({ nome: 'Ana', email: 'a@b.co', telefone: '31999998888' }, 'B', 'x');
  assert.equal(e.user_data.fn, 'ana'); assert.equal('ln' in e.user_data, false);
});
test('TOP leads are labeled TOP', () => {
  assert.equal(leadEvent({ nome: 'A B', email: 'a@b.co', telefone: '31999998888' }, 'C', 'x').lead_type, 'TOP');
});
test('pushLeadThen navigates once when GTM calls back', () => {
  const dl: any[] = []; let n = 0;
  pushLeadThen(dl, ev, () => n++);
  dl[0].eventCallback(); dl[0].eventCallback();
  assert.equal(n, 1); assert.equal(dl[0].eventTimeout, 1500);
});
test('pushLeadThen navigates after the timeout when GTM never answers', async () => {
  const dl: any[] = []; let n = 0;
  pushLeadThen(dl, ev, () => n++, 20);
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(n, 1);
});
```

(`ev` é um `leadEvent(...)` qualquer, definido no topo do arquivo.)

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && node --test src/lib/tracking.test.ts`
Expected: FAIL, `Cannot find module './tracking.ts'`

- [ ] **Step 3: Implementar `src/lib/tracking.ts`**

`fn`/`ln`: primeira e última palavra do nome, `trim`, minúsculas. `ph`: `phone55(telefone)`. `em`: `trim().toLowerCase()`. `pushLeadThen` faz push de `{ ...ev, eventCallback, eventTimeout: timeoutMs }`, com `eventCallback` chamando `next` uma vez só (flag) e um `setTimeout(timeoutMs)` de segurança chamando a mesma função.

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npm test`
Expected: PASS

- [ ] **Step 5: Ligar no `Hero.astro`**

No bloco de sucesso do envio ao Netlify Forms (Task 2), depois de `track('kp_form_submit_success')`, `form.dataset.sent = 'true'` e `go(LAST)`, trocar `location.assign('/obrigado/')` por:

```ts
pushLeadThen((window.dataLayer ??= []), leadEvent(lead(), classifyForm().c, leadId), () => location.assign('/obrigado/'));
```

Os pushes `kp_prepare_lead_click` / `kp_form_submit` / `kp_form_submit_success` e o `form.id` MQL/TOP ficam como estão (o container novo não usa, mas não atrapalham).

- [ ] **Step 6: Conferir num deploy preview**

O POST para `/__forms.html` só funciona no Netlify, então o teste é no deploy preview (sem GTM). Completar o quiz como MQL (Motos, 15-25, dono).
Expected: no console, `dataLayer` termina com um `kp_lead` com `lead_type: 'MQL'`, `event_id` igual ao `lead_id` da submissão no Netlify Forms e `user_data` normalizado; a página vai para `/obrigado/` em ~1.5s (sem GTM, quem navega é o timeout).

- [ ] **Step 7: Commit**

```bash
git add site/src/lib/tracking.ts site/src/lib/tracking.test.ts site/src/components/Hero.astro
git commit -m "Send the Meta Lead as a kp_lead dataLayer event after n8n accepts the lead"
```

---

### Task 4: Carregar o GTM na hora + medição

**Files:**
- Modify: `site/src/layouts/Base.astro` (bloco do GTM no `<head>` e comentário do `gtmId`)
- Create: `site/scripts/measure-tracking.mjs`
- Modify: `site/package.json` (script `"measure": "node scripts/measure-tracking.mjs"`, devDependency `playwright` `1.57.0`)

**Interfaces:**
- Consumes: `PUBLIC_GTM_ID` (só no build de produção, como hoje).
- Produces: `npm run measure -- <url> <runs>` imprime a mediana de `lcp`, `gtm_req`, `fbevents_req`, `fb_PageView` por rede (sem limite, 4G, slow 4G, 3G), com `/tr` e Clarity abortados.

- [ ] **Step 1: Copiar o script de medição**

Copiar `/private/tmp/claude-501/-Users-iagochaves-kp/fe57317a-c2de-4452-9fd2-076a8c63f13d/scratchpad/perf/measure.mjs` para `site/scripts/measure-tracking.mjs`. Remover o cenário `scroll@1s` (com o GTM carregando na hora ele não muda nada).

- [ ] **Step 2: Medir a linha de base com o build atual**

Produção ainda está no estado antigo, então a linha de base é ela: `cd site && npm i && npm run measure -- https://diagnostico.assessoriakp.com.br/ 3`
Expected: slow 4G `fb_PageView` ≈ 4100ms (bate com o diagnóstico). Guardar a saída para o PR.

- [ ] **Step 3: Trocar o loader no `Base.astro`**

Primeiro filho do `<head>`, logo depois do `meta charset` e `viewport`:
  - `<link rel="preconnect" href="https://www.googletagmanager.com" />`
  - `<link rel="preconnect" href="https://connect.facebook.net" />`
  - o snippet padrão do GTM (`gtm.start`, `event: 'gtm.js'`, script `async` inserido na hora), com o id vindo de `define:vars`.

Apagar o loader com `pointerdown/keydown/scroll/touchstart` e `requestIdleCallback`. Trocar o comentário "Same container as the WordPress site" por "LP container (site/gtm/container.json): Meta PageView on Initialization, Lead on kp_lead, Clarity after load". O `noscript` do GTM fica.

- [ ] **Step 4: Conferir o HTML gerado**

Run: `cd site && PUBLIC_GTM_ID=GTM-TEST000 npm run build && grep -o 'googletagmanager.com/gtm.js[^"]*' dist/index.html && grep -c requestIdleCallback dist/index.html`
Expected: o grep acha `gtm.js?id=` e o contador de `requestIdleCallback` é `0`.

- [ ] **Step 5: Lighthouse local com tracking bloqueado**

Run: `npx lighthouse http://localhost:4321/ --only-categories=performance --blocked-url-patterns='*facebook.com/tr*' --blocked-url-patterns='*clarity.ms/collect*' --quiet --chrome-flags=--headless=new` (preview rodando com `GTM-TEST000`; o gtm.js de um id inexistente responde 404, então este passo só garante que o snippet não piorou o render).
Expected: performance ≥ 95, CLS 0.

- [ ] **Step 6: Commit**

```bash
git add site/src/layouts/Base.astro site/scripts/measure-tracking.mjs site/package.json site/package-lock.json
git commit -m "Load GTM as soon as the head is parsed and add the tracking timing script"
```

---

### Task 5: Trocar o id e fazer o release

**Files:**
- Modify: `netlify.toml` (`[context.production.environment] PUBLIC_GTM_ID`)
- Modify: `site/.env.example` (comentário: "Container próprio da LP, ver site/gtm/README.md. O WordPress usa GTM-NPXMNQSL.")

**Interfaces:**
- Consumes: o id `GTM-XXXXXXX` que o dono cria no passo 1 do `site/gtm/README.md`.

- [ ] **Step 1 (dono, manual): Criar, importar e publicar o container** seguindo `site/gtm/README.md` passos 1, 2 e 4. Me passar o id `GTM-…`.

- [ ] **Step 2: Atualizar `netlify.toml` e `.env.example`** com o id novo. Previews e branch deploys continuam `PUBLIC_GTM_ID = ""`.

- [ ] **Step 3: Rodar a suíte e o build**

Run: `cd site && npm test && npm run build`
Expected: PASS e build sem erro.

- [ ] **Step 4: Commit, push, PR**

```bash
git add netlify.toml site/.env.example
git commit -m "Point production at the landing page's own GTM container"
```

Corpo do PR: tabela antes/depois da Task 4 Step 2, a ordem de release e o checklist abaixo.

- [ ] **Step 5: Depois do merge e do deploy, verificar em produção**

  1. `curl -s https://diagnostico.assessoriakp.com.br/ | grep -o 'GTM-[A-Z0-9]*' | sort -u` → só o id novo.
  2. `npm run measure -- https://diagnostico.assessoriakp.com.br/ 3` → slow 4G `fb_PageView` ≤ 3000ms e 3G ≤ 9000ms. Se não bater, abrir o waterfall e reportar antes de qualquer outra mudança.
  3. Meta Events Manager → Test Events, pelo celular (4G de verdade): um PageView; um quiz MQL completo gera um `Lead` com `content_name = diagnostico-lp` e EMQ com em/ph/fn/ln; um quiz TOP não gera Lead.
  4. Clarity: sessões novas aparecendo em `yfvwstk5lh`, filtrando URL por `diagnostico`.
  5. Netlify Forms → `lead`: o número de verificadas bate com as execuções do n8n no mesmo período; nenhum `[lead-to-n8n] n8n falhou` nos logs da função; a lista Spam está vazia ou só tem lixo (o que for real, marcar como verificado e repassar à mão).

- [ ] **Step 6 (dono, depois de 7 dias):** comparar landing page views ÷ outbound clicks por anúncio, 7 dias antes e 7 dias depois. No Ads Manager, criar uma conversão personalizada "Lead com content_name = diagnostico-lp" se as campanhas da LP forem otimizar só com leads dela.

---

## Fora do escopo (decidido)

- Server-side GTM / domínio first-party para o pixel: ganharia mais alguns pontos de connect rate e EMQ, mas é infraestrutura nova. Reavaliar depois de medir esta mudança.
- Banner de consentimento (LGPD): o container atual também não tem. Assunto separado.
- Mudar o container do WordPress (GTM-NPXMNQSL): fica como está. Depois do release ele só roda no WordPress, então o problema de mistura com a LP some sem mexer nele.
- Cache do HTML no edge do Netlify: o tempo de resposta varia (90–885ms) porque cada ponto da CDN aquece o cache separado. O ganho é pequeno perto do atraso do PageView.
