# AllDle

Integration uses the official, unmodified SDK 0.1.1 from
https://www.alldle.net/sdk/0.1.1/sdk.js (stored in Data/vendor).
Documentation: https://www.alldle.net/sdk
Game page: https://www.alldle.net/game/dle-zenless

Daily wins are reported as classic, bangboo, pixel and splash.
Endless, losses, developer day offsets and expired puzzles are excluded.
The payload contains won, attempts and puzzleId (UTC epoch day).
Splash additionally sends maxAttempts: 20.

The adapter starts before game initialization and waits for an AllDle
iframe session. Saved wins for the current day are reported on reload.
Repeated calls are suppressed within the page. The SDK does not expose
transport success, so no permanent local "uploaded" flag is stored.
If a delivery fails, reopening the game retries saved daily wins.
Standalone play needs no AllDle connection and continues normally.

Publish index.html, Data/alldle.js, Data/vendor/alldle-sdk-0.1.1.js,
Data/function.js and Data/splash.js together to GitHub Pages.
The existing alldle-verify meta tag contains a placeholder; if ownership
verification is required, replace its value with the token from your
AllDle creator dashboard. This is separate from reporting game results.

Validation:
- node tests/alldle.test.cjs (official SDK, simulated parent)
- node tests/alldle-browser.test.cjs (Playwright, local iframe)
- node tests/pixel.test.cjs
- node tests/splash.test.cjs

Tests never send completions to the real AllDle service. Actual credit
must be checked from the published game opened inside AllDle.
