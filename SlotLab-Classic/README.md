# Spin-The-Wheel Slot Lab — v5 Unified Fix

This version replaces the broken v4 files with one reliable system.

## v5.1 update

- OBS Dock wheel is now compact/responsive, so the Spin button stays visible inside a narrow dock.
- The real 1920×1080 overlay source is not scaled by the dock CSS.
- Top-left `SPIN-THE-WHEEL SLOT LAB` block and small `SLOT LAB` cover are now fully opaque/solid.
- Browser-to-OBS sync now uses the local Python server state API, not only localStorage.

## What was fixed

- `overlay.html` has been rebuilt cleanly. The broken `body.show-live 50%...` CSS and stray `LIVE</div>` fragment are gone.
- The wheel is now built directly into the overlay editor, so you can spin/pick/send from the same page.
- The separate `wheel.html` still exists, but it is now a wrapper around the same unified editor/wheel. No duplicate wheel logic.
- `controller.html` is now a simple OBS Dock for the live editor.
- Sync uses one state key: `slotlab_state_v5`, plus a real `state.json` server API. This means Chrome, OBS Browser Source, and OBS Dock can update each other when `start_server.bat` is running.
- Works best over `http://localhost:8000` instead of `file://`.
- Top pointer on the wheel is now obvious and fixed at the top, so the winning point is clear.

## Files

- `overlay.html` — main 1920×1080 OBS overlay + live editor + wheel picker
- `controller.html` — OBS dock live editor
- `wheel.html` — full wheel page, using the same unified picker
- `overlay-vertical.html` — 1080×1920 Shorts/TikTok overlay synced to the same state
- `slots.js` — your 5,988 slot list
- `start_server.bat` / `start_server.py` — local server for reliable sync

## Recommended OBS setup

1. Put this folder somewhere clean, for example:

   `C:\SlotLab\`

2. Double-click:

   `start_server.bat`

   Keep the black server window open while streaming.

3. OBS Browser Source:

   - Source name: `SlotLab Overlay`
   - Use URL, not Local File:

     `http://localhost:8000/overlay.html`

   - Width: `1920`
   - Height: `1080`
   - FPS: `30`
   - Custom CSS if needed: `body { background-color: rgba(0,0,0,0); }`

4. OBS Dock:

   OBS → Docks → Custom Browser Docks → Add:

   - Name: `Slot Lab`
   - URL: `http://localhost:8000/controller.html`

5. Wheel page, if wanted in Chrome:

   `http://localhost:8000/wheel.html`

## How to use live

### Overlay editor

- In the OBS dock, use the `Live Overlay` tab to edit game, spins, bet, RTP, volatility.
- Or right-click the OBS Browser Source → `Interact` → press `E`.

### Wheel flow

Open the `Wheel Picker` tab:

1. Wheel 1: pick letter / number
2. Wheel 2: pick game from that letter pool
3. Wheel 3: weighted spin count
   - 50 = 65%
   - 75 = 23%
   - 100 = 10%
   - 125 = 2%
4. Wheel 4: weighted bet size
   - £0.20 = 72%
   - £0.40 = 20.8%
   - £0.60 = 5%
   - £0.80 = 2%
   - £1.00 = 0.2%

When Wheel 4 completes, it automatically sends the pick to the overlay and logs the session.

You can also click `Send to Overlay` manually.

## Hotkeys

When not typing in a field:

- `E` — show/hide editor on the overlay source
- `↑` — add 1 spin remaining
- `↓` — subtract 1 spin remaining
- `B` — bonus flash
- In wheel tab: `Space` = spin, `Enter` = next wheel

## Shorts overlay

Add a separate OBS scene/source for vertical content:

`http://localhost:8000/overlay-vertical.html`

Set source size to:

- Width: `1080`
- Height: `1920`

It reads the same live state as the main overlay. If used in another browser/app, run `start_server.bat` so the server state API can keep everything matched.

## Important

Use only one clean folder. Do not mix WS3/WS4/v3/v4 files with this v5 folder.

If you open files with `file://`, OBS/Chrome may isolate localStorage. That is why older versions showed different values in dock/wheel/overlay. Running `start_server.bat` fixes that because everything shares `http://localhost:8000`.

18+ | Gamble responsibly | BeGambleAware.org

## Browser not updating OBS?

Make sure all URLs are from the same server and the black `start_server.bat` window is open:

- OBS overlay: `http://localhost:8000/overlay.html`
- OBS dock: `http://localhost:8000/controller.html`
- Chrome wheel/browser: `http://localhost:8000/wheel.html`

Do not use `file:///...` and do not open an older copy from WS3/WS4. The v5.1 server writes the shared overlay state to `state.json`, so Chrome and OBS can finally talk to each other.


## Wheel settings update

- Wheel 1: every available number/letter appears 10 times, shuffled.
- Wheel 2: every available game for the picked letter appears 5 times, shuffled. Games selected in the last 10 sends are blocked so the same game cannot appear again within 10 games.
- Wheel 3 spin odds: 75=25%, 100=40%, 125=20%, 150=10%, 200=5%.
- Wheel 4 bet weights: £0.10 x30, £0.20/£0.25 x60, £0.40 x15, £0.60/£0.50 x10, £0.80/£0.75 x7, £1.00 x3, £2.00 x1.
- Added a Shuffle button on the wheel screen to randomize segment order whenever you want.


## v5.3 wheel fairness update

- Wheel 1 now uses 3 copies of each available number/letter, not 10.
- Wheel 1 blocks the last 10 picked letters/numbers, so the same letter cannot repeat within the next 10 letter picks.
- Wheel 2 now uses 2 copies per game if the picked letter has more than 50 games, or 3 copies per game if it has 50 games or fewer.
- Wheel 2 still blocks the last 10 selected games.
- Wheel 3 is back to one visible slice per spin option, with weighted segment odds: 100=80%, 125=10%, 75=5%, 150=4%, 200=1%.
- Wheel 4 is back to one visible slice per bet option, with weighted segment odds: £0.20/£0.25=60%, £0.10=25%, £0.40=10%, £0.60/£0.50=3%, £0.80/£0.75=1.5%, £1=0.4%, £2=0.1%.
- Shuffle still randomizes segment order on the current wheel.


## v5.4 wheel entertainment / random-board update

- Wheel now uses brighter multi-colour slices with radial gradients.
- During a spin, the result preview updates rapidly as slices pass the pointer.
- Spin animation uses a longer roulette-style fast-to-slow easing.
- Wheel now plays synthesized tick/finish sounds on spin click using browser WebAudio.
- Wheel 1 now has one slice per available letter/number. Picked letters are removed for the current pick cycle. Click Reset Pick to restore all letters.
- Wheel 2 now builds a random board of 25 games for the selected letter. Shuffle creates a brand-new random board. If the letter has fewer than 25 available games, empty slices become Spin Again.
- Manual game picking/search remains available, with “5 subs = You pick next game” shown above the list.
- Wheel 3 odds updated: 100=75%, 75=15%, 125=5%, 150=2.5%, 175=1.25%, 200=0.8%, 250=0.28%, 300=0.1%, 400=0.05%, 500=0.01%.
- Wheel 4 odds updated: £0.20=65%, £0.10=20%, £0.40=10%, £0.60=2.5%, £0.80=1.4%, £1=0.8%, £2=0.3%.


## v5.5 live overlay + spin bar update

- Live Overlay stop rule now includes the loss stop: `Stop on Bonus / +£5 / -£10`.
- `Spin #` is now treated as Session #. It starts at 1 and increases when a new game is sent to overlay.
- The local server resets overlay/session state on every server start, so Session # returns to 1 after reopening the server.
- Removed the +1 spin button from Live Overlay controls. Space decreases spins remaining when you are not inside Wheel Picker or Spin Bar.
- Bonus flash is now a more ember/fire style overlay and attempts to say “Bonus time” with a low voice plus a demonic-style laugh using browser audio.
- Wheel Picker now shows `GIFT 5 SUBS AND PICK NEXT GAME` in neon green, centered, with the live spinning preview underneath.
- Wheel/Spin Bar spins now last 5–8 seconds with a stronger roulette-style slowdown.
- Added a new `Spin Bar` tab: same 4-step pick flow as the wheel, but displayed as a vertical jackpot/bonus-style spinning bar.


## v5.6 bonus overlay + transparent spin sources

- Bonus Flash now broadcasts through the server state. If you press Bonus Flash in the dock, the main OBS overlay browser source also shows the `BONUS TIME` ember/fire text effect.
- The OBS overlay does not need to play sound; the sound remains tied to the interactive page/button press.
- Added `wheel-transparent.html`: transparent 1920x1080 wheel-only overlay source. Use it as a separate OBS Browser Source when you want viewers to see just the wheel. Press E while interacting to hide/show its small controls. Space spins, Enter goes next.
- Added `spinbar-transparent.html`: transparent 1920x1080 spin-bar-only overlay source. Same hotkeys and flow as the wheel-only overlay.
- These two new transparent files are standalone and do not affect the main overlay/controller.


## v5.7 passive transparent overlays + clean defaults

- Main overlay defaults are now blank/waiting until the first game is picked:
  - Game: `Waiting to pick a game...`
  - Wheel Pick: `N/A`
  - Spins, bet, RTP, volatility: `N/A`
  - Session #: `1`
- `start_server.bat` resets both overlay state and spin animation event state every time the server opens.
- Transparent wheel/bar overlays are now passive viewer sources. You do not interact with them directly.
- When you spin the round wheel inside the OBS dock/controller, `wheel-transparent.html` mirrors that spin for viewers.
- When you spin the Spin Bar inside the OBS dock/controller, `spinbar-transparent.html` mirrors that spin for viewers.
- This is done through `spin-event.json` on the local server, so keep `start_server.bat` running.

Passive OBS source URLs:
- `http://localhost:8000/wheel-transparent.html`
- `http://localhost:8000/spinbar-transparent.html`

Both should be added as 1920x1080 Browser Sources above the game capture. Hide/show them in OBS when you want viewers to see the spin.


## v5.8 passive overlay cleanup / exact dock control

- Removed the small top-left `controlled from Dock` label from both transparent sources.
- Removed the duplicate preview above the wheel/bar. The live picked slice/result is now shown underneath the wheel/bar only.
- Transparent Spin Bar now uses the same loop count and target result event sent by the dock, so it mirrors the dock-controlled spin more closely.
- Transparent Wheel now uses the same turn count sent by the dock for closer visual mirroring.
- Keep controlling everything from `controller.html`; the transparent sources are viewer-only display layers.

If OBS still shows an old label, right-click the transparent Browser Source and click Refresh, or clear that source cache.


## v5.9 spin bar final alignment fix

- Fixed `spinbar-transparent.html` so the green selector line and the result text hard-lock to the same final result.
- The transparent spin bar now rebuilds the final visible rows after the animation finishes, forcing the chosen result to sit exactly inside the green selector window.
- If OBS still shows the previous wrong alignment, right-click the `spinbar-transparent.html` Browser Source and click Refresh, or add `?v=59` to the URL.


## v5.10 spin bar no-jump landing fix

- Reworked `spinbar-transparent.html` so the passive stream bar no longer rebuilds/jumps at the end.
- The reel is now built as one continuous strip before the spin starts.
- The animation calculates the exact final pixel position and eases directly into the chosen row.
- The final result is centered in the green selector naturally as part of the slowdown, not swapped in after the spin.
- If OBS still shows old behaviour, refresh the Browser Source or use `http://localhost:8000/spinbar-transparent.html?v=510`.


## v5.11 spin bar row-height alignment fix

- Fixed the real cause of the transparent spin bar mismatch: the transparent bar rows were 1px taller than the JavaScript calculation because of CSS borders. Over many spinning rows, that 1px accumulated and made the green selector land on the wrong visible row.
- Added `box-sizing: border-box` and changed row separators to inset shadows so each row is exactly the calculated height.
- Use `http://localhost:8000/spinbar-transparent.html?v=511` to force OBS to load this fixed file.


## v5.12 reset pick resets overlay and passive sources

- Clicking `Reset Pick` now resets the Live Overlay back to default/waiting values:
  - Game: `Waiting to pick a game...`
  - Wheel Pick: `N/A`
  - Feature, spins, bet, RTP, volatility: `N/A`
  - Session #: `1`
- Reset Pick also sends a reset event to the passive transparent sources.
- `wheel-transparent.html` clears back to `Waiting for dock spin...`.
- `spinbar-transparent.html` clears back to `Waiting for dock spin...`.
- This keeps the dock, main overlay, transparent wheel, and transparent bar all in the same clean reset state.

If OBS does not update immediately, refresh the transparent Browser Sources or use cache-busting URLs:
- `http://localhost:8000/wheel-transparent.html?v=512`
- `http://localhost:8000/spinbar-transparent.html?v=512`


## v5.13 transparent wheel spacing fix

- Shrunk `wheel-transparent.html` wheel from 680px to 560px.
- Moved the transparent wheel group upward so the result/step text no longer touches the bottom HUD.
- Reduced the result/step text size under the wheel.
- Use `http://localhost:8000/wheel-transparent.html?v=513` to force OBS to load the update.


## v5.14 manual pick + stream-source auto hide

- Changed all viewer promo text to `GIFT 3 SUBS AND PICK NEXT GAME`.
- Added a new `Manual Pick` tab in the dock:
  1. Choose letter/number
  2. Choose game from that letter
  3. Type spins and press Enter or Send
  4. Manual bet is always £0.20
- Fixed Wheel Picker manual list:
  - Wheel 1 now shows clickable letters/numbers in the list. Clicking one enables Next.
  - Wheel 2 game list clicks now enable Next, so manual game selection can proceed to spins.
- After a complete pick is sent to overlay, both passive transparent sources receive a `hide` event and disappear completely. This helps prevent accidentally leaving the wheel/bar visible during gameplay.
- `Reset Pick` brings the passive transparent wheel/bar back to waiting state for the next selection.
- Main overlay promo is hidden during selection/reset, and appears only after a game has been sent to overlay.

Recommended cache-busting URLs:
- Main overlay: `http://localhost:8000/overlay.html?v=514`
- Dock: `http://localhost:8000/controller.html?v=514`
- Wheel transparent: `http://localhost:8000/wheel-transparent.html?v=514`
- Spinbar transparent: `http://localhost:8000/spinbar-transparent.html?v=514`


## v5.15 OBS dock compact layout + overlay promo spacing

- Moved the main overlay `GIFT 3 SUBS AND PICK NEXT GAME` text much closer to the game title to remove the large gap.
- Added stronger responsive CSS for OBS docks. The Live Overlay, Wheel Picker, Spin Bar, and Manual Pick tabs now shrink/stack to fit narrow OBS dock columns better.
- Wheel and Spin Bar controls in the dock now scale down for narrow widths instead of forcing you to make the dock huge.
- Added optional `dock_controller.html`, a minimal full-window compact dock wrapper with no launcher/header space.

Recommended dock URLs:
- Normal dock: `http://localhost:8000/controller.html?v=515`
- Compact dock: `http://localhost:8000/dock_controller.html?v=515`

If your OBS dock still looks wide/cached, close and reopen the custom browser dock with the `?v=515` URL.


## v5.16 dock layout + spinbar result fix

- Fixed compact CSS being applied too aggressively to the normal browser controller. Normal `controller.html` now keeps the wider layout when opened in a normal browser.
- Compact scaling is now only applied when using `dock_controller.html` / `overlay.html?...&compact=1`.
- Fixed dock Spin Bar result mismatch caused by compact CSS changing row height while JavaScript still used the old row height. The dock Spin Bar now measures the real row height and selector offset dynamically before every spin.
- This should stop blank/incorrect results on letter/game/spins/bet picks inside the compact dock.

Recommended URLs:
- OBS compact dock: `http://localhost:8000/dock_controller.html?v=516`
- Full browser controller: `http://localhost:8000/controller.html?v=516`
- Main overlay: `http://localhost:8000/overlay.html?v=516`


## v5.17 compact scroll + wheel picker fixes

- Wheel Picker `Reroll` button is now `Reset Pick` and runs the full reset.
- Compact dock pages now allow vertical scrolling and have extra bottom padding, so the bottom controls/help text are reachable.
- Compact dock styling is only active through `dock_controller.html` / `compact=1`, not the full browser controller.
- Wheel 2 game names are now drawn along the slice direction with shorter labels, instead of being written across multiple slices.
- Banned/recent games are cleared on page load and also when Reset Pick is clicked.
- Spin Bar in the dock continues to use dynamic row-height alignment from v5.16.

Recommended URLs:
- Compact OBS dock: `http://localhost:8000/dock_controller.html?v=517`
- Normal browser controller: `http://localhost:8000/controller.html?v=517`
- Main overlay: `http://localhost:8000/overlay.html?v=517`
- Transparent wheel: `http://localhost:8000/wheel-transparent.html?v=517`
- Transparent spinbar: `http://localhost:8000/spinbar-transparent.html?v=517`


## v5.18 wheel game-name slice text readability

- Improved Wheel 2 game-name text on both the dock wheel and `wheel-transparent.html`.
- Game names are now drawn along the radial direction of each slice, like writing along a fortune-cookie strip, instead of being small text across the slice edge.
- Increased Wheel 2 font size and allowed the label to use more of the slice width.
- Long game names are shortened less aggressively and scaled with canvas `maxWidth` so they stay inside the slice better.

Use cache-busting URLs:
- Compact dock: `http://localhost:8000/dock_controller.html?v=518`
- Full controller: `http://localhost:8000/controller.html?v=518`
- Transparent wheel: `http://localhost:8000/wheel-transparent.html?v=518`


## v5.19 Wheel 2 full-slice readable labels

- Wheel 2 game names now start further inside the slice instead of being centered and cropped.
- Game labels are drawn outward along the slice with a larger font.
- Names longer than 25 characters are shortened by whole words, then `...` is added.
  - Example: `Good Features Within Cashy` becomes `Good Features Within...`
  - Example: `Good Feature Within Cash Except When Not` becomes `Good Feature Within Cash...`
- Applied to both dock/main wheel and `wheel-transparent.html`.

Use cache-busting URLs:
- Compact dock: `http://localhost:8000/dock_controller.html?v=519`
- Full controller: `http://localhost:8000/controller.html?v=519`
- Transparent wheel: `http://localhost:8000/wheel-transparent.html?v=519`


## v5.20 Wheel 2 label direction fix

- Wheel 2 game labels now all face the same radial direction.
- Removed the automatic text flip on the left side of the wheel, so labels no longer alternate direction.
- Applied to both the dock/main wheel and `wheel-transparent.html`.

Use cache-busting URLs:
- Compact dock: `http://localhost:8000/dock_controller.html?v=520`
- Full controller: `http://localhost:8000/controller.html?v=520`
- Transparent wheel: `http://localhost:8000/wheel-transparent.html?v=520`


## v5.21 localhost vertical overlay

- Updated `overlay-vertical.html` for localhost/server use.
- URL: `http://localhost:8000/overlay-vertical.html?v=521`
- Size: 1080 x 1920.
- It polls `state.json`, so it follows the same game/spins/bet/RTP/vol/session state as the main overlay.
- It supports the waiting defaults, `GIFT 3 SUBS AND PICK NEXT GAME` promo after a pick is sent, and the visual `BONUS TIME` effect.
- Add it as a separate OBS Browser Source for Shorts/TikTok/vertical recording scenes.


## v5.22 bonus-hunt / no Gift Subs version

- Removed/hid all `GIFT 3 SUBS AND PICK NEXT GAME` promo text from:
  - main horizontal overlay
  - vertical overlay
  - transparent wheel overlay
  - transparent spinbar overlay
  - dock wheel/spinbar/manual sections
- This version is cleaner for bonus-hunt / free-spins opening sessions where viewers are not picking the next game.

Recommended cache-busting URLs:
- Main overlay: `http://localhost:8000/overlay.html?v=522`
- Vertical overlay: `http://localhost:8000/overlay-vertical.html?v=522`
- Compact dock: `http://localhost:8000/dock_controller.html?v=522`
- Full controller: `http://localhost:8000/controller.html?v=522`
- Transparent wheel: `http://localhost:8000/wheel-transparent.html?v=522`
- Transparent spinbar: `http://localhost:8000/spinbar-transparent.html?v=522`
