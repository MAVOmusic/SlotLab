from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import webbrowser

PORT = 8000
ROOT = Path(__file__).resolve().parent
STATE_FILE = ROOT / "slotlab_state_v5.json"
SPIN_EVENT_FILE = ROOT / "slotlab_spin_event_v5.json"

DEFAULT_STATE = {
    "gameName": "Waiting to pick a game...",
    "featureName": "N/A",
    "spinsRemaining": "N/A",
    "spinsTotal": "N/A",
    "betSize": "N/A",
    "rtp": "N/A",
    "vol": "N/A",
    "wheelLetter": "N/A",
    "spinNo": "1",
    "sessionStarted": False,
    "bonusAt": 0,
    "promoMain": False,
}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/state.json":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            if STATE_FILE.exists():
                data = STATE_FILE.read_bytes()
            else:
                data = json.dumps(DEFAULT_STATE, ensure_ascii=False).encode("utf-8")
            self.wfile.write(data)
            return
        if path == "/spin-event.json":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            if SPIN_EVENT_FILE.exists():
                data = SPIN_EVENT_FILE.read_bytes()
            else:
                data = b"{}"
            self.wfile.write(data)
            return
        super().do_GET()

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path in ("/state.json", "/spin-event.json"):
            length = int(self.headers.get("Content-Length", "0") or "0")
            raw = self.rfile.read(length)
            try:
                data = json.loads(raw.decode("utf-8"))
                if not isinstance(data, dict):
                    raise ValueError("payload must be an object")
                target = STATE_FILE if path == "/state.json" else SPIN_EVENT_FILE
                target.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(e)}).encode("utf-8"))
            return
        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    # Reset overlay/session state every time the server starts.
    STATE_FILE.write_text(json.dumps(DEFAULT_STATE, ensure_ascii=False, indent=2), encoding="utf-8")
    SPIN_EVENT_FILE.write_text("{}", encoding="utf-8")
    print("Spin-The-Wheel Slot Lab server")
    print(f"Folder: {ROOT}")
    print(f"Overlay:    http://localhost:{PORT}/overlay.html")
    print(f"OBS Dock:   http://localhost:{PORT}/controller.html")
    print(f"Wheel:      http://localhost:{PORT}/wheel.html")
    print(f"State API:  http://localhost:{PORT}/state.json")
    print("Keep this window open while streaming. Press Ctrl+C to stop.")
    try:
        webbrowser.open(f"http://localhost:{PORT}/controller.html")
    except Exception:
        pass
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
