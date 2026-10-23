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
    poster: livia,
  },
  {
    id: 'renan', name: 'Renan', store: 'Shineray Valinhos',
    big: '5% → 20%', sub: 'de aprovação no financiamento',
    quote: '“Saímos de <b>5%</b> para <b>mais de 20% de aprovação</b> no financiamento. Hoje, fechamos <b>mais de 50% dos leads aprovados</b>, com uma demanda muito mais qualificada.”',
    poster: renan,
  },
  {
    id: 'vanessa', name: 'Vanessa', store: 'VMA Motos',
    big: '2-3 → 16', sub: 'motos por mês no digital',
    quote: '“Depois da KP, a meta foi batida em <b>21 dias</b>. Em menos de 60 dias, as vendas pelo digital saíram de <b>2-3 motos</b> para <b>16 por mês</b>.”',
    poster: vanessa,
  },
];

/** Hero quiz step 1: which partner result is revealed per bracket (approved in mockup). */
export const brackets = [
  { value: '1-5', label: '1–5', lead: 'livia', also: 'lucas' },
  { value: '6-15', label: '6–15', lead: 'vanessa', also: 'renan' },
  { value: '16-30', label: '16–30', lead: 'tulio', also: 'lucas' },
  { value: '30+', label: '30+', lead: 'renan', also: 'vanessa' },
] as const;

export const roles = ['Dono ou sócio', 'Gerente', 'Líder de vendas', 'Consultor', 'Outro'];

export const revenueBands = [
  'Até R$ 100 mil',
  'R$ 100 mil a R$ 300 mil',
  'R$ 300 mil a R$ 600 mil',
  'Mais de R$ 600 mil',
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
