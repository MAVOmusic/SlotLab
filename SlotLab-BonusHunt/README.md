# Slot Lab Bonus Hunt — v1.0
## Fire In The Hole 2 (FITH2) ↔ Fire In The Hole 3 (FITH3) Strategy & Overlay System

Dedicated OBS Live Streaming HUD, Compact Controller Dock, and Strategy Engine for the alternating Fire In The Hole 2 & 3 bonus hunt strategy.

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

## Strategy & Rulebook

- **Starting Balance:** £100.00
- **Game 1 — Fire In The Hole 2 (FITH2):**
  - **Bet:** £0.50 per spin (20p base bet + 30p booster)
  - **Booster:** No Walls + guaranteed at least one bonus icon in locked zones
  - **Stop Rule:** Spin until **Bonus** OR **£10+ Win** OR balance drops to threshold **~£90.00** (e.g. 90.43 stop).
- **Game 2 — Fire In The Hole 3 (FITH3):**
  - **Bet:** £0.40 per spin (20p base bet + 20p booster)
  - **Booster:** Guaranteed 1 bonus icon on column 2
  - **Stop Rule:** Spin until **Bonus** OR **£10+ Win** OR balance drops to threshold **~£80.00** (e.g. 80.33 stop).
- **Alternating Sequence:** FITH2 (Thresh 90) → FITH3 (Thresh 80) → FITH2 (Thresh 70) → FITH3 (Thresh 60)...
- **Residual Win Strategy:**
  - If a win occurs (e.g. +£16 win bringing balance to £96.43):
  - Switch to the other game, but **only spin the residual £6.43** down to £90.00 before switching back.
  - This strictly maintains the £10 ladder jumps across all balance variations.
  - *Example session trajectory:* `100 → 90 → 80 → 92 → 90 → 80 → 70 → 100` (6 bonuses collected in 1 hour).

---

## On-Screen Note & Sub Rewards

- Includes a compact, glowing on-screen banner:
  **`🎁 5 GIFTED SUBS = 100 SPINS ON YOUR GAME CALL @ 20p`**
- Fully customizable and toggleable directly in the Live Overlay tab of the dock.

---

## Multiplier Calculations

All win multipliers (X) are calculated against the **£0.20 base bet**:
$$\text{Multiplier (X)} = \frac{\text{Win Amount}}{£0.20}$$
- £16.00 win = **x80**
- £50.20 win = **x251**
- £10.00 win = **x50**

---

## OBS Overlay HUD Features (1920x1080 & 1080x1920)

1. **Current Game & Booster Subtitle:** Live game name + active booster rules.
2. **Promo Note Banner:** Compact reward badge (`5 GIFTED SUBS = 100 SPINS ON YOUR GAME CALL @ 20p`).
3. **Balance & Profit:** Real-time balance display with profit tracking (+/-) and animated gradient progress bar.
4. **Bet / Spin:** Current spin cost (£0.50 / £0.40) and base bet reference.
5. **Threshold / Remaining:** Next exit balance, exact remaining budget, and estimated spins left.
6. **Spins This Game & Total Spins:** Live spin counters.
7. **Total Bonuses:** Neon green bonus counter + last bonus timestamp.
8. **Highest Win:** Peak session multiplier (e.g. `x251` / `£50.20`).
9. **Last Win:** Most recent win amount & multiplier.
10. **Bonus Time Flash:** High-impact fullscreen glowing animation + synthesized audio on bonus hit.

---

## OBS Dock Controller Features

- **One-Click Primary Buttons:**
  - `Log Spin (-£0.50 / -£0.40)` (Keyboard shortcut: `Spacebar` / `S`)
  - `Log BONUS + Next` (Keyboard shortcut: `B`) — triggers bonus animation, logs bonus, advances game.
  - `Next Game →` (Keyboard shortcut: `N`) — toggles game and auto-computes residual threshold.
  - `Bonus Flash` — manually preview/trigger the visual bonus alert.
- **Quick Win Buttons:** Fast 1-click win logging for `+£2`, `+£5`, `+£10`, `+£16`, `+£20`, `+£50`, plus manual numeric entry.
- **Quick Balance Tweaks:** `+£1`, `-£1`, `+£5`, `-£5`, `+£10`, `-£10` instant adjustment buttons.
- **Stats & Balance Trajectory Chart:** Canvas graph showing session balance milestones with green bonus markers.
- **Log / History & CSV Export:** Complete action history with timestamp, amounts, and one-click CSV download.
- **Live Overrides:** Full manual override of HUD text fields, promo note, and raw JSON import/export.
