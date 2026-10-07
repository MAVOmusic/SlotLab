# CONTEXT FOR GITHUB AGENT - READ THIS FIRST

You are rebuilding Slot Lab for MAVOmusic. User uploaded Slot-Lab.zip containing whole Arena workspace.

## STEP 0: Unpack Repo Zip

- Repo is https://github.com/MAVOmusic/SlotLab
- There is a file Slot-Lab.zip (or uploaded as release) that contains the entire `/home/user/` workspace: `slot-lab-fixed/`, `CONTEXT_FOR_NEW_CHAT.md`, old zips, PNGs, slots.js etc.
- Your job: Read Slot-Lab.zip, unpack it, then create the folders/files as described in README.md

```
Slot-Lab.zip contents:
- slot-lab-fixed/ (live project v5.22 no gift subs)
  - overlay.html, overlay-vertical.html, wheel-transparent.html, spinbar-transparent.html, controller.html, dock_controller.html, wheel.html, slots.js (5,826 games), start_server.py (port 8000), start_server.bat, README.md, RTP_VOL_EDITING_GUIDE.txt, plus debug PNGs
- CONTEXT_FOR_NEW_CHAT.md (full history)
- Old zips slot-lab-v5-*.zip
- uploads/ (user screenshots)
```

## STEP 1: Create Folders

Create in repo root:

```
/SlotLab-Classic/   <- UNTOUCHED copy of slot-lab-fixed (exclude PNGs, slotlab_state_v5.json, slotlab_spin_event_v5.json, __pycache__)
  Keep: overlay.html, overlay-vertical.html, wheel.html, controller.html, dock_controller.html, wheel-transparent.html, spinbar-transparent.html, slots.js, start_server.py, start_server.bat, README.md, RTP_VOL_EDITING_GUIDE.txt

/SlotLab-BonusHunt/  <- NEW Bonus Hunt system (already partially built in current workspace, but rebuild from Classic + new files)
  Must contain:
  - bonus-hunt-overlay.html (1920x1080) - main OBS, shows Balance, Bet, Threshold/Remaining, Spins This Game, Total Bonuses, Highest Win x251
  - bonus-hunt-overlay-vertical.html (1080x1920)
  - bonus-hunt-dock.html (compact dock iframe -> bonus-hunt-overlay.html?edit=1&dock=1&compact=1)
  - bonus-hunt-controller.html (full controller iframe)
  - slots.js (copy from Classic)
  - start_server.py (port 8001, DEFAULT_STATE with startingBalance 100, currentBalance 100, currentGame Fire In The Hole 2, bet £0.50, threshold 90, totalBonuses 0, highestWinX 0, etc, serves bonus_hunt_state_v1.json + bonus_hunt_spin_event_v1.json as state.json/spin-event.json)
  - start_server.bat
  - README.md (bonus hunt specific)
```

## STEP 2: Bonus Hunt Strategy Details (Must Implement)

Starting balance: £100
- FITH2: 20p base +30p booster = £0.50/spin, booster: No Walls + guaranteed at least one bonus icon in not unlocked zones
- FITH3: 20p base +20p booster = £0.40/spin, booster: guaranteed 1 bonus icon on second column
- Spin until: bonus OR £10+ win OR down to around £90 (if £90.43 stop, don't spin again)
- Then FITH3 until bonus OR £10+ win OR down to ~£80 (80.33 stop)
- Then back to FITH2 same way, then FITH3 etc. Alternate.

Residual Logic: If winning £16 in main game and ending at £96.43, move into other game but spinning only £6.43 before moving back to game before. This maintains £10 jump.

Example run: Balance jumps 100 90 80 92 90 80 70 100 - 6 bonuses in 1 hour, ended same balance with winnings.

Overlay must have:
- Current Game, Bet (incl booster), Total Bonuses, Highest Win (X251 = win / £0.20 base), Balance, Profit, Threshold, Remaining, Spins This Game, Total Spins, Last Win

Dock same way as other overlay: compact-mode CSS scoped to body.dock-mode.compact-mode, BroadcastChannel bonus_hunt_v1, localStorage bonus_hunt_state_v1, serverPush/serverPoll to state.json, bonus flash via bonusAt.

## STEP 3: Classic Must Stay Untouched

v5.22 already has gift subs promo removed via CSS override .promo-neon,.main-promo{display:none!important}
Keep weighted odds:
Wheel3: 100=75%,75=15%,125=5%,150=2.5%,175=1.25%,200=0.8%,250=0.28%,300=0.1%,400=0.05%,500=0.01%
Wheel4: £0.20=65%,£0.10=20%,£0.40=10%,£0.60=2.5%,£0.80=1.4%,£1.00=0.8%,£2.00=0.3%
Stop rule: 100 Spins • Stop on Bonus / +£5 / -£10
Manual bet £0.20

## STEP 4: Validation & Delivery

- Validate all HTML <script> with node --check, Python with python3 -m py_compile
- Build zips: slot-lab-classic-v5-23.zip and slot-lab-bonushunt-v1-0.zip (or combined repo zip)
- Always present_file after changes
- OBS URLs with ?v= cache bust: Classic ?v=523, Bonus Hunt ?v=100
- Classic OBS: http://localhost:8000/overlay.html, dock_controller.html, wheel-transparent.html, spinbar-transparent.html
- Bonus Hunt OBS: http://localhost:8001/bonus-hunt-overlay.html, bonus-hunt-overlay-vertical.html, bonus-hunt-dock.html

## STEP 5: Start Building

After unpacking zip and creating folders, start building Bonus Hunt overlay improvements:
- Add balance graph, bonus history, auto threshold suggestion
- Make dock log win/bonus with X calc
- Ensure bonus flash works (BONUS TIME text)
- Test server on 8001

User: MAVOmusic, Windows OBS 32.x Portable Mode C:\SlotLab\ and C:\SlotLab-BonusHunt\
