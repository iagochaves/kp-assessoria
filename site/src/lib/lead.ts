/**
 * Lead contract with the n8n workflow that already receives the WordPress (Elementor) form.
 * Keys are the Elementor field labels, values are the Elementor option values: the n8n Code node
 * reads exactly these strings, so do not rename them without changing the workflow.
 */

export const WEBHOOK_KEYS = {
  cargo: 'Qual sua função na empresa?',
  venda: 'O que você vende?',
  motos: 'Quantas vendas faz mensalmente de motos?',
  carros: 'Quantas vendas faz mensalmente de carros?',
  caminhoes: 'Quantas vendas faz mensalmente de caminhões?',
  faturamento: 'Qual seu faturamento bruto mensal?',
  email: 'Seu melhor e-mail',
  nome: 'Seu nome',
  telefone: 'Número',
  empresa: 'Nome da sua empresa',
} as const;

/** Same element id/name the Elementor form sent; the workflow does not read them, kept for parity. */
const FORM_META = { form_id: 'f078c20', form_name: 'New Form' };

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type Body = Record<string, string>;
export type LeadClass = 'A' | 'B' | 'C' | 'D';

const normalizeText = (value: unknown) =>
  String(value || '').trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Port of the n8n Code node classification (single source of truth, owner decision 2026-10-24),
 * including the "Outros" fix that gives it the same bands as "Veículos em Geral".
 */
export function classify(body: Body): LeadClass {
  const tipo = normalizeText(body[WEBHOOK_KEYS.venda]);
  const cargo = normalizeText(body[WEBHOOK_KEYS.cargo]);
  let c: LeadClass = 'C';

  if (tipo === 'motos' || tipo === 'moto') {
    const v = body[WEBHOOK_KEYS.motos] || '';
    if (v.includes('15-25') || v.includes('25-45') || normalizeText(v).includes('acima de 45')) c = 'A';
    else if (v.includes('8-15')) c = 'B';
  }
  if (tipo === 'carros' || tipo === 'carro') {
    const v = body[WEBHOOK_KEYS.carros] || '';
    if (v.includes('8-12') || v.includes('12-20') || normalizeText(v).includes('acima de 20')) c = 'A';
    else if (v.includes('4-8')) c = 'B';
  }
  if (tipo === 'caminhao' || tipo === 'caminhoes') {
    const v = body[WEBHOOK_KEYS.caminhoes] || '';
    if (v.includes('2-3') || v.includes('3-6') || normalizeText(v).includes('acima de 6')) c = 'A';
    else if (v.includes('1-2')) c = 'B';
  }
  if (tipo === 'veiculos em geral' || tipo === 'outros') {
    const v = body[WEBHOOK_KEYS.faturamento] || '';
    if (['De 120 mil a 200 mil', 'De 200 mil a 300 mil', 'De 300 mil a 500 mil', 'Mais de 600 mil'].some((x) => v.includes(x))) c = 'A';
    else if (['De 40 mil a 80 mil', 'De 80 mil a 120 mil'].some((x) => v.includes(x))) c = 'B';
  }
  if (cargo === 'consultor') c = 'D';
  return c;
}

/** MQL is what the GTM "Lead" tag (Meta) counts: n8n class A or B. */
export const leadType = (c: LeadClass) => (c === 'A' || c === 'B' ? 'MQL' : 'TOP');

/** Brazilian phone as the Elementor field stored it: digits only, with country code 55. */
export function phone55(raw: string) {
  const d = raw.replace(/\D/g, '').replace(/^0+/, '');
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) return d;
  return `55${d}`;
}

/** UTMs from the landing URL; with none present the WordPress form sent utm_source=orgânico. */
export function readUtms(search: string) {
  const p = new URLSearchParams(search);
  const utms = Object.fromEntries(UTM_KEYS.map((k) => [k, p.get(k) ?? ''])) as Record<(typeof UTM_KEYS)[number], string>;
  if (!UTM_KEYS.some((k) => utms[k])) utms.utm_source = 'orgânico';
  return utms;
}

export type LeadInput = {
  /** Segment id from content.ts. */
  segment: 'motos' | 'carros' | 'caminhoes' | 'geral' | 'outros';
  /** Elementor value of the segment ("Motos", "Veiculos em Geral"...). */
  venda: string;
  /** Elementor value of the volume or revenue band. */
  faixa: string;
  /** Elementor value of the role ("dono", "consultor"...). */
  cargo: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  search: string;
  pageUrl: string;
};

/** Body in the same key order the Elementor webhook sends, non-applicable questions empty. */
export function buildBody(i: LeadInput): Body {
  const k = WEBHOOK_KEYS;
  const band = (s: LeadInput['segment']) => (i.segment === s ? i.faixa : '');
  const p = new URLSearchParams(i.search);
  return {
    [k.cargo]: i.cargo,
    [k.venda]: i.venda,
    [k.motos]: band('motos'),
    [k.carros]: band('carros'),
    [k.caminhoes]: band('caminhoes'),
    [k.faturamento]: i.segment === 'geral' || i.segment === 'outros' ? i.faixa : '',
    [k.email]: i.email.trim(),
    [k.nome]: i.nome.trim(),
    [k.telefone]: phone55(i.telefone),
    [k.empresa]: i.empresa.trim(),
    ...readUtms(i.search),
    ...FORM_META,
    // Extra keys the workflow ignores; they tell Astro leads apart in the n8n executions.
    lp: 'astro',
    page_url: i.pageUrl,
    fbclid: p.get('fbclid') ?? '',
  };
}
