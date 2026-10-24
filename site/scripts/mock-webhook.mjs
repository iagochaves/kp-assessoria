// Local stand-in for the n8n webhook (dev only): logs each lead body and answers 200 like n8n.
// Usage: npm run mock   (PUBLIC_LEAD_ENDPOINT in .env.development points here)
import http from 'node:http';

const port = Number(process.env.PORT ?? 8787);
http.createServer((req, res) => {
  const cors = { 'access-control-allow-origin': req.headers.origin ?? '*', 'access-control-allow-methods': 'OPTIONS, POST' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    console.log(`\n[mock n8n] ${new Date().toLocaleTimeString('pt-BR')} ${req.headers['content-type']}`);
    console.table(Object.fromEntries(new URLSearchParams(raw)));
    res.writeHead(200, { ...cors, 'content-type': 'application/json' });
    res.end('{"message":"Workflow was started"}');
  });
}).listen(port, () => console.log(`[mock n8n] http://localhost:${port}/hook`));
