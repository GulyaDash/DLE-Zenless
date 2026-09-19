


// 1. Найти кнопку
const answerInput = document.querySelector("#answerInput");
const attempts = document.querySelector("#attempts");

const modeTabs = document.querySelectorAll(".mode-tab");
const modePanels = document.querySelectorAll(".mode-panel");
const categoryTabs = document.querySelectorAll(".category-tab");
const modeTabsContainer = document.querySelector(".mode-tabs");

const agentSuggestions = document.querySelector("#agentSuggestions");
//const correctAnswer = agents[0];

const devDayOffset = Number(localStorage.getItem("devDayOffset") || 0);

const millisecondsInDay = 1000 * 60 * 60 * 24;

const nextDailyResetTime = (Math.floor(Date.now() / millisecondsInDay) + 1) * millisecondsInDay;



const dayNumber = Math.floor(Date.now() / millisecondsInDay) + devDayOffset;

const dailySeed = Math.abs(Math.sin(dayNumber) * 10000);
const dailyIndex = Math.floor((dailySeed % 1) * agents.length);


const correctAnswer = agents[dailyIndex];

const statsButton = document.querySelector("#statsButton");
const statsDialog = document.querySelector("#statsDialog");
const closeStatsButton = document.querySelector("#closeStatsButton");

const rulesButton = document.querySelector("#rulesButton");
const rulesDialog = document.querySelector("#rulesDialog");
const closeRulesButton = document.querySelector("#closeRulesButton");

const languageButton = document.querySelector("#languageButton");

const statsGames = document.querySelector("#statsGames");
const statsAttempts = document.querySelector("#statsAttempts");
const statsAverage = document.querySelector("#statsAverage");
const statsCurrentStreak = document.querySelector("#statsCurrentStreak");
const statsBestStreak = document.querySelector("#statsBestStreak");

const bangbooStatsGames = document.querySelector("#bangbooStatsGames");
const bangbooStatsAttempts = document.querySelector("#bangbooStatsAttempts");
const bangbooStatsAverage = document.querySelector("#bangbooStatsAverage");
const bangbooStatsCurrentStreak = document.querySelector("#bangbooStatsCurrentStreak");
const bangbooStatsBestStreak = document.querySelector("#bangbooStatsBestStreak");

const resetStatsButton = document.querySelector("#resetStatsButton");

const saveCodeField = document.querySelector("#saveCodeField");
const createSaveCodeButton = document.querySelector("#createSaveCodeButton");
const loadSaveCodeButton = document.querySelector("#loadSaveCodeButton");

const endlessResultCard = document.querySelector("#endlessResultCard");
const endlessResultPortrait = document.querySelector("#endlessResultPortrait");
const endlessResultMessage = document.querySelector("#endlessResultMessage");
const endlessResultName = document.querySelector("#endlessResultName");
const endlessNextButton = document.querySelector("#endlessNextButton");

const classicResultCard = document.querySelector("#classicResultCard");
const classicResultPortrait = document.querySelector("#classicResultPortrait");
const classicResultName = document.querySelector("#classicResultName");
const classicResultTriesCount = document.querySelector("#classicResultTriesCount");

const classicShareButton = document.querySelector("#classicShareButton");
const classicShareFeedback = document.querySelector("#classicShareFeedback");
const classicShareStatus = document.querySelector("#classicShareStatus");
const classicShareText = document.querySelector("#classicShareText");
 
const bangbooShareControls = document.querySelector("#bangbooShareControls");
const bangbooShareButton = document.querySelector("#bangbooShareButton");
const bangbooShareFeedback = document.querySelector("#bangbooShareFeedback");
const bangbooShareStatus = document.querySelector("#bangbooShareStatus");
const bangbooShareText = document.querySelector("#bangbooShareText");


//_____________________Переменык для Endless
const endlessAnswerInput = document.querySelector("#endlessAnswerInput");
const endlessAgentSuggestions = document.querySelector("#endlessAgentSuggestions");
const endlessAttempts = document.querySelector("#endlessAttempts");
const endlessAttemptSquares = document.querySelectorAll(".endless-attempt-square");
const endlessScoreElement = document.querySelector("#endlessScore");

//_____________________Переменык для Банбу
const bangbooPortrait = document.querySelector("#bangbooPortrait");
const bangbooMaskedName = document.querySelector("#bangbooMaskedName");
const bangbooAnswerInput = document.querySelector("#bangbooAnswerInput");
const bangbooSuggestions = document.querySelector("#bangbooSuggestions");
const bangbooHints = document.querySelectorAll(".bangboo-hint");
const bangbooAttempts = document.querySelector("#bangbooAttempts");

//_____________________Рандомайзер для Банбу
const bangbooDailySeed = Math.abs(Math.sin(dayNumber + 101) * 10000);
const bangbooDailyIndex = Math.floor((bangbooDailySeed % 1) * bangboos.length);
const correctBangboo = bangboos[bangbooDailyIndex];

//_____________________Рандомайзер для подсказок Банбу
const bangbooOrderSeed = Math.abs(Math.sin(dayNumber + 202) * 10000);
const swapRankAndElement = bangbooOrderSeed % 1 >= 0.5;
const bangbooHintOrder = swapRankAndElement ? ["rank", "element", "eyes", "emoji"] : ["element", "rank", "eyes", "emoji"];

const classicDailyTimer = document.querySelector("#classicDailyTimer");
const bangbooDailyTimer = document.querySelector("#bangbooDailyTimer");
const dailyResetTimeElements = document.querySelectorAll(".daily-reset-time");
const dailyResetReloadButtons = document.querySelectorAll(".daily-reset-reload");


let dailyResetTimerId = null;

//_____________________попытки Bangboo
const bangbooStorageKey = "bangbooAnswers-" + dayNumber;

const savedBangbooAnswers = localStorage.getItem(bangbooStorageKey);

let bangbooUsedAnswers = savedBangbooAnswers ? JSON.parse(savedBangbooAnswers): [];

bangbooAnswerInput.addEventListener(
  "click",
  function() {
    showCharacterSuggestions(bangbooAnswerInput,bangbooSuggestions,bangbooUsedAnswers,checkBangbooAnswer,bangboos,"icon");
  }
);

bangbooAnswerInput.addEventListener(
  "input",
  function() {
	  showCharacterSuggestions(bangbooAnswerInput,bangbooSuggestions,bangbooUsedAnswers,checkBangbooAnswer,bangboos,"icon");
  }
);

bangbooAnswerInput.addEventListener("keydown",function(event) {
	  handleSuggestionKeydown(event,bangbooSuggestions,checkBangbooAnswer);
  }
);



let bangbooRevealedHints = 1;





//const usedAnswer = [];




const endlessMaxAttempts = 5;

let endlessCorrectAnswer = null;
let endlessUsedAnswers = [];

endlessNextButton.addEventListener("click", function() {
    if (endlessResultCard.hidden) {
        return;
    }

    startEndlessRound();
    endlessAnswerInput.focus();
});

const endlessScoreKey = "endlessScore";
const endlessRoundKey = "endlessRound";

let endlessScore = Number(localStorage.getItem(endlessScoreKey) || 0);

endlessScoreElement.textContent = endlessScore;


const storageKey = "usedAnswers-" + dayNumber;
const savedAnswers = localStorage.getItem(storageKey);


const usedAnswer = savedAnswers ? JSON.parse(savedAnswers): [];
 
 let selectedSuggestionIndex = -1;
 
 

const statsKey = "gameStats";
const savedStats = localStorage.getItem(statsKey);

const stats = savedStats ? JSON.parse(savedStats):{
	completedGames: 0,
    totalAttempts: 0,
    currentStreak: 0,     
	bestStreak: 0,
    lastCompletedDay: null
}

if (stats.lastCompletedDay !== null && stats.lastCompletedDay < dayNumber - 1) {
  stats.currentStreak = 0;

  localStorage.setItem(statsKey,JSON.stringify(stats));
  
}

const bangbooStatsKey = "bangbooStats";

const savedBangbooStats = localStorage.getItem(bangbooStatsKey);

const bangbooStats = savedBangbooStats ? JSON.parse(savedBangbooStats): {
	completedGames: 0,
	totalAttempts: 0,
	currentStreak: 0,
	bestStreak: 0,
	lastCompletedDay: null
};

if (bangbooStats.lastCompletedDay !== null && bangbooStats.lastCompletedDay < dayNumber - 1) {
	bangbooStats.currentStreak = 0;
	localStorage.setItem(bangbooStatsKey,JSON.stringify(bangbooStats));
}

initializeBangbooMode();
restoreBangbooProgress();

// Фунуции



usedAnswer.forEach(function(answerName) {
	const savedAgent = agents.find(function(agent){
		return agent.name === answerName;
	});
	
	if (savedAgent){
		addAttemptRow(savedAgent, correctAnswer, attempts);
		
	}
	
	
});
// 2. Следить за нажатием

const isGameFinished = usedAnswer.includes(correctAnswer.name);

 
if (isGameFinished){
	showClassicResult();
}

loadEndlessRound();

function checkClassicAnswer() {	

	if (answerInput.disabled) {
		return;
	}
	
	const userAnswer = answerInput.value.trim().toLowerCase();
	
	answerInput.value = "";
	answerInput.focus();
	
	if (userAnswer === "") {
		return;		
	};
	
	const selectedAgent = agents.find(function(agent) {
		return agent.name.toLowerCase() === userAnswer;
		});
	
	if (!selectedAgent) {
		return;
	};
	
	if (usedAnswer.includes(selectedAgent.name)) {
		return;
	};
	
	
	usedAnswer.push(selectedAgent.name);
	
	
	localStorage.setItem(
		storageKey,
		JSON.stringify(usedAnswer)
	
	);
	
	addAttemptRow(selectedAgent, correctAnswer, attempts);	
	
	if (selectedAgent.name === correctAnswer.name) {
		recordWinStatistics(usedAnswer.length);
		updateStatWindow();
		
		showClassicResult();
	};
	
	
	
}



answerInput.addEventListener("click", function() {
	showCharacterSuggestions(answerInput, agentSuggestions, usedAnswer, checkClassicAnswer, agents,"image");
	
});

answerInput.addEventListener("input", function() {
	showCharacterSuggestions(answerInput, agentSuggestions, usedAnswer, checkClassicAnswer, agents,"image");
	
});

endlessAnswerInput.addEventListener("click", function() {
  showCharacterSuggestions(endlessAnswerInput, endlessAgentSuggestions, endlessUsedAnswers, checkEndlessAnswer, agents,"image");
});

endlessAnswerInput.addEventListener("input", function() {
  showCharacterSuggestions(endlessAnswerInput, endlessAgentSuggestions, endlessUsedAnswers, checkEndlessAnswer, agents,"image");
});


	
	
	
	document.addEventListener("click", function(event) {
		 if (!event.target.closest(".search-box")) {
			agentSuggestions.textContent = "";
			endlessAgentSuggestions.textContent = "";
			bangbooSuggestions.textContent = "";
			selectedSuggestionIndex = -1;
		}
	});
	
	statsButton.addEventListener("click", function(){
		updateStatWindow();
		updateBangbooStatWindow();
		statsDialog.showModal();
		
	});
	
	closeStatsButton.addEventListener("click", function(){
		statsDialog.close();
		
	});
	
	rulesButton.addEventListener("click", function() {
		rulesDialog.showModal();
	});
	
	closeRulesButton.addEventListener("click", function() {
		rulesDialog.close();
	});
	
	rulesDialog.addEventListener("click", function(event) {
		const dialogPosition = rulesDialog.getBoundingClientRect();

		const clickedOutside =
			event.clientX < dialogPosition.left ||
			event.clientX > dialogPosition.right ||
			event.clientY < dialogPosition.top ||
			event.clientY > dialogPosition.bottom;

		if (clickedOutside) {
			rulesDialog.close();
		}
	});	
	
	languageButton.addEventListener("click", function() {
		const currentLanguage = document.documentElement.lang;
		const nextLanguage = currentLanguage === "en" ? "ru" : "en";

		setLanguage(nextLanguage);
	});
	
	const savedLanguage = localStorage.getItem("siteLanguage");

	if (savedLanguage === "ru") {
		setLanguage("ru");
	} else {
		setLanguage("en");
	}
	
	
	
	
//_____________________Удоление попыток
statsDialog.addEventListener("click", function(event) {
  const dialogPosition = statsDialog.getBoundingClientRect();

  const clickedOutside =
    event.clientX < dialogPosition.left ||
    event.clientX > dialogPosition.right ||
    event.clientY < dialogPosition.top ||
    event.clientY > dialogPosition.bottom;

  if (clickedOutside) {
	  statsDialog.close();
	}
});

resetStatsButton.addEventListener("click", function() {
	const shouldReset = confirm(getTranslation("confirmResetProgress"));

	if (!shouldReset) {
		return;
	}

	localStorage.removeItem(statsKey);
	localStorage.removeItem(storageKey);
	
	localStorage.removeItem(bangbooStatsKey);
	localStorage.removeItem(bangbooStorageKey);
	
	localStorage.removeItem(endlessScoreKey);
	localStorage.removeItem(endlessRoundKey);
	
	
	
	Object.keys(localStorage).forEach(function(key) {
	if (
		key.startsWith("usedAnswers-") ||
		key.startsWith("bangbooAnswers-")
		) {
		localStorage.removeItem(key);
		}
	});

	localStorage.removeItem("devDayOffset");
	
	location.reload();
});


//_____________________Сохронение
createSaveCodeButton.addEventListener("click", function() { 
	createSaveCode();
  }
);



//_____________________Загрузка
loadSaveCodeButton.addEventListener("click", function() {
    loadSaveCode();
  }
);

classicShareButton.addEventListener(
    "click",
    shareClassicResult
);

bangbooShareButton.addEventListener(
    "click",
    shareBangbooResult
);

modeTabs.forEach(function(tab) {
	
	tab.addEventListener("click", function() {
		modeTabs.forEach(function(otherTab) {
			otherTab.classList.remove("active");
			otherTab.setAttribute("aria-pressed", "false");
		});

		tab.classList.add("active");

		showModePanel(tab.dataset.mode);
		tab.setAttribute("aria-pressed", "true");
	});

	
	categoryTabs.forEach(function(tab) {
		tab.addEventListener("click", function() {
			categoryTabs.forEach(function(otherTab) {
				otherTab.classList.remove("active");
				otherTab.setAttribute("aria-pressed", "false");
			});

			tab.classList.add("active");
			tab.setAttribute("aria-pressed", "true");

			const selectedCategory = tab.dataset.category;

			if (selectedCategory === "bangbo") {
				modeTabsContainer.hidden = true;
				showModePanel("bangbo");
				return;
			}

			modeTabsContainer.hidden = false;

			const activeModeTab = document.querySelector(".mode-tab.active");
	
			if (activeModeTab) {
				showModePanel(activeModeTab.dataset.mode);
			} else {
				showModePanel("classic");
			}
		});
	});
	
	
	
});

answerInput.addEventListener("keydown", function(event) {
  handleSuggestionKeydown(event,agentSuggestions,checkClassicAnswer);
});

endlessAnswerInput.addEventListener(
  "keydown",
	function(event) {
		handleSuggestionKeydown(event,endlessAgentSuggestions,checkEndlessAnswer);
	}
);

dailyResetReloadButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        location.reload();
    });
});
// 3. Когда нажали — вывести сообщение