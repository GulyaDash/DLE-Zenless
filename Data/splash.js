let splashMode = null;
const splashMaxAttempts = 20;
const splashStatsKey = "splashStats";
let splashStats = null;

function isSplashSaveValid(save) {
    if (!save || !Number.isSafeInteger(save.savedDay) || !isPixelAnswersValid(save.usedAnswers) ||
        save.usedAnswers.length > splashMaxAttempts ||
        !agents.some(function(agent) { return agent.name === save.answerName && agent.splashImage; })) return false;
    const winIndex = save.usedAnswers.indexOf(save.answerName);
    return winIndex < 0 || winIndex === save.usedAnswers.length - 1;
}

function getSplashSave() {
    return { savedDay: dayNumber, answerName: splashMode.answer.name, usedAnswers: splashMode.answers.slice(), stats: splashStats };
}

function initializeSplashMode() {
    const available = agents.filter(function(agent) { return agent.splashImage; });
    if (!available.length) return;
    const seed = Math.abs(Math.sin(dayNumber + 808) * 10000);
    splashMode = {
        answer: available[Math.floor((seed % 1) * available.length)],
        answers: [], solved: false, finished: false, ready: false,
        feedback: "", imageStatus: "pixelImageLoading",
        storageKey: "splashAnswers-" + dayNumber,
        image: new Image(),
        canvas: document.querySelector("#splashCanvas"),
        input: document.querySelector("#splashAnswerInput"),
        suggestions: document.querySelector("#splashAgentSuggestions"),
        timer: document.querySelector("#splashDailyTimer")
    };
    const mode = splashMode;
    splashStats = loadSplashStatistics();
    try {
        const saved = parseAgentSave(localStorage.getItem(mode.storageKey) || "null");
        if (saved !== null) {
            if (!isSplashSaveValid(saved) || saved.savedDay !== dayNumber) throw new Error("Invalid Splash save");
            mode.answer = available.find(function(agent) { return agent.name === saved.answerName; });
            mode.answers = saved.usedAnswers;
        }
    } catch (error) { console.warn("Cannot restore Splash progress:", error); }

    recordSplashResult();
    mode.answers.forEach(function(name) { addSplashAttempt(agents.find(function(agent) { return agent.name === name; })); });
    ["click", "input"].forEach(function(eventName) {
        mode.input.addEventListener(eventName, function() {
            if (mode.input.disabled) return;
            showCharacterSuggestions(mode.input, mode.suggestions, mode.answers, checkSplashAnswer, available, "image");
        });
    });
    mode.input.addEventListener("keydown", function(event) {
        handleSuggestionKeydown(event, mode.suggestions, checkSplashAnswer);
    });
    document.querySelector("#splashShareButton").addEventListener("click", shareSplashResult);
    mode.image.addEventListener("load", function() {
        mode.ready = true;
        mode.imageStatus = "";
        // Размер области повторяет пропорции исходника, включая вертикальные арты.
        const scale = Math.min(1, 1400 / mode.image.naturalWidth, 1000 / mode.image.naturalHeight);
        mode.canvas.width = Math.round(mode.image.naturalWidth * scale);
        mode.canvas.height = Math.round(mode.image.naturalHeight * scale);
        document.querySelector(".splash-image-frame").style.aspectRatio = mode.canvas.width + " / " + mode.canvas.height;
        document.querySelector(".splash-image-frame").style.setProperty("--splash-ratio", mode.canvas.width / mode.canvas.height);
        renderSplashMode();
    });
    mode.image.addEventListener("error", function() {
        mode.ready = false;
        mode.imageStatus = "pixelImageUnavailable";
        renderSplashMode();
    });
    renderSplashMode();
    mode.image.src = mode.answer.splashImage;
}

function getSplashCrop() {
    const mode = splashMode;
    const wrong = mode.answers.filter(function(name) { return name !== mode.answer.name; }).length;
    const fraction = mode.solved ? 1 : 0.12 + 0.88 * Math.min(wrong, splashMaxAttempts) / splashMaxAttempts;
    const width = mode.image.naturalWidth * fraction;
    const height = mode.image.naturalHeight * fraction;
    // Одинаковый фрагмент у всех игроков дня; при расширении прежняя область остаётся видна.
    const anchorX = 0.35 + 0.3 * (Math.abs(Math.sin(dayNumber + 909) * 10000) % 1);
    const anchorY = 0.35 + 0.3 * (Math.abs(Math.sin(dayNumber + 1010) * 10000) % 1);
    return { x: (mode.image.naturalWidth - width) * anchorX,
        y: (mode.image.naturalHeight - height) * anchorY, width, height };
}

function drawSplashArt() {
    const mode = splashMode;
    if (!mode || !mode.ready) return;
    const crop = getSplashCrop();
    const context = mode.canvas.getContext("2d");
    context.clearRect(0, 0, mode.canvas.width, mode.canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(mode.image, crop.x, crop.y, crop.width, crop.height,
        0, 0, mode.canvas.width, mode.canvas.height);
}

function renderSplashMode() {
    const mode = splashMode;
    if (!mode) return;
    mode.solved = mode.answers.includes(mode.answer.name);
    mode.finished = mode.solved || mode.answers.length >= splashMaxAttempts;
    const expired = Date.now() >= nextDailyResetTime;
    mode.input.disabled = !mode.ready || mode.finished || expired;
    const key = mode.finished ? (mode.solved ? "" : "splashLost") : expired ? "pixelNewDay" : mode.feedback;
    const feedback = document.querySelector("#splashFeedback");
    feedback.hidden = !key;
    feedback.textContent = key ? getTranslation(key) : "";
    const status = document.querySelector("#splashImageStatus");
    status.hidden = !mode.imageStatus;
    status.textContent = mode.imageStatus ? getTranslation(mode.imageStatus) : "";
    document.querySelector("#splashShareButton").hidden = !mode.finished;
    if (mode.solved && mode.timer.hidden) showDailyResetTimer(mode.timer);
    else mode.timer.hidden = !mode.solved;
    if (mode.input.disabled) mode.suggestions.textContent = "";
    if (!document.querySelector("#splashShareText").hidden && mode.finished) {
        document.querySelector("#splashShareText").value = buildSplashShareText();
    }
    drawSplashArt();
}

function checkSplashAnswer() {
    const mode = splashMode;
    if (Date.now() >= nextDailyResetTime) { updateDailyResetTimer(); return; }
    if (mode.input.disabled || mode.finished) return;
    const answer = mode.input.value.trim().toLowerCase();
    mode.suggestions.textContent = "";
    selectedSuggestionIndex = -1;
    if (!answer) return;
    const agent = agents.find(function(candidate) { return candidate.splashImage && candidate.name.toLowerCase() === answer; });
    if (!agent || mode.answers.includes(agent.name)) {
        mode.feedback = agent ? "pixelAlreadyTried" : "pixelUnknownAgent";
        renderSplashMode();
        return;
    }
    mode.answers.push(agent.name);
    localStorage.setItem(mode.storageKey, JSON.stringify(getSplashSave()));
    recordSplashResult();
    mode.feedback = "";
    mode.input.value = "";
    addSplashAttempt(agent);
    renderSplashMode();
    if (!mode.finished) mode.input.focus();
}

function addSplashAttempt(agent) {
    const row = document.createElement("div");
    row.className = "pixel-attempt" + (agent.name === splashMode.answer.name ? " pixel-attempt-correct" : "");
    const icon = document.createElement("img");
    icon.src = agent.image;
    icon.alt = "";
    const name = document.createElement("span");
    name.textContent = agent.name;
    row.append(icon, name);
    document.querySelector("#splashAttempts").prepend(row);
}

function buildSplashShareText() {
    const mode = splashMode;
    const result = mode.solved ? String(mode.answers.length) : "X";
    const date = new Date(dayNumber * millisecondsInDay).toISOString().slice(0, 10);
    const squares = mode.answers.map(function(name) { return name === mode.answer.name ? "🟩" : "🟥"; });
    const rows = [];
    for (let i = 0; i < squares.length; i += 10) rows.push(squares.slice(i, i + 10).join(""));
    return ["#DLEZenless · " + getTranslation("navigationSplash") + " · " + result + "/" + splashMaxAttempts, date, "", ...rows].join("\n");
}

async function shareSplashResult() {
    if (!splashMode.finished) return;
    await copyGameResult(buildSplashShareText(), document.querySelector("#splashShareFeedback"),
        document.querySelector("#splashShareStatus"), document.querySelector("#splashShareText"));
}

function isSplashStatisticsValid(value) {
    return value && ["completedGames", "wins", "totalAttempts", "currentStreak", "bestStreak"]
        .every(function(key) { return Number.isSafeInteger(value[key]) && value[key] >= 0; }) &&
        (value.lastCompletedDay === null || Number.isSafeInteger(value.lastCompletedDay)) &&
        value.wins <= value.completedGames && value.totalAttempts >= value.completedGames &&
        value.totalAttempts <= value.completedGames * splashMaxAttempts &&
        value.currentStreak <= value.bestStreak && value.bestStreak <= value.wins &&
        (value.completedGames === 0 ? value.lastCompletedDay === null : value.lastCompletedDay !== null);
}

function addSplashResult(target, save) {
    const won = save.usedAnswers.includes(save.answerName);
    if (!won && save.usedAnswers.length < splashMaxAttempts) return;
    if (target.lastCompletedDay !== null && target.lastCompletedDay >= save.savedDay) return;
    target.completedGames++;
    target.totalAttempts += save.usedAnswers.length;
    if (won) target.wins++;
    target.currentStreak = won ? (target.lastCompletedDay === save.savedDay - 1 ? target.currentStreak + 1 : 1) : 0;
    target.bestStreak = Math.max(target.bestStreak, target.currentStreak);
    target.lastCompletedDay = save.savedDay;
}

function loadSplashStatistics() {
    let result;
    try {
        const saved = JSON.parse(localStorage.getItem(splashStatsKey));
        if (isSplashStatisticsValid(saved)) result = saved;
    } catch { /* При повреждении статистики восстанавливаем её из истории. */ }
    if (!result) {
        result = { completedGames: 0, wins: 0, totalAttempts: 0, currentStreak: 0, bestStreak: 0, lastCompletedDay: null };
        Object.keys(localStorage).filter(function(key) { return /^splashAnswers-\d+$/.test(key); })
            .map(function(key) { return Number(key.slice("splashAnswers-".length)); })
            .filter(function(day) { return Number.isSafeInteger(day) && day <= dayNumber; })
            .sort(function(a, b) { return a - b; }).forEach(function(day) {
                try {
                    const saved = parseAgentSave(localStorage.getItem("splashAnswers-" + day));
                    if (isSplashSaveValid(saved) && saved.savedDay === day) addSplashResult(result, saved);
                } catch { /* Пропускаем только повреждённую запись. */ }
            });
    }
    if (result.lastCompletedDay !== null && result.lastCompletedDay < dayNumber - 1) result.currentStreak = 0;
    localStorage.setItem(splashStatsKey, JSON.stringify(result));
    return result;
}

function recordSplashResult() {
    if (splashMode.answers.includes(splashMode.answer.name)) {
        reportAllDleWin("splash", splashMode.answers.length, splashMaxAttempts);
    }
    addSplashResult(splashStats, getSplashSave());
    localStorage.setItem(splashStatsKey, JSON.stringify(splashStats));
}

function updateSplashStatWindow() {
    const values = {
        splashStatsGames: splashStats.completedGames,
        splashStatsWins: splashStats.wins,
        splashStatsLosses: splashStats.completedGames - splashStats.wins,
        splashStatsAttempts: splashStats.totalAttempts,
        splashStatsAverage: splashStats.completedGames ? (splashStats.totalAttempts / splashStats.completedGames).toFixed(1) : "0",
        splashStatsCurrentStreak: splashStats.currentStreak,
        splashStatsBestStreak: splashStats.bestStreak
    };
    Object.entries(values).forEach(function(entry) { document.getElementById(entry[0]).textContent = entry[1]; });
}
