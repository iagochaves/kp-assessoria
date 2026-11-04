# GTM container da landing (diagnostico.assessoriakp.com.br)

`container.json` é a configuração do GTM desta landing, no formato de export do GTM. Ele é a fonte da verdade: o que está publicado no GTM tem que bater com este arquivo. `container.test.ts` trava as regras (rode `npm test`).

O WordPress (assessoriakp.com.br) continua no container antigo, GTM-NPXMNQSL. Não importe este arquivo nele.

## O que tem no container

| Tag | Quando dispara |
|---|---|
| Meta - PageView | Initialization - All Pages (o mais cedo que o GTM permite), uma vez por página |
| Meta - Lead (MQL) | evento `kp_lead` do dataLayer com `lead_type = MQL`, depois que o Netlify Forms gravou o lead |
| Clarity | Window Loaded |

Pixel `3785399351716268`, Clarity `yfvwstk5lh`. O Lead leva advanced matching (`em`, `ph`, `fn`, `ln`) e `content_name = diagnostico-lp`, que separa os leads da landing dos do WordPress no Events Manager.

O site publica no dataLayer, só no evento `kp_lead`: `lead_type`, `lead_class`, `event_id`, `user_data.em`, `user_data.ph`, `user_data.fn`, `user_data.ln`. Ver `src/lib/tracking.ts`.

## Criar e publicar (primeira vez)

1. GTM, conta da KP: **Create container**, nome "KP - LP Diagnóstico", tipo **Web**.
2. No container novo: **Admin → Import Container**, escolha `site/gtm/container.json`, workspace **New** (ou Default), opção **Overwrite**. Confira na prévia: 3 tags, 2 triggers, 8 variáveis, 2 templates.
3. **Submit → Publish**, versão "v1 - LP própria".
4. Passe o id `GTM-…` para trocar em `netlify.toml` (`PUBLIC_GTM_ID` de produção). Publicar o container **antes** do deploy do site; senão a landing fica sem PageView.
5. Depois do deploy: **Preview** (Tag Assistant) em `https://diagnostico.assessoriakp.com.br/` e Meta Events Manager → Test Events.

## Mudou algo pela UI do GTM?

Exporte a versão publicada (**Admin → Export Container**), substitua `container.json` pelo arquivo exportado, apague dele os ids da conta (`accountId`, `containerId`, `fingerprint`, `tagManagerUrl`, `path`) e rode `npm test`. Se um teste quebrar, ou a mudança fere uma regra (corrija no GTM), ou a regra mudou de propósito (atualize o teste no mesmo commit).
