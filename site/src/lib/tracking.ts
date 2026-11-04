/**
 * dataLayer contract with the landing page's GTM container (site/gtm/container.json): the Meta Lead tag
 * fires on kp_lead when lead_type is MQL and reads user_data for advanced matching (the template hashes it).
 */
import { leadType, phone55, type LeadClass, type LeadInput } from './lead.ts';

export type LeadEvent = {
  event: 'kp_lead';
  lead_type: 'MQL' | 'TOP';
  lead_class: LeadClass;
  event_id: string;
  user_data: { em: string; ph: string; fn: string; ln?: string };
};

export function leadEvent(i: Pick<LeadInput, 'nome' | 'email' | 'telefone'>, c: LeadClass, eventId: string): LeadEvent {
  const words = i.nome.trim().toLowerCase().split(/\s+/);
  const user_data: LeadEvent['user_data'] = { em: i.email.trim().toLowerCase(), ph: phone55(i.telefone), fn: words[0] };
  // A one-word name sends no last name: an empty ln counts as a bad value in Meta's match quality.
  if (words.length > 1) user_data.ln = words[words.length - 1];
  return { event: 'kp_lead', lead_type: leadType(c), lead_class: c, event_id: eventId, user_data };
}

/**
 * Pushes the lead and calls next() once GTM has run its tags, or after timeoutMs when GTM never answers
 * (blocked, not loaded yet, preview without GTM), so the visitor always reaches the thank-you page.
 */
export function pushLeadThen(dl: object[], ev: LeadEvent, next: () => void, timeoutMs = 1500): void {
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    next();
  };
  const timer = setTimeout(once, timeoutMs);
  dl.push({ ...ev, eventCallback: once, eventTimeout: timeoutMs });
}
