import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const raw = readFileSync(new URL('./container.json', import.meta.url), 'utf8');
const json = JSON.parse(raw);
const v = json.containerVersion;

type Param = { type: string; key?: string; value?: string; list?: Param[]; map?: Param[] };
type Tag = { name: string; type: string; parameter: Param[]; firingTriggerId: string[]; tagFiringOption: string };
type Trigger = { triggerId: string; name: string; type: string; customEventFilter?: { type: string; parameter: Param[] }[]; filter?: { type: string; parameter: Param[] }[] };

/** GTM built-in triggers: All Pages and Initialization - All Pages. */
const BUILT_IN_TRIGGERS = ['2147479553', '2147479573'];
const tags: Tag[] = v.tag;
const triggers: Trigger[] = v.trigger;
const param = (t: Tag, key: string) => t.parameter.find((p) => p.key === key);
const pairs = (p: Param | undefined) =>
  (p?.list ?? []).map((m) => Object.fromEntries((m.map ?? []).map((x) => [x.key, x.value])) as { name: string; value: string });
const byEvent = (name: string) => tags.find((t) => param(t, 'standardEventName')?.value === name)!;
const args = (f: { parameter: Param[] }) => Object.fromEntries(f.parameter.map((p) => [p.key, p.value]));

test('every tag fires on a trigger that exists or is a GTM built-in', () => {
  const ids = new Set([...triggers.map((t) => t.triggerId), ...BUILT_IN_TRIGGERS]);
  for (const t of tags) {
    assert.ok(t.firingTriggerId.length > 0, `${t.name} has no trigger`);
    for (const id of t.firingTriggerId) assert.ok(ids.has(id), `${t.name} fires on unknown trigger ${id}`);
  }
});

test('PageView fires on Initialization - All Pages, once per load', () => {
  const pv = byEvent('PageView');
  assert.deepEqual(pv.firingTriggerId, ['2147479573']);
  assert.equal(pv.tagFiringOption, 'ONCE_PER_LOAD');
});

test('Lead fires only on kp_lead with lead_type MQL', () => {
  const lead = byEvent('Lead');
  assert.equal(lead.firingTriggerId.length, 1);
  const tr = triggers.find((t) => t.triggerId === lead.firingTriggerId[0])!;
  assert.equal(tr.type, 'CUSTOM_EVENT');
  assert.equal(tr.customEventFilter?.length, 1);
  assert.equal(tr.customEventFilter![0].type, 'EQUALS');
  assert.deepEqual(args(tr.customEventFilter![0]), { arg0: '{{_event}}', arg1: 'kp_lead' });
  assert.equal(tr.filter?.length, 1);
  assert.equal(tr.filter![0].type, 'EQUALS');
  assert.deepEqual(args(tr.filter![0]), { arg0: '{{DLV - lead_type}}', arg1: 'MQL' });
});

test('Lead advanced matching reads only dataLayer variables', () => {
  const lead = byEvent('Lead');
  assert.equal(param(lead, 'advancedMatching')?.value, 'true');
  const am = pairs(param(lead, 'advancedMatchingList'));
  assert.deepEqual(am.map((x) => x.name), ['em', 'ph', 'fn', 'ln']);
  assert.deepEqual(am.map((x) => x.value), ['{{DLV - user_data.em}}', '{{DLV - user_data.ph}}', '{{DLV - user_data.fn}}', '{{DLV - user_data.ln}}']);
  assert.equal(param(lead, 'eventId')?.value, '{{DLV - event_id}}');
});

test('Lead tells the landing page apart from the WordPress leads', () => {
  const props = pairs(param(byEvent('Lead'), 'objectPropertyList'));
  assert.deepEqual(props, [
    { name: 'content_name', value: 'diagnostico-lp' },
    { name: 'lead_class', value: '{{DLV - lead_class}}' },
  ]);
});

test('every {{variable}} a tag or trigger references is defined', () => {
  const defined = new Set([...v.variable.map((x: { name: string }) => x.name), ...v.builtInVariable.map((x: { name: string }) => x.name), '_event']);
  const used = [...JSON.stringify({ t: v.tag, r: v.trigger }).matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]);
  for (const name of used) assert.ok(defined.has(name), `{{${name}}} is not defined`);
});

test('no Elementor DOM reads, Custom JavaScript, cookie variables or click/form listeners', () => {
  assert.equal(raw.includes('form-field-'), false);
  for (const x of v.variable) assert.ok(!['jsm', 'k'].includes(x.type), `variable ${x.name} is ${x.type}`);
  for (const t of triggers) assert.ok(!['CLICK', 'LINK_CLICK', 'FORM_SUBMISSION'].includes(t.type), `trigger ${t.name} is ${t.type}`);
});

test('pixel and Clarity ids are the production ones', () => {
  assert.ok(v.variable.some((x: { type: string; parameter: Param[] }) => x.type === 'c' && x.parameter.some((p) => p.value === '3785399351716268')));
  for (const name of ['PageView', 'Lead']) assert.equal(param(byEvent(name), 'pixelId')?.value, '{{Const - Meta Pixel ID}}');
  const clarity = tags.find((t) => param(t, 'projectId'))!;
  assert.equal(param(clarity, 'projectId')?.value, 'yfvwstk5lh');
  assert.equal(param(clarity, 'userId'), undefined);
  assert.equal(param(clarity, 'sessionId'), undefined);
});

test('no account-specific ids left from the source export', () => {
  assert.equal(raw.includes('6323984790'), false);
  assert.equal(raw.includes('235227490'), false);
});
