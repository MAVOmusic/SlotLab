# Slot Lab Bonus Hunt — v1.0
## Fire In The Hole 2 (FITH2) ↔ Fire In The Hole 3 (FITH3) Strategy & Overlay System

Dedicated OBS Live Streaming HUD, Compact Controller Dock, and Strategy Engine for the alternating Fire In The Hole 2 & 3 bonus hunt strategy.

---

## Quick Start (OBS Streaming)

1. Put the `SlotLab-BonusHunt` folder on your machine (e.g. `C:\SlotLab-BonusHunt\`):
2. Double click **`start_server.bat`** (keep the black server window open while streaming).
3. In **OBS Studio**:
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

## Multiplier Calculations

All win multipliers (X) are calculated against the **£0.20 base bet**:
$$\text{Multiplier (X)} = \frac{\text{Win Amount}}{£0.20}$$
- £16.00 win = **x80**
- £50.20 win = **x251**
- £10.00 win = **x50**

---

## OBS Overlay HUD Features (1920x1080 & 1080x1920)

1. **Current Game & Booster Subtitle:** Live game name + active booster rules.
2. **Balance & Profit:** Real-time balance display with profit tracking (+/-) and animated gradient progress bar.
3. **Bet / Spin:** Current spin cost (£0.50 / £0.40) and base bet reference.
4. **Threshold / Remaining:** Next exit balance, exact remaining budget, and estimated spins left.
5. **Spins This Game & Total Spins:** Real-time counters.
6. **Total Bonuses:** Neon green bonus counter + last bonus timestamp.
7. **Highest Win:** Peak session multiplier (e.g. `x251` / `£50.20`).
8. **Last Win:** Most recent win amount & multiplier.
9. **Bonus Time Flash:** High-impact fullscreen glowing animation + synthesized audio on bonus hit.

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
- **Live Overrides:** Full manual override of HUD text fields and raw JSON import/export.

---

## Port Allocation

- **Port 8000:** SlotLab Classic (v5.22 Spin-The-Wheel)
- **Port 8001:** SlotLab Bonus Hunt (FITH2 ↔ FITH3)
