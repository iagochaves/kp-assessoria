import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBody, classify, emailOk, leadType, nationalDigits, phone55, readUtms, WEBHOOK_KEYS as K, type LeadInput } from './lead.ts';

const base: LeadInput = {
  segment: 'motos', venda: 'Motos', faixa: 'Vendo de 1-4 motos/mês', cargo: 'dono',
  nome: ' Ana ', email: 'ana@loja.com', telefone: '(31) 99999-8888', empresa: 'Loja X',
  search: '', pageUrl: 'https://assessoriakp.com.br/',
};
const cls = (o: Partial<LeadInput>) => classify(buildBody({ ...base, ...o }));

test('body matches the Elementor webhook keys and values', () => {
  const b = buildBody({ ...base, search: '?utm_source=facebookads&utm_medium=Instagram_Stories&fbclid=xyz' });
  assert.equal(b[K.cargo], 'dono');
  assert.equal(b[K.venda], 'Motos');
  assert.equal(b[K.motos], 'Vendo de 1-4 motos/mês');
  assert.equal(b[K.carros], '');
  assert.equal(b[K.faturamento], '');
  assert.equal(b[K.nome], 'Ana');
  assert.equal(b[K.telefone], '5531999998888');
  assert.equal(b[K.empresa], 'Loja X');
  assert.equal(b.utm_source, 'facebookads');
  assert.equal(b.utm_medium, 'Instagram_Stories');
  assert.equal(b.form_id, 'f078c20');
  assert.equal(b.fbclid, 'xyz');
});

test('revenue goes to the single faturamento key for geral and outros', () => {
  for (const [segment, venda] of [['geral', 'Veiculos em Geral'], ['outros', 'Outros']] as const) {
    const b = buildBody({ ...base, segment, venda, faixa: 'De 80 mil a 120 mil' });
    assert.equal(b[K.faturamento], 'De 80 mil a 120 mil');
    assert.equal(b[K.motos], '');
  }
});

test('no UTM in the URL falls back to utm_source=orgânico', () => {
  assert.equal(readUtms('').utm_source, 'orgânico');
  assert.equal(readUtms('?utm_campaign=x').utm_source, '');
});

test('phone keeps an existing 55 prefix', () => {
  assert.equal(phone55('5531999998888'), '5531999998888');
  assert.equal(phone55('3133334444'), '553133334444');
});

test('classification mirrors the n8n Code node', () => {
  const cases: [Partial<LeadInput>, string][] = [
    [{ faixa: 'Ainda não abri a loja' }, 'C'],
    [{ faixa: 'Vendo 4-8 motos/mês' }, 'C'],
    [{ faixa: 'Vendo de 8-15 motos/mês' }, 'B'],
    [{ faixa: 'Acima de 45 motos/mês' }, 'A'],
    [{ segment: 'carros', venda: 'Carros', faixa: 'Vendo de 4-8 carros/mês' }, 'B'],
    [{ segment: 'carros', venda: 'Carros', faixa: 'Vendo acima de 20 carros/mês' }, 'A'],
    [{ segment: 'carros', venda: 'Carros', faixa: 'Vendo de 1-4 carros/mês' }, 'C'],
    [{ segment: 'caminhoes', venda: 'Caminhoes', faixa: 'Vendo de 1-2 caminhões/mês' }, 'B'],
    [{ segment: 'caminhoes', venda: 'Caminhoes', faixa: 'Vendo de 3-6 caminhões/mês' }, 'A'],
    [{ segment: 'geral', venda: 'Veiculos em Geral', faixa: 'De 40 mil a 80 mil' }, 'B'],
    [{ segment: 'geral', venda: 'Veiculos em Geral', faixa: 'Mais de 600 mil' }, 'A'],
    [{ segment: 'geral', venda: 'Veiculos em Geral', faixa: 'Até 20 mil' }, 'C'],
    [{ segment: 'outros', venda: 'Outros', faixa: 'Mais de 600 mil' }, 'A'],
    [{ segment: 'outros', venda: 'Outros', faixa: 'De 20 mil a 40 mil' }, 'C'],
    [{ faixa: 'Acima de 45 motos/mês', cargo: 'consultor' }, 'D'],
  ];
  for (const [o, want] of cases) assert.equal(cls(o), want, JSON.stringify(o));
});

test('MQL is A or B', () => {
  assert.deepEqual((['A', 'B', 'C', 'D'] as const).map(leadType), ['MQL', 'MQL', 'TOP', 'TOP']);
});

test('WhatsApp mask keeps DDD + number when the country code or a trunk zero comes along', () => {
  assert.equal(nationalDigits('+55 31 99999-8888'), '31999998888');
  assert.equal(nationalDigits('5531999998888'), '31999998888');
  assert.equal(nationalDigits('+55 (21) 3333-4444'), '2133334444');
  assert.equal(nationalDigits('031 99999-8888'), '31999998888');
  assert.equal(nationalDigits('(55) 99999-8888'), '55999998888'); // DDD 55 (RS) stays
  assert.equal(nationalDigits('(31) 99999-8888 ramal 2'), '31999998888');
  assert.equal(phone55(nationalDigits('+55 31 99999-8888')), '5531999998888');
});

test('e-mail needs a dot in the domain', () => {
  assert.equal(emailOk('ana@loja.com.br'), true);
  assert.equal(emailOk(' ana@loja.com '), true);
  assert.equal(emailOk('ana@gmail'), false);
  assert.equal(emailOk('ana@gmail.c'), false);
  assert.equal(emailOk('ana gmail.com'), false);
});
