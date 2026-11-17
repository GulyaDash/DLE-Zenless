const locationPanel = document.querySelector('[data-panel="location"]');
const locationInput = locationPanel.querySelector("input");
const locationSuggestions = locationPanel.querySelector(".suggestions");
const locationCanvas = locationPanel.querySelector("canvas");
const locationFrame = locationCanvas.parentElement;
const locationImage = new Image();
const locationMaxAttempts = 20;
const locationStorageKey = "locationAnswers-" + dayNumber;
const locationSeed = Math.abs(Math.sin(dayNumber + 1703) * 10000) % 1;
const dailyLocation = locationCatalog[Math.floor(locationSeed * locationCatalog.length)];
const dailyLocationImage = dailyLocation.images[Math.floor(
    (Math.abs(Math.sin(dayNumber + 1709) * 10000) % 1) * dailyLocation.images.length
)];
let locationAnswers = [];
let locationImageStatus = "pixelImageLoading";
let locationFeedback = "";

try {
    const saved = JSON.parse(localStorage.getItem(locationStorageKey));
    if (saved?.image === dailyLocationImage && Array.isArray(saved.answers) &&
        saved.answers.length <= locationMaxAttempts &&
        saved.answers.every(name => locationCatalog.some(place => place.en === name))) {
        locationAnswers = saved.answers;
    }
} catch (error) {
    console.warn("Cannot restore location progress:", error);
}

function locationName(place) {
    return document.documentElement.lang === "ru" ? place.ru : place.en;
}

function normalizeLocationName(name) {
    return name.toLowerCase().replaceAll("ё", "е")
        .replace(/^\[(?:hollow|каверна)\]\s*/u, "")
        .replace(/[^\p{L}\p{N}]/gu, "");
}

function renderLocationMode() {
    const won = locationAnswers.includes(dailyLocation.en);
    const finished = won || locationAnswers.length >= locationMaxAttempts;
    const expired = Date.now() >= nextDailyResetTime;
    locationInput.disabled = Boolean(locationImageStatus) || finished || expired;
    locationSuggestions.replaceChildren();
    selectedSuggestionIndex = -1;
    const status = locationPanel.querySelector("[data-location-status]");
    status.textContent = locationImageStatus ? getTranslation(locationImageStatus) : "";
    status.hidden = !locationImageStatus;
    const feedback = locationPanel.querySelector("[data-location-feedback]");
    const key = won ? "" : finished ? "locationLost" : expired ? "pixelNewDay" : locationFeedback;
    feedback.textContent = key ? getTranslation(key).replace("{location}", locationName(dailyLocation)) : "";
    feedback.hidden = !key;
    locationPanel.querySelector("#locationShareButton").hidden = !won;
    locationPanel.querySelector("[data-location-timer]").hidden = !won;
    locationPanel.querySelector("[data-location-reload]").hidden = !expired;
    const attempts = locationPanel.querySelector("[data-location-attempts]");
    attempts.replaceChildren(...locationAnswers.slice().reverse().map(name => {
        const row = document.createElement("div");
        row.className = "pixel-attempt" + (name === dailyLocation.en ? " pixel-attempt-correct" : "");
        row.textContent = locationName(locationCatalog.find(place => place.en === name));
        return row;
    }));
    if (locationImageStatus) return;
    const fraction = finished ? 1 : 0.12 + 0.88 * locationAnswers.length / locationMaxAttempts;
    const width = locationImage.naturalWidth * fraction;
    const height = locationImage.naturalHeight * fraction;
    const context = locationCanvas.getContext("2d");
    context.drawImage(locationImage, (locationImage.naturalWidth - width) * locationSeed,
        (locationImage.naturalHeight - height) * (1 - locationSeed), width, height,
        0, 0, locationCanvas.width, locationCanvas.height);
}

function submitLocationAnswer() {
    if (Date.now() >= nextDailyResetTime) {
        renderLocationMode();
        return;
    }
    if (locationInput.disabled) return;
    const query = normalizeLocationName(locationInput.value);
    if (!query) return;
    const place = locationCatalog.find(candidate =>
        [candidate.en, candidate.ru].some(name => normalizeLocationName(name) === query));
    if (!place || locationAnswers.includes(place.en)) {
        locationFeedback = place ? "pixelAlreadyTried" : "locationUnknown";
        renderLocationMode();
        return;
    }
    locationAnswers.push(place.en);
    localStorage.setItem(locationStorageKey, JSON.stringify({ image: dailyLocationImage, answers: locationAnswers }));
    if (place === dailyLocation) {
        reportAllDleWin("locations", locationAnswers.length, locationMaxAttempts);
    }
    locationFeedback = "";
    locationInput.value = "";
    renderLocationMode();
}

function showLocationSuggestions() {
    locationSuggestions.replaceChildren();
    selectedSuggestionIndex = -1;
    const query = normalizeLocationName(locationInput.value);
    const matches = locationCatalog.filter(place => !locationAnswers.includes(place.en) &&
        [place.en, place.ru].some(name => normalizeLocationName(name).includes(query)));
    for (const place of matches) {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "suggestion-item";
        option.textContent = locationName(place);
        option.addEventListener("click", function() {
            locationInput.value = locationName(place);
            submitLocationAnswer();
            if (!locationInput.disabled) locationInput.focus();
        });
        locationSuggestions.append(option);
    }
}

locationInput.addEventListener("click", showLocationSuggestions);
locationPanel.querySelector("#locationShareButton").addEventListener("click", function() {
    const date = new Date(dayNumber * millisecondsInDay).toISOString().slice(0, 10);
    const squares = locationAnswers.map(name => name === dailyLocation.en ? "🟩" : "🟥");
    const rows = [];
    for (let i = 0; i < squares.length; i += 10) rows.push(squares.slice(i, i + 10).join(""));
    const title = "#DLEZenless · " + getTranslation("navigationLocation");
    const text = [title + " · " + locationAnswers.length + "/" + locationMaxAttempts, date, "", ...rows].join("\n");
    copyGameResult(text, locationPanel.querySelector("#locationShareFeedback"),
        locationPanel.querySelector("#locationShareStatus"), locationPanel.querySelector("#locationShareText"));
});
locationInput.addEventListener("input", showLocationSuggestions);
locationInput.addEventListener("keydown", event =>
    handleSuggestionKeydown(event, locationSuggestions, submitLocationAnswer));
locationImage.addEventListener("load", function() {
    const scale = Math.min(1, 1400 / locationImage.naturalWidth, 1000 / locationImage.naturalHeight);
    locationCanvas.width = Math.round(locationImage.naturalWidth * scale);
    locationCanvas.height = Math.round(locationImage.naturalHeight * scale);
    locationFrame.style.aspectRatio = locationCanvas.width + " / " + locationCanvas.height;
    locationFrame.style.setProperty("--splash-ratio", locationCanvas.width / locationCanvas.height);
    locationImageStatus = "";
    renderLocationMode();
});
locationImage.addEventListener("error", function() {
    locationImageStatus = "pixelImageUnavailable";
    renderLocationMode();
});
function openLocationMode() {
    if (!locationImage.hasAttribute("src")) locationImage.src = locationArtRoot + dailyLocationImage;
    renderLocationMode();
}

function updateLocationStatWindow() {
    let wins = 0;
    let losses = 0;
    let attempts = 0;
    for (const key of Object.keys(localStorage)) {
        if (!/^locationAnswers--?\d+$/.test(key)) continue;
        let saved;
        try {
            saved = JSON.parse(localStorage.getItem(key));
        } catch {
            continue;
        }
        const place = locationCatalog.find(candidate => candidate.images.includes(saved?.image));
        const answers = saved?.answers;
        if (!place || !Array.isArray(answers) || answers.length > locationMaxAttempts ||
            new Set(answers).size !== answers.length ||
            !answers.every(name => locationCatalog.some(candidate => candidate.en === name))) continue;
        if (answers.at(-1) === place.en) wins++;
        else if (answers.length === locationMaxAttempts && !answers.includes(place.en)) losses++;
        else continue;
        attempts += answers.length;
    }
    const games = wins + losses;
    const average = games ? (attempts / games).toLocaleString(document.documentElement.lang, {
        maximumFractionDigits: 2
    }) : 0;
    const totals = { games, wins, losses, attempts, average };
    for (const field of document.querySelectorAll("[data-location-stat]")) {
        field.textContent = totals[field.dataset.locationStat];
    }
}

if (locationAnswers.at(-1) === dailyLocation.en) {
    reportAllDleWin("locations", locationAnswers.length, locationMaxAttempts);
}
renderLocationMode();
