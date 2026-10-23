# KP Assessoria · Landing page moto-first

Astro estático, sem framework de UI. O quiz é o único JavaScript da página (inline, ~5 KB).

## Rodar

```bash
npm install
cp .env.example .env   # preencha PUBLIC_LEAD_ENDPOINT
npm run dev            # http://localhost:4321
npm run build          # gera dist/
npm run preview
```

## Antes de publicar

1. **`PUBLIC_LEAD_ENDPOINT`** (obrigatório). URL que recebe o lead em `POST` JSON. Sem ela o formulário mostra erro ao enviar, de propósito, para nenhum lead se perder em silêncio. Campos enviados:
   `motos_mes, cargo, faturamento, segmento, nome, whatsapp, loja, email, pagina, utm_source, utm_medium, utm_campaign, utm_content, fbclid, enviado_em`.
   O endpoint precisa aceitar CORS do domínio do site.
2. **Pixel / GTM.** Ao enviar com sucesso o quiz dispara `fbq('track','Lead')` e `dataLayer.push({event:'lead'})` se existirem. Inclua o script do Pixel/GTM em `src/layouts/Base.astro`.
3. **Hospedagem.** Qualquer CDN estático (Cloudflare Pages, Netlify, Vercel). `public/_headers` já traz headers de segurança e cache (formato Netlify/Cloudflare Pages).

## Onde editar conteúdo

Tudo em `src/data/content.ts`: números oficiais, depoimentos (texto literal da home atual), relação faixa → depoimento do topo, passos, FAQ e @ dos clientes.

- Depoimentos com vídeo: `video: '/video/<id>.mp4'`. Vídeos ficam em `public/video/`, comprimidos (H.264, 540px, ~2–7 MB) e só carregam no toque.
  Para comprimir um novo: `ffmpeg -i in.mp4 -vf "scale='min(540,iw)':-2" -c:v libx264 -preset slow -crf 28 -movflags +faststart -c:a aac -b:a 64k -ac 1 out.mp4`
- Imagens em `src/assets/` são otimizadas no build (WebP responsivo).

## Pendências do cliente

- Endpoint do lead (acima).
- Vídeos de Lívia, Renan e Vanessa (hoje só têm capa).
- Número de WhatsApp da KP, se quiserem um CTA alternativo (o link `wa.me` do site atual é da agência que o desenvolveu).
- Fotos de placas com nome da loja e cidade, para legendar a galeria.
