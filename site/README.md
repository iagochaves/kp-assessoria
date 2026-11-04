# KP Assessoria · Landing page moto-first

Astro estático, sem framework de UI. O quiz é o único JavaScript da página (inline, ~5 KB).

## Rodar

```bash
npm install
cp .env.example .env
npm run dev            # http://localhost:4321
npm run mock           # outro terminal: recebe o quiz no lugar do Netlify Forms e mostra o corpo do n8n
npm run build          # gera dist/
npm run preview
```

## Antes de publicar

1. **Lead.** O quiz posta no Netlify Forms (form `lead`, campos em `public/__forms.html` e `src/lib/forms.ts`). A função `netlify/functions/lead-to-n8n.mts` repassa cada submissão verificada ao n8n, no corpo do webhook do Elementor (`src/lib/lead.ts`) mais `lead_id`. No Netlify: Forms → **Enable form detection**; `N8N_WEBHOOK_URL` por contexto (ver `netlify.toml`); Forms → Submission notifications → email do comercial, que é o fallback se o n8n falhar. Submissões marcadas como spam pelo Akismet ficam em Forms → `lead` → Spam e não vão ao n8n.
2. **GTM.** Container próprio da landing em `gtm/container.json` (ver `gtm/README.md`). O Lead do Meta sai do evento `kp_lead` do dataLayer.
3. **Hospedagem.** Qualquer CDN estático (Cloudflare Pages, Netlify, Vercel). `public/_headers` já traz headers de segurança e cache (formato Netlify/Cloudflare Pages).

## Onde editar conteúdo

Tudo em `src/data/content.ts`: números oficiais, depoimentos (texto literal da home atual), relação faixa → depoimento do topo, passos, FAQ e @ dos clientes.

- Depoimentos com vídeo: `video: '/video/<id>.mp4'`. Vídeos ficam em `public/video/`, comprimidos (H.264, 540px, ~2–7 MB) e só carregam no toque.
  Para comprimir um novo: `ffmpeg -i in.mp4 -vf "scale='min(540,iw)':-2" -c:v libx264 -preset slow -crf 28 -movflags +faststart -c:a aac -b:a 64k -ac 1 out.mp4`
- Imagens em `src/assets/` são otimizadas no build (WebP responsivo).

## Pendências do cliente

- Vídeos de Lívia, Renan e Vanessa (hoje só têm capa).
- Número de WhatsApp da KP, se quiserem um CTA alternativo (o link `wa.me` do site atual é da agência que o desenvolveu).
- Fotos de placas com nome da loja e cidade, para legendar a galeria.
