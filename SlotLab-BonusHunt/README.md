# Slot Lab Bonus Hunt — v1.0
## Fire In The Hole 2 ↔ Fire In The Hole 3 ↔ Viewer Calls & Live Overlay System

Dedicated OBS Live Streaming HUD, Streamlined OBS Dock Controller, and Dynamic Strategy Engine for bonus hunting and live viewer game calls.

---

## Quick Start & Server Launchers

The server runs on **Port 8001** and supports **multiple launch methods** for maximum Windows compatibility:

### Option 1: Double-click `start_server.bat` (Recommended)
Automatically detects your environment in this order:
1. Python Launcher (`py -3` / `py`)
2. Local AppData & Program Files Python paths
3. Node.js (`server.js`)
4. Native Windows PowerShell HTTP Server (`server.ps1` — requires zero external installs!)

### Option 2: PowerShell (`start_server.ps1`)
Right-click `start_server.ps1` → **Run with PowerShell**, or in terminal:
```powershell
.\start_server.ps1
```

### Option 3: Node.js (If you have Node installed)
```cmd
node server.js
```

### Option 4: Direct Python
```cmd
python start_server.py
```

> **Fixing "Python was not found" Windows Store Error:**
> If Windows tries to open the Microsoft Store when running `python`:
> 1. Open Windows **Settings** → **Apps** → **Advanced app settings** → **App execution aliases**.
> 2. Turn **OFF** the toggles for `App Installer (python.exe)` and `App Installer (python3.exe)`.
> 3. Alternatively, simply use `start_server.bat` or `start_server.ps1` which automatically bypasses the Windows Store stub and launches the built-in PowerShell server!

---

## OBS Setup

1. Keep the server window open while streaming (`http://localhost:8001`).
2. In **OBS Studio**:
   - **Main Overlay (1920x1080):** Add Browser Source → URL: `http://localhost:8001/bonus-hunt-overlay.html?v=100` (Width: 1920, Height: 1080)
   - **Vertical Overlay (1080x1920):** Add Browser Source → URL: `http://localhost:8001/bonus-hunt-overlay-vertical.html?v=100` (Width: 1080, Height: 1920)
   - **OBS Custom Browser Dock:** OBS → Docks → Custom Browser Docks → Add:
     - Name: `Bonus Hunt Dock`
     - URL: `http://localhost:8001/bonus-hunt-dock.html`
   - **Chrome Full Controller:** `http://localhost:8001/bonus-hunt-controller.html`

---

## Streamlined Stream Overlay Layout

The on-screen overlays (1920x1080 horizontal and 1080x1920 vertical) display a clean, high-impact HUD without screen clutter:

- **Top Area:**
  - **1920x1080:** Small top-left logo + Enlaraged glowing sub reward line:
    `🎁 5 GIFTED SUBS = 100 SPINS ON YOUR GAME CALL @ 20p`
  - **1080x1920 (Vertical):** Top area kept completely clear for streamer facecam (corner logo badge only).
- **Bottom HUD (6 Exact Streamlined Metrics):**
  1. **Spins This Game:** Shows live spin count for current game + active game name & spin bet size.
  2. **Total Spins:** Session total spins (accumulates across all games).
  3. **Wagered:** Total money wagered (£) across all spins.
  4. **Total Bonuses:** Number of bonus rounds hit + time of last bonus.
  5. **Last Win:** Most recent win (£) + multiplier (X vs base bet).
  6. **Highest Win:** Session peak win multiplier (X) + cash value (£).
- **Bonus Time Flash:** High-impact glowing fullscreen celebration animation and sound effect whenever a bonus is hit.

---

## Streamlined OBS Dock Controller

The dock controller is focused on rapid live stream operation:

- **Active Game & Bet Size Selector:**
  - One-click presets: **FITH2 (£0.50)**, **FITH3 (£0.40)**, **Viewer Call (£0.20)**.
  - Custom game input field: type any viewer game request on the fly.
  - Custom Spin Cost (£) & Base Bet (£) inputs for exact multiplier calculations.
- **Big Action Buttons:**
  - **Log Spin (Spacebar / S):** Increments spins and adds bet to Wagered.
  - **Bonus Hit! (B):** Increments Total Bonuses, triggers fullscreen celebration, and switches game.
  - **Next Game (N):** Resets spins this game and advances sequence.
- **Log Win (£):**
  - Instant quick-win buttons: `+£2`, `+£5`, `+£10`, `+£16`, `+£20`, `+£50`.
  - Manual win input with instant multiplier calculation against base bet.
- **Live Stat Adjusters:**
  - Compact `+` / `-` steppers for Spins This Game, Total Spins, Wagered, and Total Bonuses.

---

## Multiplier Calculations

Multiplier (X) is calculated against the active base bet (default £0.20):
$$\text{Multiplier (X)} = \frac{\text{Win Amount}}{\text{Base Bet}}$$
- £16.00 win @ £0.20 base = **x80**
- £50.20 win @ £0.20 base = **x251**
- £10.00 win @ £0.20 base = **x50**
