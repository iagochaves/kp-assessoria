// Local stand-in for Netlify Forms + the lead-to-n8n function (dev only): logs each submission and the
// body the function would send to n8n, and answers 200 like Netlify Forms.
// Usage: npm run mock   (PUBLIC_FORMS_URL in .env.development points here)
import http from 'node:http';
import { n8nBody } from '../src/lib/forms.ts';

const port = Number(process.env.PORT ?? 8787);
http.createServer((req, res) => {
  const cors = { 'access-control-allow-origin': req.headers.origin ?? '*', 'access-control-allow-methods': 'OPTIONS, POST' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    console.log(`\n[mock n8n] ${new Date().toLocaleTimeString('pt-BR')} ${req.headers['content-type']}`);
    const fields = Object.fromEntries(new URLSearchParams(raw));
    console.table(fields);
    console.log('[mock n8n] body que a função mandaria ao n8n:');
    console.table(n8nBody(fields));
    res.writeHead(200, { ...cors, 'content-type': 'application/json' });
    res.end('ok');
  });
}).listen(port, () => console.log(`[mock n8n] http://localhost:${port}/__forms.html`));
