# KP Assessoria — Product Discovery

Data: 2026-10-14 · Fonte: assessoriakp.com.br (home e /moto), auditorias de SEO e performance anteriores, respostas do dono do projeto.
Objetivo: base para a nova versão da landing page. Fatos duráveis ficam em `PRODUCT.md`; sistema visual em `DESIGN.md`.

## 1. O negócio em uma frase

Assessoria de marketing e vendas que faz lojas de motos venderem mais motos: tráfego pago + treinamento do time comercial + acompanhamento próximo, medido em faturamento e unidades vendidas.

## 2. Cliente ideal (ICP)

| Atributo | Definição |
|---|---|
| Segmento | Lojas de motos (prioridade). Carros, caminhões e multimarcas atendidos, mas secundários na LP |
| Perfil | Concessionária de rede (Shineray é a referência dominante) ou multimarcas regional |
| Porte | 1 a 45+ motos/mês; faturamento de até R$20 mil a mais de R$600 mil/mês (faixas do quiz) |
| Geografia | Brasil, forte em cidades do interior |
| Decisor | Dono. Influenciadores: gerente, líder de vendas, consultor |
| Gatilho | Digital "não gera venda", meta não bate, loja nova abrindo, aprovação de financiamento baixa |

### Personas

**Dono de loja Shineray / multimarcas ("o João")**
- Contexto: abre o anúncio no celular entre um atendimento e outro.
- Dor: já pagou agência que entregou relatório e curtida, não venda. Desconfia de marketing.
- Quer ver: lojas iguais à dele, com nome, vendendo mais. Números em motos e reais.
- Medo: contrato longo, dinheiro jogado fora, agência que some.

**Gerente / líder de vendas**
- Dor: leads ruins, baixa aprovação no financiamento, time que não fecha.
- Quer ver: treinamento do time, aumento de taxa de aprovação e fechamento.
- Papel: leva a ideia ao dono; precisa de argumento simples para repassar.

## 3. Jobs to be done

1. "Quando o digital não traz cliente que compra, quero alguém que coloque compradores na minha loja, para bater a meta do mês."
2. "Quando chegam leads, quero que meu time saiba converter, para não desperdiçar o que paguei em anúncio."
3. "Quando invisto em marketing, quero enxergar quanto entrou de volta, para decidir se continuo."
4. "Quando abro uma loja nova, quero vender desde a primeira semana."

## 4. Proposta de valor (pilares atuais)

| Pilar | Promessa | Prova disponível |
|---|---|---|
| Aquisição | Clientes novos prontos para comprar | VMA: 2–3 → 16 motos/mês no digital |
| Time comercial | Atendentes viram vendedores | Túlio: 23 motos na 1ª semana, time treinado |
| Indicadores | Ver investimento × retorno | (sem prova visual; oportunidade) |
| Marca local | Ser a nº 1 da região | (sem prova; oportunidade) |
| Faturamento | Foco em caixa, não em clique | João: R$350 mil no 1º mês |
| Financiamento (implícito) | Leads com perfil aprovável | Lucas: 7% → 27%; Renan: 5% → 20% |

**Diferencial exclusivo:** Placas de Faturamento (prova física e social de resultado).
**Diferencial de serviço:** presença e suporte fora de horário ("sem final de semana, sem feriado").

## 5. Inventário de provas

- Números oficiais: **+R$18 milhões/mês faturados por clientes**, **+4 anos**, **+120 empresas**.
- 8 depoimentos nomeados (ver `PRODUCT.md`), vários com vídeo.
- Faixa de @ de clientes no Instagram (~16 lojas).
- Fotos de clientes com placas (350K, 1M).
- Foto do time real (polo roxa KP).

Lacunas: nenhum case completo com antes/depois de investimento; nenhum dado de ROI agregado; nenhum logo de marca parceira autorizado formalmente.

## 6. Funil atual

```
Anúncio Meta (mobile) ─► LP home ou /moto ─► Quiz 4 passos / formulário ─► contato em até 8h úteis ─► reunião ─► contrato
```

Qualificação coletada: cargo, segmento, vendas/mês por segmento, faturamento, e-mail, nome, telefone, empresa.

## 7. Diagnóstico da LP atual

**Funciona e deve ficar**
- Headline orientada a dinheiro com destaque em roxo.
- Prova social nomeada logo após o hero.
- Quiz com microcopy de progresso ("FALTA POUCO, menos de 10 segundos").
- Mensagem de escassez coerente com capacidade real.
- Foto do time real no hero.

**Problemas (conteúdo e UX)**
- Números inconsistentes entre home e /moto (R$18 mi vs R$11MM, +100 milhões).
- Erros de copy: "+4 de anos de experiência", "+120 de empresas", "maior especialista da Brasil", "Shinerai", "explodirem..".
- Seção Placas de Faturamento: subtítulo e CTA brancos sobre fundo branco (invisíveis); cards de placa vazios no carregamento.
- Pilares sem hierarquia visual (5 cards iguais, ícones faltando em alguns).
- Sem resposta a objeções: preço/modelo, tempo de contrato, como funciona o onboarding, o que acontece após o formulário (só existe na /moto).
- Sem FAQ; sem garantia ou critério de entrada explicado.

**Problemas técnicos (auditorias anteriores)**
- CLS 1.01 na home (popup Elementor abre sem reservar espaço).
- LCP 4.9s na /moto em 4G; vídeo de 476 MB; 20+ CSS bloqueantes; 72 variantes de fonte carregadas.
- Headers de segurança ausentes; SEO on-page fraco (title gigante, sem H1).

## 8. Oportunidades para a nova LP

1. **Uma LP moto-first** com prova Shineray em destaque; carros/caminhões como linha secundária.
2. **Placas de Faturamento como palco** (galeria real com loja + marco), já que é o ativo mais exclusivo.
3. **Seção "Como funciona"** em passos (diagnóstico → campanha → treinamento → acompanhamento) em vez de pilares soltos.
4. **Bloco de objeções/FAQ** (investimento, contrato, prazo de resultado, cidade pequena, já tenho agência).
5. **Quiz inline** (sem popup), com o primeiro passo visível no hero para reduzir atrito.
6. **Vídeos com poster** e carregamento sob toque.
7. **H1 real**, números consistentes, copy revisada.
8. Performance como requisito: LCP < 2.5s e CLS < 0.1 em 4G no primeiro acesso.

## 9. Métricas de sucesso da nova LP

| Métrica | Meta inicial |
|---|---|
| Taxa de conversão anúncio → lead completo | baseline atual + 30% (medir baseline antes) |
| % de leads qualificados (dono/gerente, loja aberta, ≥4 motos/mês) | acompanhar |
| Conclusão do quiz (passo 1 → 4) | > 60% |
| LCP mobile (1º acesso) | < 2.5s |
| CLS | < 0.1 |
| Custo por lead qualificado | queda vs. LP atual |

## 10. Perguntas em aberto

- Manter /moto separada ou unificar numa home moto-first?
- WhatsApp direto como CTA alternativo ao quiz?
- Pode-se mostrar faixa de investimento ou modelo (fee + performance)?
- Quais clientes autorizam uso de nome, foto e vídeo na nova versão?
- Existe processo formal de "vagas" (quantas lojas por região)? Exclusividade regional pode virar argumento.
- Baseline de conversão atual (precisa de acesso ao Meta Ads / CRM).
