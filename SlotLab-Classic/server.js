// Spin-The-Wheel Slot Lab Server (Node.js fallback / alternative)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;
const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, 'slotlab_state_v5.json');
const SPIN_EVENT_FILE = path.join(ROOT, 'slotlab_spin_event_v5.json');

const DEFAULT_STATE = {
  gameName: "Waiting to pick a game...",
  featureName: "N/A",
  spinsRemaining: "N/A",
  spinsTotal: "N/A",
  betSize: "N/A",
  rtp: "N/A",
  vol: "N/A",
  wheelLetter: "N/A",
  spinNo: "1",
  sessionStarted: false,
  bonusAt: 0,
  promoMain: false
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Reset state on start
fs.writeFileSync(STATE_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf8');
fs.writeFileSync(SPIN_EVENT_FILE, '{}', 'utf8');

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (urlPath === '/state.json') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFileSync(STATE_FILE, JSON.stringify(parsed, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }
    try {
      const data = fs.existsSync(STATE_FILE) ? fs.readFileSync(STATE_FILE, 'utf8') : JSON.stringify(DEFAULT_STATE);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (urlPath === '/spin-event.json') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFileSync(SPIN_EVENT_FILE, JSON.stringify(parsed, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }
    try {
      const data = fs.existsSync(SPIN_EVENT_FILE) ? fs.readFileSync(SPIN_EVENT_FILE, 'utf8') : '{}';
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  let relPath = urlPath === '/' ? '/controller.html' : urlPath;
  let filePath = path.join(ROOT, path.normalize(relPath).replace(/^(\.\.[\/\\])+/, ''));

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found: ' + urlPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + err.message);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Spin-The-Wheel Slot Lab Server running (Node.js)');
  console.log(`Folder:     ${ROOT}`);
  console.log(`Overlay:    http://localhost:${PORT}/overlay.html`);
  console.log(`Vertical:   http://localhost:${PORT}/overlay-vertical.html`);
  console.log(`OBS Dock:   http://localhost:${PORT}/dock_controller.html`);
  console.log(`Controller: http://localhost:${PORT}/controller.html`);
  console.log(`Wheel:      http://localhost:${PORT}/wheel.html`);
  console.log(`State API:  http://localhost:${PORT}/state.json`);
  console.log('Keep this window open while streaming. Press Ctrl+C to stop.');

  const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  try { exec(`${startCmd} http://localhost:${PORT}/controller.html`); } catch(e) {}
});
