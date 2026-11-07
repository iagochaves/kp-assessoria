/**
 * Runs for every verified Netlify Forms submission and forwards the quiz lead to the n8n webhook,
 * server side, in the body format the workflow already reads. The lead is stored in Netlify Forms
 * (and in the notification e-mail) before this runs, so an n8n outage never loses it.
 *
 * N8N_WEBHOOK_URL is set in the Netlify UI per deploy context (functions do not see netlify.toml vars).
 */
import type { FormSubmittedEvent } from '@netlify/functions';
import { deliverToN8n, isLeadSubmission } from '../../src/lib/forms.ts';

export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const d = event.data;
    if (!isLeadSubmission(d)) return;
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      console.error('[lead-to-n8n] N8N_WEBHOOK_URL ausente; lead só no Netlify Forms', d.lead_id);
      return;
    }
    const r = await deliverToN8n(url, d);
    if (r.ok) console.log('[lead-to-n8n] enviado', d.lead_id, r.status, `tentativas=${r.attempts}`);
    else console.error('[lead-to-n8n] n8n falhou', d.lead_id, r.status, `tentativas=${r.attempts}`);
  },
};
