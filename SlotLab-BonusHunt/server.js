// Slot Lab Bonus Hunt Server (Node.js fallback / alternative)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8001;
const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, 'bonus_hunt_state_v1.json');
const SPIN_EVENT_FILE = path.join(ROOT, 'bonus_hunt_spin_event_v1.json');

const DEFAULT_STATE = {
  startingBalance: 100,
  currentBalance: 100,
  currentGame: "Fire In The Hole 2",
  currentBooster: "+30p No Walls + Bonus Icon locked",
  currentBet: "£0.50",
  currentBetValue: 0.50,
  baseBetValue: 0.20,
  threshold: 90,
  remainingToThreshold: 10,
  spinsThisGame: 0,
  totalSpins: 0,
  totalBonuses: 0,
  highestWinX: 0,
  highestWinAmount: 0,
  lastWinAmount: 0,
  lastWinX: 0,
  sessionProfit: 0,
  gameIndex: 0,
  bonusAt: 0,
  spinNo: "1",
  gameName: "Fire In The Hole 2",
  featureName: "Bonus Hunt • £100 Start",
  betSize: "£0.50",
  balanceDisplay: "£100.00",
  promoNote: "🎁 5 GIFTED SUBS = 100 SPINS ON YOUR GAME CALL @ 20p",
  showPromo: true
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
    // GET /state.json
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

  // Static file serving
  let relPath = urlPath === '/' ? '/bonus-hunt-controller.html' : urlPath;
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
  console.log('Slot Lab BONUS HUNT Server running (Node.js)');
  console.log(`Folder:     ${ROOT}`);
  console.log(`Overlay:    http://localhost:${PORT}/bonus-hunt-overlay.html`);
  console.log(`Vertical:   http://localhost:${PORT}/bonus-hunt-overlay-vertical.html`);
  console.log(`OBS Dock:   http://localhost:${PORT}/bonus-hunt-dock.html`);
  console.log(`Controller: http://localhost:${PORT}/bonus-hunt-controller.html`);
  console.log(`State API:  http://localhost:${PORT}/state.json`);
  console.log('Keep this window open while streaming. Press Ctrl+C to stop.');

  // Try opening browser
  const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  try { exec(`${startCmd} http://localhost:${PORT}/bonus-hunt-controller.html`); } catch(e) {}
});
