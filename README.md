# SlotLab - MAVOmusic / Slot Lab

This repo contains **2 independent OBS overlay systems** for slot streaming on Kick + Twitch.

## Repo Structure

```
/SlotLab-Classic/       -> Existing Spin-The-Wheel Slot Lab v5.22 (no gift subs) - UNTOUCHED
  overlay.html                  1920x1080 main OBS source
  overlay-vertical.html         1080x1920 vertical for Shorts
  wheel-transparent.html        Passive viewer wheel (controlled via spin-event.json)
  spinbar-transparent.html      Passive viewer spin bar
  controller.html               Full browser controller
  dock_controller.html          Compact OBS dock -> loads overlay.html?edit=1&dock=1&compact=1
  slots.js                      5,826 games DB (RTP/Vol)
  start_server.py / .bat        localhost:8000 server (resets state.json on start)
  README.md

/SlotLab-BonusHunt/      -> NEW Bonus Hunt Strategy Overlay v1.0
  bonus-hunt-overlay.html               1920x1080 main OBS (shows Balance, Bet, Threshold, Bonuses, Highest Win x251)
  bonus-hunt-overlay-vertical.html      1080x1920 vertical
  bonus-hunt-dock.html                  Compact OBS dock -> bonus-hunt-overlay.html?edit=1&dock=1&compact=1
  bonus-hunt-controller.html            Full controller
  slots.js                              Same DB
  start_server.py / .bat                localhost:8001 server (separate from Classic, uses bonus_hunt_state_v1.json)
  README.md
```

## How to Use - Classic (Existing)

1. Extract `SlotLab-Classic` to `C:\SlotLab\` (clean folder, do NOT mix old versions)
2. Run `start_server.bat` -> opens http://localhost:8000/controller.html
3. OBS Sources:
   - Main: `http://localhost:8000/overlay.html?v=522`
   - Vertical: `http://localhost:8000/overlay-vertical.html?v=522`
   - Transparent Wheel: `http://localhost:8000/wheel-transparent.html?v=522`
   - Transparent Bar: `http://localhost:8000/spinbar-transparent.html?v=522`
   - Dock: `http://localhost:8000/dock_controller.html` (Custom Dock in OBS)

## How to Use - Bonus Hunt NEW STRATEGY

**Strategy:**
- Start £100
- Fire In The Hole 2: 20p +30p booster = £0.50/spin (No Walls + Bonus Icon in locked zones). Spin until bonus OR £10+ win OR down to ~£90 (90.43 stop)
- Fire In The Hole 3: 20p +20p booster = £0.40/spin (1 Bonus Icon on col2). Spin until bonus OR £10+ win OR down to ~£80
- Alternate: FITH2 -> FITH3 -> FITH2 -> FITH3...
- Residual: If you win £16 and end at £96.43, move to other game but spin only £6.43 before moving back. Maintains £10 jump.
- Example: 100 90 80 92 90 80 70 100 = 6 bonuses in 1h, ended same balance with profit.

**Overlay Shows:** Current Game, Booster, Bet/Spin (£0.50/£0.40), Balance £100.00, Profit, Threshold £90.00, Remaining £10.00, Spins This Game, Total Spins, Total Bonuses, Highest Win x251 (£50.20), Last Win.

1. Extract `SlotLab-BonusHunt` to `C:\SlotLab-BonusHunt\` (separate from Classic)
2. Run `start_server.bat` -> http://localhost:8001/bonus-hunt-controller.html (port 8001 so you can run Classic on 8000 simultaneously)
3. OBS Sources:
   - Main: `http://localhost:8001/bonus-hunt-overlay.html?v=100`
   - Vertical: `http://localhost:8001/bonus-hunt-overlay-vertical.html?v=100`
   - Dock: `http://localhost:8001/bonus-hunt-dock.html`

**Dock Controls:**
- Start New Hunt (£100)
- Log Spin (-bet from balance)
- Log Win (enter £ amount, auto calc X vs £0.20 base, e.g., £50.20 = x251)
- Log BONUS + Next Game (increments bonus count, triggers BONUS TIME flash)
- Next Game -> toggles FITH2/FITH3, calculates threshold with residual logic (e.g., £96.43 -> £90 threshold = £6.43 left)
- Balance/Threshold manual edit, Export CSV

## Technical Details (for next AI)

- State sync: Classic uses `slotlab_state_v5` localStorage + BroadcastChannel `slotlab_v5` + `state.json` / `spin-event.json` via start_server.py port 8000
- Bonus Hunt uses `bonus_hunt_state_v1` + `bonus_hunt_v1` + `state.json` (separate file bonus_hunt_state_v1.json) port 8001
- Server resets state on start (DEFAULT_STATE)
- Validation: `node --check` for all <script> blocks, `python3 -m py_compile start_server.py`
- Wheel weighted odds: Wheel3 spins 100=75%, 75=15%, 125=5%, 150=2.5%, 175=1.25%, 200=0.8%, 250=0.28%, 300=0.1%, 400=0.05%, 500=0.01% | Wheel4 bets £0.20=65%, £0.10=20%, £0.40=10%, £0.60=2.5%, £0.80=1.4%, £1.00=0.8%, £2.00=0.3%
- Stop rule classic: 100 Spins • Stop on Bonus / +£5 / -£10
- slots.js format: `const SLOT_DATA = [{"name":"...","rtp":"94.00%","vol":"High"},...];` 5,826 active
- Compact dock CSS must be scoped to `body.dock-mode.compact-mode` only
- Always deliver ZIP via present_file, version increment, cache-bust ?v=NNN

## If You Have Slot-Lab.zip (Whole Workspace)

This zip contains the entire `/home/user/` workspace from Arena (including old PNGs, old zips, slot-lab-fixed, CONTEXT_FOR_NEW_CHAT.md).

To rebuild:
1. Unzip Slot-Lab.zip to temp
2. Copy `slot-lab-fixed/` contents to `SlotLab-Classic/` (exclude *.PNG, slotlab_*.json, __pycache__)
3. Copy `slots.js` to `SlotLab-BonusHunt/` and use the bonus-hunt files already built in this repo
4. Keep `CONTEXT_FOR_NEW_CHAT.md` as reference

## GitHub Setup

Repo: https://github.com/MAVOmusic/SlotLab
- Don't know how to create folders? Just upload the two folders via GitHub web: Add file -> Upload files -> drag SlotLab-Classic and SlotLab-BonusHunt folders (GitHub will create folders automatically from paths).
- Or use `git`:
```
git clone https://github.com/MAVOmusic/SlotLab
cd SlotLab
# copy folders in
git add .
git commit -m "Rebuild: Classic v5.22 + Bonus Hunt v1.0"
git push
```

## Next Steps

- Test Classic still works on 8000
- Test Bonus Hunt on 8001, dock integration
- Iterate bonus hunt overlay with balance graph, bonus history list, auto threshold suggestions
- Weekly bonus hunt stream if works, daily if support grows
