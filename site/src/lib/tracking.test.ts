import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leadEvent, pushLeadThen } from './tracking.ts';

const ev = leadEvent({ nome: 'Ana Souza', email: 'ana@loja.com', telefone: '31999998888' }, 'A', 'id-0');

test('leadEvent normalizes user data for Meta advanced matching', () => {
  const e = leadEvent({ nome: ' Ana Paula Souza ', email: ' Ana@Loja.COM ', telefone: '+55 (31) 99999-8888' }, 'A', 'id-1');
  assert.deepEqual(e, {
    event: 'kp_lead', lead_type: 'MQL', lead_class: 'A', event_id: 'id-1',
    user_data: { em: 'ana@loja.com', ph: '5531999998888', fn: 'ana', ln: 'souza' },
  });
});

test('single-word name has no ln key', () => {
  const e = leadEvent({ nome: 'Ana', email: 'a@b.co', telefone: '31999998888' }, 'B', 'x');
  assert.equal(e.user_data.fn, 'ana');
  assert.equal('ln' in e.user_data, false);
});

test('phone without country code gets 55 like the n8n body', () => {
  assert.equal(leadEvent({ nome: 'A B', email: 'a@b.co', telefone: '(31) 99999-8888' }, 'A', 'x').user_data.ph, '5531999998888');
});

test('TOP leads are labeled TOP', () => {
  assert.equal(leadEvent({ nome: 'A B', email: 'a@b.co', telefone: '31999998888' }, 'C', 'x').lead_type, 'TOP');
  assert.equal(leadEvent({ nome: 'A B', email: 'a@b.co', telefone: '31999998888' }, 'D', 'x').lead_type, 'TOP');
});

test('pushLeadThen navigates once when GTM calls back', () => {
  const dl: Record<string, any>[] = [];
  let n = 0;
  pushLeadThen(dl, ev, () => n++);
  assert.equal(dl[0].event, 'kp_lead');
  assert.equal(dl[0].eventTimeout, 1500);
  dl[0].eventCallback();
  dl[0].eventCallback();
  assert.equal(n, 1);
});

test('pushLeadThen navigates after the timeout when GTM never answers', async () => {
  const dl: Record<string, any>[] = [];
  let n = 0;
  pushLeadThen(dl, ev, () => n++, 20);
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(n, 1);
});

test('pushLeadThen does not navigate twice when GTM answers after the timeout', async () => {
  const dl: Record<string, any>[] = [];
  let n = 0;
  pushLeadThen(dl, ev, () => n++, 20);
  await new Promise((r) => setTimeout(r, 40));
  dl[0].eventCallback();
  assert.equal(n, 1);
});
