# Quiz: avançar ao clicar na opção (como a LP antiga)

**Objetivo:** nos passos de escolha (1 Segmento, 2 Faixa, 3 Cargo), clicar numa opção já leva ao próximo passo, sem precisar apertar "Continuar". O passo 4 (dados de contato) continua igual, com o botão "Pedir diagnóstico".

**Arquivo:** `site/src/components/Hero.astro` (marcação dos passos + `<script>`). Nada muda em `lib/lead.ts`, no rastreamento nem no envio.

## Comportamento

| Ação | Hoje | Depois |
|---|---|---|
| Clique / toque numa opção | marca e libera "Continuar" | marca, mostra o check por ~250 ms e avança |
| Enter / Espaço numa opção | igual ao clique | igual ao clique: marca e avança |
| Setas ↑↓←→ | movem e marcam | movem e marcam, **sem avançar** (senão o teclado pularia o passo) |
| Voltar a um passo já respondido | opção marcada + "Continuar" | opção marcada; clicar nela (ou em outra) avança de novo |
| Passo 2 (faixa) | mostra o card de prova | mostra o card de prova e avança; o card fica visível ao lado (desktop) ou abaixo (mobile) |

O atraso de ~250 ms existe para a pessoa ver o que escolheu antes da troca de tela; a animação `stepIn` que já existe faz a transição.

## Mudanças

1. **Marcação**
   - Passo 1: remover o `.q-actions` com "Continuar diagnóstico".
   - Passos 2 e 3: remover o botão `data-next`, mantendo só "Voltar".
   - Conferir o espaçamento do `.q-actions` com um único botão alinhado à esquerda.

2. **Script**
   - Separar `select(o)` (marca, grava a resposta, mostra prova, reclassifica — como hoje, menos a linha que habilita `[data-next]`) de `choose(o)` = `select(o)` + avanço com atraso.
   - O `click` da opção chama `choose`; as setas continuam chamando só `select`.
   - Trava contra clique duplo: enquanto o avanço está agendado, ignorar novos cliques. Se a pessoa clicar em "Voltar" nesse intervalo, cancelar o timer.
   - Em `pickSegment`, tirar a linha que desabilita `[data-next]` (o botão deixa de existir).
   - Em `go()`, focar a opção já marcada do passo de destino (`[aria-checked=true]`), e só se não houver nenhuma, a primeira. Assim, quem volta com o teclado cai na resposta que já deu.
   - O handler `[data-next]` no `form` pode ficar (é inofensivo) ou sair. Vou removê-lo, já que nenhum botão usa mais esse atributo.

3. **Acessibilidade**
   - O `aria-live` do "Passo X de 4" já anuncia a troca de passo.
   - O foco vai para o próximo grupo (o `go()` já faz isso a partir do passo 2).

## Verificação

- `npm run build` e `npm test` em `site/`.
- Playwright no `astro dev`, em desktop e mobile (390 px):
  - Fluxo completo só com cliques: Segmento → Faixa → Cargo → formulário.
  - Clique duplo rápido no passo 1 não pula o passo 2.
  - Trocar de segmento depois de voltar zera a faixa (comportamento atual de `pickSegment`) e o card de prova.
  - Teclado: Tab até o grupo, setas não avançam, Enter avança.
  - "Voltar" durante o atraso cancela o avanço.
  - O `dataLayer` continua recebendo `kp_prepare_lead_click` / `kp_form_submit` com `lead_type` correto (com o mock: `npm run mock`).
- Deploy de produção depois da aprovação.

## Em aberto

- Duração do atraso: proponho 250 ms. A LP antiga avançava instantaneamente? Se sim, posso usar ~150 ms.
