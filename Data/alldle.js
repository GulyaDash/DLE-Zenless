// Official SDK: https://www.alldle.net/sdk (vendored version 0.1.1).
const alldleResults = (() => {
    const modes = new Set(["classic", "bangboo", "pixel", "splash"]);
    const submitted = new Set();
    let client = null;
    let connection = Promise.resolve(null);
    try {
        if (window.self !== window.top && window.AllDleSDK?.AllDle) {
            client = new window.AllDleSDK.AllDle({ gameSlug: "dle-zenless", connectTimeout: 60000 });
            connection = client.connect().catch(() => null);
        }
    } catch { /* AllDle must never interrupt the game. */ }

    async function win(mode, attempts, puzzleDay, maxAttempts) {
        const today = () => Math.floor(Date.now() / 86400000);
        if (!client || !modes.has(mode) || puzzleDay !== today() ||
            !Number.isSafeInteger(attempts) || attempts < 1) return;
        const key = mode + ":" + puzzleDay;
        if (submitted.has(key)) return;
        submitted.add(key);
        try {
            const session = await connection;
            if (!session || puzzleDay !== today()) {
                submitted.delete(key);
                return;
            }
            const result = { won: true, attempts, puzzleId: String(puzzleDay) };
            if (maxAttempts !== undefined) result.maxAttempts = maxAttempts;
            await client.completeMode(mode, result);
            // SDK swallows transport errors: do not persist a local success flag.
            // Reloading reports restored wins again; AllDle owns daily completion.
        } catch {
            submitted.delete(key);
        }
    }
    return { win };
})();

function reportAllDleWin(mode, attempts, maxAttempts) {
    if (devDayOffset !== 0) return;
    void alldleResults.win(mode, attempts, dayNumber, maxAttempts);
}
