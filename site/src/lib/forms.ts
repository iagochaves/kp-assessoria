/**
 * Netlify Forms side of the lead: the browser posts the quiz to the "lead" form (same origin, so ad
 * blockers and CORS never get in the way) and the lead-to-n8n function rebuilds the n8n body from the
 * stored submission. Field names must match public/__forms.html exactly, or Netlify drops the post.
 */
import { buildBody, type Body, type LeadInput } from './lead.ts';

export const FORM_NAME = 'lead';

export const FORM_FIELDS = [
  'form-name', 'lead_id', 'segment', 'venda', 'faixa', 'cargo',
  'nome', 'email', 'telefone', 'empresa', 'search', 'page_url',
];

export function toFormBody(i: LeadInput, leadId: string): URLSearchParams {
  return new URLSearchParams({
    'form-name': FORM_NAME, lead_id: leadId, segment: i.segment, venda: i.venda, faixa: i.faixa, cargo: i.cargo,
    nome: i.nome, email: i.email, telefone: i.telefone, empresa: i.empresa, search: i.search, page_url: i.pageUrl,
  });
}

export function fromFormData(d: Record<string, string>): { input: LeadInput; leadId: string } {
  const s = (k: string) => d[k] ?? '';
  return {
    input: {
      segment: s('segment') as LeadInput['segment'], venda: s('venda'), faixa: s('faixa'), cargo: s('cargo'),
      nome: s('nome'), email: s('email'), telefone: s('telefone'), empresa: s('empresa'),
      search: s('search'), pageUrl: s('page_url'),
    },
    leadId: s('lead_id'),
  };
}

/** The body the n8n webhook has always received, plus lead_id so a repeated delivery can be told apart. */
export function n8nBody(d: Record<string, string>): Body {
  const { input, leadId } = fromFormData(d);
  return { ...buildBody(input), lead_id: leadId };
}

/** Netlify passes every verified submission of the site; only the quiz goes to n8n. */
export const isLeadSubmission = (d: Record<string, string>) => (d['form-name'] ?? FORM_NAME) === FORM_NAME;

export type Delivery = { ok: boolean; attempts: number; status: number };

/**
 * POSTs the lead to n8n the way the Elementor webhook did (form-encoded). It retries once, and only when
 * the connection itself failed: after an HTTP error or a timeout n8n may already have run the workflow,
 * and a second post would duplicate the lead in the CRM. status 0 = no HTTP answer.
 * Whatever happens, the lead is still in Netlify Forms and in the notification e-mail.
 */
export async function deliverToN8n(url: string, d: Record<string, string>, fetchImpl: typeof fetch = fetch, waitMs = 2000): Promise<Delivery> {
  const body = new URLSearchParams(n8nBody(d)).toString();
  let status = 0;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(8000),
      });
      status = res.status;
      return { ok: res.ok, attempts: attempt, status };
    } catch (err) {
      status = 0;
      if ((err as Error).name === 'TimeoutError') return { ok: false, attempts: attempt, status };
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, waitMs));
  }
  return { ok: false, attempts: 2, status };
}
