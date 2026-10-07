# MASTER CONTEXT - For New GitHub-Connected Chat
# READ Slot-Lab.zip FIRST

## How to Initialize from Slot-Lab.zip

User has repo https://github.com/MAVOmusic/SlotLab and a file Slot-Lab.zip (http://Slot-Lab.zip placeholder, actually uploaded as artifact or in repo).

Slot-Lab.zip = entire Arena workspace /home/user/ :
- slot-lab-fixed/ (v5.22 no gift subs, latest live project)
- CONTEXT_FOR_NEW_CHAT.md
- slot-lab-v5-*.zip history
- slots.js (5,826 games)
- PNG debug screenshots
- uploads/

**Your first steps in new chat:**
1. List repo files via github tools (list_connector_tools github, then list files)
2. If Slot-Lab.zip exists in repo, download/read it: use bash `unzip -l Slot-Lab.zip` to see, then `unzip Slot-Lab.zip -d /tmp/slotlab_src`
3. From unpacked source, create the 2-folder structure in repo root if not exists:
   - /SlotLab-Classic/ = copy of slot-lab-fixed/ (exclude *.PNG, slotlab_*.json, __pycache__)
   - /SlotLab-BonusHunt/ = new bonus hunt system (see below)
4. Verify structure, then commit.

If Slot-Lab.zip not in repo, use current repo's SlotLab-Classic and SlotLab-BonusHunt as base (already built in SlotLab-Rebuild-v1.zip).

## Current Built Structure (in SlotLab-Rebuild-v1.zip)

```
SlotLab/
  SlotLab-Classic/ (v5.22 untouched)
    overlay.html (1920x1080, tabs: Live, Wheel, Spin Bar, Manual, DB)
    overlay-vertical.html (1080x1920)
    wheel-transparent.html + spinbar-transparent.html (passive viewer, hidden-all after pick)
    controller.html + dock_controller.html (dock loads overlay.html?edit=1&dock=1&compact=1)
    slots.js (5,826)
    start_server.py port 8000 (resets state.json + spin-event.json on start)
    start_server.bat

  SlotLab-BonusHunt/ (NEW v1.0)
    bonus-hunt-overlay.html (1920x1080) - HUD: Balance £100, Bet £0.50/£0.40, Threshold £90, Remaining £10, Spins This Game, Total Bonuses, Highest Win x251, Last Win, Profit, Progress Bar
    bonus-hunt-overlay-vertical.html (1080x1920)
    bonus-hunt-dock.html (compact dock iframe)
    bonus-hunt-controller.html (full controller)
    slots.js
    start_server.py port 8001 (DEFAULT_STATE startingBalance 100, currentBalance 100, game FITH2, bet £0.50, booster +30p No Walls + Bonus Icon locked, threshold 90, bonuses 0, highest 0, gameIndex 0, bonusAt 0)
    start_server.bat
```

## Bonus Hunt Strategy - Full Spec

- Start £100
- FITH2: 20p +30p booster = £0.50/spin, No Walls + guaranteed bonus icon in locked zones
- FITH3: 20p +20p booster = £0.40/spin, guaranteed 1 bonus icon on col2
- Spin until bonus OR £10+ win OR down to ~£90 (90.43 stop) for FITH2, then ~£80 for FITH3, then back to FITH2 threshold 70, then FITH3 threshold 60 etc. Alternate.
- Residual: If win £16 and end at £96.43, move to other game but spin only £6.43 before moving back. Maintains £10 jump.
- Example: 100 90 80 92 90 80 70 100 = 6 bonuses in 1h, ended same balance with winnings.
- Overlay must show: Current Game, Booster, Bet, Balance, Profit, Threshold, Remaining, Spins This Game, Total Spins, Total Bonuses, Highest Win x251 (win / £0.20 base), Last Win
- Dock controls: Start New Hunt (£100), Log Spin (-bet), Log Win (amount, auto calc X), Log BONUS + Next Game (bonus flash), Next Game (toggles FITH2/FITH3, calculates threshold with residual: if balance - desiredThreshold >10.5, set threshold = ceil(balance/10)*10 -10), Balance/Threshold edit, Export CSV, Bonus Flash
- Works with dock same way as Classic: body.dock-mode.compact-mode CSS scoped, BroadcastChannel bonus_hunt_v1, localStorage bonus_hunt_state_v1, serverPush/ Poll to state.json

## Classic Spec (Must Stay Untouched)

- v5.22 no gift subs (CSS override .promo-neon,.main-promo display:none)
- Wheel1: letters/numbers from DB, removed until Reset Pick
- Wheel2: 25 random games from letter pool, last-10 blocked, Spin Again fills if <25, Shuffle rebuilds
- Wheel3 weighted: 100=75%,75=15%,125=5%,150=2.5%,175=1.25%,200=0.8%,250=0.28%,300=0.1%,400=0.05%,500=0.01%
- Wheel4 weighted: £0.20=65%,£0.10=20%,£0.40=10%,£0.60=2.5%,£0.80=1.4%,£1.00=0.8%,£2.00=0.3%
- Stop rule: 100 Spins • Stop on Bonus / +£5 / -£10, Manual bet £0.20
- State keys: slotlab_state_v5, slotlab_slots_v5, slotlab_log_v5, slotlab_recent_games_v5, BroadcastChannel slotlab_v5, server state.json + spin-event.json port 8000
- Spin animation 5-8s ease, tick/finish sounds + Bonus voice, ember flash BONUS TIME via bonusAt
- Spin bar row-height fix: box-sizing + inset shadow, dynamic measure getBoundingClientRect()
- Wheel2 label: shortenGameLabel(name,25) word-boundary + ..., same direction, 900 18px Arial overlay / 21px transparent, R*.26
- Validation: node --check, python3 -m py_compile, ZIP delivery via present_file, cache-bust ?v=NNN, clean extract C:\SlotLab\

## Next Steps After Unpacking

1. Verify Classic still runs on 8000: http://localhost:8000/overlay.html?v=523 etc
2. Verify Bonus Hunt runs on 8001: http://localhost:8001/bonus-hunt-overlay.html?v=100, dock, vertical
3. Test dock integration, bonus flash, balance logic, residual threshold
4. Iterate: add balance graph, bonus history list, auto suggestions
5. Build new zips: slot-lab-classic-v5-23.zip, slot-lab-bonushunt-v1-0.zip, present_file
6. Commit to GitHub

## OBS URLs After Rebuild

Classic (8000):
- http://localhost:8000/overlay.html?v=523
- http://localhost:8000/overlay-vertical.html?v=523
- http://localhost:8000/wheel-transparent.html?v=523
- http://localhost:8000/spinbar-transparent.html?v=523
- Dock: http://localhost:8000/dock_controller.html

Bonus Hunt (8001):
- http://localhost:8001/bonus-hunt-overlay.html?v=100
- http://localhost:8001/bonus-hunt-overlay-vertical.html?v=100
- Dock: http://localhost:8001/bonus-hunt-dock.html
- Controller: http://localhost:8001/bonus-hunt-controller.html

User: MAVOmusic, Windows OBS 32.x Portable C:\SlotLab\ and C:\SlotLab-BonusHunt\
