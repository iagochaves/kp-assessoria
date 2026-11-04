import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildBody, type LeadInput } from './lead.ts';
import { deliverToN8n, FORM_FIELDS, fromFormData, isLeadSubmission, n8nBody, toFormBody } from './forms.ts';

const base: LeadInput = {
  segment: 'motos', venda: 'Motos', faixa: 'Vendo de 1-4 motos/mês', cargo: 'dono',
  nome: ' Ana ', email: 'ana@loja.com', telefone: '(31) 99999-8888', empresa: 'Loja X',
  search: '', pageUrl: 'https://diagnostico.assessoriakp.com.br/',
};

test('form body has exactly the registered fields', () => {
  assert.deepEqual([...toFormBody(base, 'id-1').keys()], FORM_FIELDS);
});

test('form body is tagged with the lead form name', () => {
  assert.equal(toFormBody(base, 'id-1').get('form-name'), 'lead');
});

test('skeleton file declares the same fields', () => {
  const html = readFileSync(new URL('../../public/__forms.html', import.meta.url), 'utf8');
  const form = html.match(/<form name="lead" data-netlify="true" hidden>([\s\S]*?)<\/form>/);
  assert.ok(form, 'skeleton has no <form name="lead" data-netlify="true" hidden>');
  const names = [...form[1].matchAll(/<input[^>]*\sname="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(names, FORM_FIELDS);
});

test('a Netlify submission turns back into the same lead input', () => {
  const d = Object.fromEntries(toFormBody(base, 'id-1'));
  assert.deepEqual(fromFormData(d), { input: base, leadId: 'id-1' });
});

test('n8n body from a Netlify submission equals the body the browser used to send', () => {
  const d = Object.fromEntries(toFormBody(base, 'id-1'));
  assert.deepEqual(n8nBody(d), { ...buildBody(base), lead_id: 'id-1' });
});

test('n8n body keeps fbclid and UTMs from the landing search', () => {
  const d = Object.fromEntries(toFormBody({ ...base, search: '?utm_source=facebookads&fbclid=xyz' }, 'id-2'));
  const b = n8nBody(d);
  assert.equal(b.utm_source, 'facebookads');
  assert.equal(b.fbclid, 'xyz');
});

const okFetch = (log: { url: string; body: string }[], statuses: number[]) =>
  (async (url: string, init: RequestInit) => {
    log.push({ url, body: String(init.body) });
    const status = statuses.shift() ?? 200;
    if (status === 0) throw new Error('network down');
    return new Response('', { status });
  }) as unknown as typeof fetch;

test('deliverToN8n posts the n8n body form-encoded and stops at the first 2xx', async () => {
  const log: { url: string; body: string }[] = [];
  const d = Object.fromEntries(toFormBody(base, 'id-1'));
  const r = await deliverToN8n('https://n8n.example/webhook/x', d, okFetch(log, [200]), 0);
  assert.deepEqual(r, { ok: true, attempts: 1, status: 200 });
  assert.equal(log.length, 1);
  assert.equal(log[0].url, 'https://n8n.example/webhook/x');
  assert.deepEqual(Object.fromEntries(new URLSearchParams(log[0].body)), n8nBody(d));
});

test('deliverToN8n retries once after a 5xx or a network error', async () => {
  const log: { url: string; body: string }[] = [];
  const d = Object.fromEntries(toFormBody(base, 'id-1'));
  assert.deepEqual(await deliverToN8n('u', d, okFetch(log, [502, 200]), 0), { ok: true, attempts: 2, status: 200 });
  assert.deepEqual(await deliverToN8n('u', d, okFetch([], [0, 200]), 0), { ok: true, attempts: 2, status: 200 });
});

test('deliverToN8n gives up after two failed attempts', async () => {
  const log: { url: string; body: string }[] = [];
  const d = Object.fromEntries(toFormBody(base, 'id-1'));
  assert.deepEqual(await deliverToN8n('u', d, okFetch(log, [500, 0]), 0), { ok: false, attempts: 2, status: 0 });
  assert.equal(log.length, 2);
});

test('isLeadSubmission ignores other forms but keeps posts without form-name', () => {
  assert.equal(isLeadSubmission({ 'form-name': 'lead', lead_id: 'x' }), true);
  assert.equal(isLeadSubmission({ lead_id: 'x' }), true);
  assert.equal(isLeadSubmission({ 'form-name': 'contato', lead_id: 'x' }), false);
});
