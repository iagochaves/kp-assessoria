import tulio from '../assets/dep-tulio.jpg';
import lucas from '../assets/dep-lucas.jpg';
import livia from '../assets/dep-livia.jpg';
import renan from '../assets/dep-renan.jpg';
import vanessa from '../assets/dep-vanessa.jpg';

/** Official numbers (PRODUCT.md). Do not use the /moto figures. */
export const numbers = {
  revenue: 'R$18 milhões',
  companies: '120',
  years: '4',
};

export type Testimonial = {
  id: string;
  name: string;
  store: string;
  big: string;
  sub: string;
  /** Verbatim from the current home, numbers in <b>. */
  quote: string;
  poster: ImageMetadata;
  video?: string;
};

/** The five testimonials of the current home, quoted verbatim (owner decision 2026-10-14). */
export const testimonials: Testimonial[] = [
  {
    id: 'tulio', name: 'Túlio', store: 'Shineray Bom Jesus da Lapa',
    big: '23 motos', sub: 'na 1ª semana da loja',
    quote: '“Logo na <b>primeira semana</b>, durante o lançamento da loja, conseguimos vender <b>23 motos</b>. A KP acompanhou de perto, <b>treinou nosso time comercial</b> e fez parte desse resultado.”',
    poster: tulio, video: '/video/tulio.mp4',
  },
  {
    id: 'lucas', name: 'Lucas', store: 'VR Multimarcas',
    big: '7% → 27%', sub: 'de aprovação dos leads em 21 dias',
    quote: '“Em apenas <b>21 dias</b>, saímos de <b>7%</b> para <b>mais de 27% de aprovação</b> dos leads. A KP trouxe mais procura, mais previsibilidade no faturamento e ajudou a <b>fortalecer nossas vendas</b> com um acompanhamento muito próximo.”',
    poster: lucas, video: '/video/lucas.mp4',
  },
  {
    id: 'livia', name: 'Lívia', store: 'Avelloz',
    big: '8+ motos', sub: 'por mês vendidas pelo digital',
    quote: '“Antes da KP, o digital praticamente <b>não gerava vendas</b> para nós. Hoje já são <b>mais de 8 motos por mês</b> vendidas através do digital, com acompanhamento, presença e <b>foco em resultado.</b>”',
    poster: livia, video: '/video/livia.mp4',
  },
  {
    id: 'renan', name: 'Renan', store: 'Shineray Valinhos',
    big: '5% → 20%', sub: 'de aprovação no financiamento',
    quote: '“Saímos de <b>5%</b> para <b>mais de 20% de aprovação</b> no financiamento. Hoje, fechamos <b>mais de 50% dos leads aprovados</b>, com uma demanda muito mais qualificada.”',
    poster: renan, video: '/video/renan.mp4',
  },
  {
    id: 'vanessa', name: 'Vanessa', store: 'VMA Motos',
    big: '2-3 → 16', sub: 'motos por mês no digital',
    quote: '“Depois da KP, a meta foi batida em <b>21 dias</b>. Em menos de 60 dias, as vendas pelo digital saíram de <b>2-3 motos</b> para <b>16 por mês</b>.”',
    poster: vanessa, video: '/video/vanessa.mp4',
  },
];

/**
 * Hero quiz. Every `value` is the exact Elementor option value the n8n workflow receives
 * (src/lib/lead.ts); labels are free. Motos, carros and caminhões answer volume;
 * geral and outros answer revenue, as on the WordPress form.
 */
export const segments = [
  { id: 'motos', value: 'Motos', label: 'Motos', kind: 'volume', unit: 'motos/mês', q: 'Quantas motos sua loja vende por mês?' },
  { id: 'carros', value: 'Carros', label: 'Carros', kind: 'volume', unit: 'carros/mês', q: 'Quantos carros sua loja vende por mês?' },
  { id: 'caminhoes', value: 'Caminhoes', label: 'Caminhões', kind: 'volume', unit: 'caminhões/mês', q: 'Quantos caminhões sua loja vende por mês?' },
  { id: 'geral', value: 'Veiculos em Geral', label: 'Mais de um tipo (ex.: motos e carros)', kind: 'revenue', unit: '', q: 'Quanto a loja fatura por mês?' },
  { id: 'outros', value: 'Outros', label: 'Outros', kind: 'revenue', unit: '', q: 'Quanto a empresa fatura por mês?' },
] as const;

export type SegmentId = (typeof segments)[number]['id'];
export type Bracket = { value: string; label: string; lead: string; also: string };

const NEW = 'Ainda não abri a loja';
const revenue: Bracket[] = [
  { value: 'Ainda nao tenho', label: 'Ainda não fatura', lead: 'tulio', also: 'lucas' },
  { value: 'Até 20 mil', label: 'Até R$ 20 mil', lead: 'livia', also: 'lucas' },
  { value: 'De 20 mil a 40 mil', label: 'R$ 20 mil a R$ 40 mil', lead: 'livia', also: 'vanessa' },
  { value: 'De 40 mil a 80 mil', label: 'R$ 40 mil a R$ 80 mil', lead: 'vanessa', also: 'lucas' },
  { value: 'De 80 mil a 120 mil', label: 'R$ 80 mil a R$ 120 mil', lead: 'lucas', also: 'vanessa' },
  { value: 'De 120 mil a 200 mil', label: 'R$ 120 mil a R$ 200 mil', lead: 'tulio', also: 'lucas' },
  { value: 'De 200 mil a 300 mil', label: 'R$ 200 mil a R$ 300 mil', lead: 'renan', also: 'tulio' },
  { value: 'De 300 mil a 500 mil', label: 'R$ 300 mil a R$ 500 mil', lead: 'renan', also: 'tulio' },
  { value: 'Mais de 600 mil', label: 'Mais de R$ 600 mil', lead: 'renan', also: 'tulio' },
];

/** Hero quiz step 2: volume (or revenue) bands per segment and which partner result each reveals. */
export const brackets: Record<SegmentId, Bracket[]> = {
  motos: [
    { value: NEW, label: 'Abrindo', lead: 'tulio', also: 'lucas' },
    { value: 'Vendo de 1-4 motos/mês', label: '1–4', lead: 'livia', also: 'lucas' },
    { value: 'Vendo 4-8 motos/mês', label: '4–8', lead: 'vanessa', also: 'livia' },
    { value: 'Vendo de 8-15 motos/mês', label: '8–15', lead: 'vanessa', also: 'renan' },
    { value: 'Vendo de 15-25 motos/mês', label: '15–25', lead: 'tulio', also: 'lucas' },
    { value: 'Vendo de 25-45 motos/mês', label: '25–45', lead: 'renan', also: 'vanessa' },
    { value: 'Acima de 45 motos/mês', label: '45+', lead: 'renan', also: 'tulio' },
  ],
  carros: [
    { value: NEW, label: 'Abrindo', lead: 'lucas', also: 'tulio' },
    { value: 'Vendo de 1-4 carros/mês', label: '1–4', lead: 'lucas', also: 'livia' },
    { value: 'Vendo de 4-8 carros/mês', label: '4–8', lead: 'lucas', also: 'renan' },
    { value: 'Vendo de 8-12 carros/mês', label: '8–12', lead: 'lucas', also: 'renan' },
    { value: 'Vendo de 12-20 carros/mês', label: '12–20', lead: 'renan', also: 'lucas' },
    { value: 'Vendo acima de 20 carros/mês', label: '20+', lead: 'renan', also: 'tulio' },
  ],
  caminhoes: [
    { value: NEW, label: 'Abrindo', lead: 'lucas', also: 'tulio' },
    { value: 'Vendo de 1-2 caminhões/mês', label: '1–2', lead: 'lucas', also: 'renan' },
    { value: 'Vendo de 2-3 caminhões/mês', label: '2–3', lead: 'lucas', also: 'renan' },
    { value: 'Vendo de 3-6 caminhões/mês', label: '3–6', lead: 'renan', also: 'lucas' },
    { value: 'Vendo acima de 6 caminhões/mês', label: '6+', lead: 'renan', also: 'lucas' },
  ],
  geral: revenue,
  outros: revenue,
};

/** Hero quiz step 3. `value` is the Elementor option value (n8n: "consultor" is always class D). */
export const roles = [
  { value: 'dono', label: 'Dono ou sócio' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'lider', label: 'Líder de vendas' },
  { value: 'consultor', label: 'Consultor' },
  { value: 'outro', label: 'Outro' },
];

export const steps = [
  { t: 'Diagnóstico da loja', d: 'Olhamos seus números, sua região e como o time atende hoje.' },
  { t: 'Clientes novos batendo à sua porta', d: 'Campanhas que colocam sua loja na frente de <b>quem está pronto para comprar</b>.' },
  { t: 'Time que vende', d: 'Transformamos atendentes em vendedores, com técnicas que <b>aumentam a taxa de fechamento</b>.' },
  { t: 'Indicadores que mostram a verdade', d: 'Você enxerga quanto investe e quanto retorna. <b>Sem hora pra sair, sem final de semana.</b>' },
];

export const faq = [
  {
    q: 'O que acontece depois que eu respondo?',
    a: 'Um especialista da KP entra em contato pelo WhatsApp em <b>até 8 horas úteis</b> para entender o momento da loja e marcar a conversa.',
  },
  {
    q: 'Quanto preciso investir?',
    a: 'Depende do porte da loja e da região. Falamos de investimento na conversa com o especialista, depois de entender seus números. A consultoria inicial é gratuita.',
  },
  {
    q: 'Em quanto tempo vejo resultado?',
    a: 'Cada loja tem seu ritmo. A VR Multimarcas foi de <b>7% para mais de 27%</b> de aprovação em <b>21 dias</b>; a VMA Motos bateu a meta em <b>21 dias</b>.',
  },
  {
    q: 'Vocês atendem loja de carro e de caminhão?',
    a: 'Sim. A KP trabalha com lojas de <b>motos, carros, caminhões</b> e multimarcas. O método é o mesmo: campanha que traz comprador, time treinado para fechar e números acompanhados de perto. O diagnóstico ajusta o plano ao seu segmento e ao seu ticket.',
  },
  {
    q: 'Minha cidade é pequena. Funciona?',
    a: 'Boa parte das lojas parceiras está no interior, como a Shineray Bom Jesus da Lapa, que vendeu <b>23 motos</b> na primeira semana. O trabalho é tornar sua loja a referência da região.',
  },
  {
    q: 'Já tenho agência. Qual a diferença?',
    a: 'A KP trabalha só com loja de veículo e não para no anúncio: <b>treina o time comercial</b> e <b>acompanha os números</b> até a venda. O foco é faturamento, não clique ou curtida.',
  },
  {
    q: 'Tem vaga para minha loja?',
    a: 'O trabalho é exclusivo e <b>nem sempre temos vagas abertas</b> para novos parceiros. Responda o diagnóstico e o especialista confirma a disponibilidade para sua região.',
  },
];

export const handles = [
  'king.veiculosrr', 'vma_motos', 'vrmultimarcas_indaiatuba', 'vrmultimarcastc', 'shineray.bjl', 'motoeroi',
  'vrmultimarcas.mg', 'vrmultimarcas.araruama', 'urby.nh', 'shinerayoficial_extrema', 'automoveisdanilo', 'arenamotosvr',
  'mixmotorsmultimarcasba', 'avellozmotosfloriano', 'motomilsuzuki', 'pacinimotorss', 'shinerayribeiraope', 'shineraydonordeste',
];
