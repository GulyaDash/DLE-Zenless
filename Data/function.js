// Поддержка прежнего имени в локальном прогрессе и файлах сохранения.
function parseAgentSave(text) {
    return JSON.parse(text, function(key, value) {
        return value === "Claret" ? "Claret Flint" : value;
    });
}

function updateStatWindow(){
	statsGames.textContent = stats.completedGames;
	statsAttempts.textContent = stats.totalAttempts;
	statsCurrentStreak.textContent = stats.currentStreak;
	statsBestStreak.textContent = stats.bestStreak;
	
	if (stats.completedGames === 0){
		statsAverage.textContent = "0";
		
	} else {
		const average = stats.totalAttempts / stats.completedGames;
		
		statsAverage.textContent = average.toFixed(1);
		
	}
	
	
}


//________выбор героя стрелочками
function handleSuggestionKeydown(event,suggestionsContainer,submitFunction) {
  const suggestionItems =suggestionsContainer.querySelectorAll(".suggestion-item");
  
  if (event.key === "ArrowUp") {
	  event.preventDefault();

    if (suggestionItems.length === 0) {
		return;
		}
		
	if (selectedSuggestionIndex <= 0) {
		selectedSuggestionIndex = suggestionItems.length - 1;
    } else {
      selectedSuggestionIndex = selectedSuggestionIndex - 1;
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();

    if (suggestionItems.length === 0) {
      return;
    }

    selectedSuggestionIndex =
      (selectedSuggestionIndex + 1) % suggestionItems.length;
  } else if (event.key === "Enter") {
    event.preventDefault();

    const selectedItem =
      suggestionsContainer.querySelector(".suggestion-item.is-selected");

    if (selectedItem) {
      selectedItem.click();
    } else {
      submitFunction();
    }

    return;
  } else if (event.key === "Escape") {
    suggestionsContainer.textContent = "";
    selectedSuggestionIndex = -1;
    return;
  } else {
    return;
  }

  suggestionItems.forEach(function(item) {
    item.classList.remove("is-selected");
  });

  const highlightedItem = suggestionItems[selectedSuggestionIndex];
  
  highlightedItem.classList.add("is-selected");
  
  highlightedItem.scrollIntoView(
	{
		block: "nearest",
		inline: "nearest"
	});
}

function startEndlessRound() {
  let nextAnswer;

  do {
	  const randomIndex = Math.floor(
		Math.random() * agents.length
	  );

    nextAnswer = agents[randomIndex];
  } while (
    agents.length > 1 && nextAnswer === endlessCorrectAnswer
  );

  endlessCorrectAnswer = nextAnswer;
  endlessUsedAnswers = [];
  endlessResultCard.hidden = true;

  endlessAnswerInput.value = "";
  endlessAgentSuggestions.textContent = "";
  endlessAttempts.textContent = "";

updateEndlessAttemptSquares(0);

  endlessAnswerInput.disabled = false;
  
  saveEndlessRound();
}

function checkEndlessAnswer() {
	
	if (endlessAnswerInput.disabled) {
		return;
	}

	const userAnswer = endlessAnswerInput.value.trim().toLowerCase();

	endlessAnswerInput.value = "";
	endlessAgentSuggestions.textContent = "";
	endlessAnswerInput.focus();

	if (userAnswer === "") {
		return;
	}
	
	const selectedAgent = agents.find(function(agent) {
		return agent.name.toLowerCase() === userAnswer;
	});

	if (!selectedAgent) {
		return;
	}

	if (endlessUsedAnswers.includes(selectedAgent.name)) {
		return;
	}
	
	endlessUsedAnswers.push(selectedAgent.name);
	
	addAttemptRow(selectedAgent,endlessCorrectAnswer,endlessAttempts);
	saveEndlessRound();
	
	const guessedCorrectly = selectedAgent.name === endlessCorrectAnswer.name;
	
	if (!guessedCorrectly) {
		updateEndlessAttemptSquares(endlessUsedAnswers.length);
	}

  const attemptsFinished = endlessUsedAnswers.length >= endlessMaxAttempts;

  if (guessedCorrectly) {
    endlessScore = endlessScore + 1;
    endlessScoreElement.textContent = endlessScore;
	
	localStorage.setItem(endlessScoreKey, String(endlessScore));

    finishEndlessRound();
    return;
  }

  if (attemptsFinished) {
    finishEndlessRound();
  }
}


function finishEndlessRound() {
	const guessedCorrectly = endlessUsedAnswers.includes(
        endlessCorrectAnswer.name
    );
   
    endlessAnswerInput.disabled = true;
    endlessAnswerInput.value = "";
    endlessAgentSuggestions.textContent = "";

    const messageKey = guessedCorrectly
        ? "endlessRoundWon": "endlessRoundLost";

    endlessResultMessage.dataset.i18n = messageKey;
    endlessResultMessage.textContent = getTranslation(messageKey);

    endlessResultPortrait.src = endlessCorrectAnswer.image;
    endlessResultPortrait.alt = endlessCorrectAnswer.name;

    endlessResultName.textContent = endlessCorrectAnswer.name;

    endlessResultCard.hidden = false;
}

function showCharacterSuggestions(inputElement,suggestionsContainer,usedAnswers,submitFunction,characterList,imageProperty) {
	
	suggestionsContainer.textContent = "";
	selectedSuggestionIndex = -1;
	
	const searchText = inputElement.value.trim().toLowerCase();
	
	const filteredCharacters = characterList.filter(function(character) {
			const matchesSearch = character.name.toLowerCase().includes(searchText);
			const wasNotUsed = !usedAnswers.includes(character.name);
			
			return matchesSearch && wasNotUsed;		
	});
	
	if (filteredCharacters.length === 0) {
		const emptyMassage = document.createElement("div");
		emptyMassage.className = "suggestion-empty";
		emptyMassage.dataset.i18n = "noSearchResults";
		emptyMassage.textContent = getTranslation("noSearchResults");
		suggestionsContainer.appendChild(emptyMassage);
		return;
		
	};
	
	
	filteredCharacters.forEach(function(character) {		
		const suggestion = document.createElement("button");
		suggestion.type = "button";
		suggestion.className = "suggestion-item";
		
		const avatar = document.createElement("img");
		avatar.src = character[imageProperty];
		avatar.alt = character.name;
		avatar.className = "suggestion-avatar";
		
		const name = document.createElement("span");
		name.textContent = character.name;		
		
		
		suggestion.appendChild(avatar);
		suggestion.appendChild(name);
		
		suggestion.addEventListener("click", function() {
			inputElement.value = character.name;
			suggestionsContainer.textContent = "";
			submitFunction();
		});
		
		suggestionsContainer.appendChild(suggestion);
		
		
	});
	
};


//________получение Картиночек
function getBangbooHintImage(hintName) {
  if (hintName === "element") {
		return attributeImages[correctBangboo.element];
	}

  if (hintName === "rank") {
		return rankImages[correctBangboo.rank];
	}

  if (hintName === "eyes") {
		return eyesBangbooImages[correctBangboo.eyes];
	}

  if (hintName === "emoji") {
	  return correctBangboo.emoji;
	}

  return "";
}

//________Открытие подсказок
function renderBangbooHints() {
  bangbooHints.forEach(function(hintCell, index) {
    hintCell.textContent = "?";

    if (index >= bangbooRevealedHints) {
      return;
    }

    const hintName = bangbooHintOrder[index];

    const imagePath =getBangbooHintImage(hintName);

    if (!imagePath) {
      return;
    }

    const hintImage =
      document.createElement("img");

    hintImage.src = imagePath;
    hintImage.alt = hintName;

    hintCell.textContent = "";
    hintCell.appendChild(hintImage);
  });
}




//________Проверка совподений
function isPartialMatch (categoryName, selectedValue,correctValue){
	if (categoryName === "faction"){
		const factionGroups = [
			["CISRT", "MOD", "rover"],
			["obol", "silver"]
		];
		return factionGroups.some(function(group) {
			return group.includes(selectedValue) && group.includes(correctValue);
		});
		
	};
	
	if (categoryName === "attackType"){
		const selectedType = selectedValue.split("_");
		const correctType = correctValue.split("_");
		
		return selectedType.some(function(type){
			return correctType.includes(type);
			
		});
	};
	
	return false;
};


//________Создание иконки
function addIcon(agent, correctAgent, categoryName, categoryImages){
	
	const categoryCell = document.createElement("span");
	const categoryIcon = document.createElement("img");
	
	const categoryValue = agent[categoryName];
	const correctValue = correctAgent[categoryName];

	// Неизвестная характеристика не считается совпадением или ошибкой.
	if (categoryValue == null || correctValue == null) {
		categoryCell.className = "unknown";
		categoryCell.textContent = "?";
		return categoryCell;
	}
	
	categoryIcon.src = categoryImages[categoryValue];
	categoryIcon.alt = categoryValue;
	categoryIcon.className = "category-icon";
		
	categoryCell.appendChild(categoryIcon);
	
	//________Проверка на соаодение
		if (categoryValue === correctValue){
			categoryCell.className = "correct";
		} else if (
			isPartialMatch(categoryName, categoryValue, correctValue)
		){
			categoryCell.className = "partial";
		}else{
			categoryCell.className = "wrong";
		};
		
	return categoryCell;
	
};


//________Создание иконки_2
function addAttemptRow(agent, correctAgent, attemptContainer){
	
	const attemptRow = document.createElement("div");
		attemptRow.className = "attempt-row";
		
		
		const nameCell = document.createElement("span");
		
		const avatar = document.createElement("img");
		avatar.src = agent.image;
		avatar.alt = agent.name;
		avatar.className = "agent-avatar";
		
		nameCell.appendChild(avatar);
		
		//-------------------------------------------------------//
		
		const raceCell = addIcon(agent, correctAgent, "race", races);
		
		//-------------------------------------------------------//
		
		const rankCell = addIcon(agent, correctAgent, "rank", rankImages);
		
		//-------------------------------------------------------//
		
		const specialtyCell = addIcon(agent, correctAgent, "specialty", specialtyImages);
		
		//------------------------------------------------------//
		
		const attributeCell = addIcon(agent, correctAgent, "attribute", attributeImages);

		//-------------------------------------------------------//
		
		const attackTypeCell = addIcon(agent, correctAgent, "attackType", attackTypeImages);
		
		//-------------------------------------------------------//
		
		const factionCell = addIcon(agent, correctAgent, "faction", factionImages);
		//-------------------------------------------------------//
		
		const weeklyBossCell = addIcon(agent, correctAgent, "weeklyBoss", weeklyBoss);
		
		//-------------------------------------------------------//
		
		const materialCell = addIcon(agent, correctAgent, "material", materials);
		
		//-------------------------------------------------------//
		attemptRow.appendChild(nameCell);
		attemptRow.appendChild(raceCell);
		attemptRow.appendChild(rankCell);
		attemptRow.appendChild(specialtyCell);
		attemptRow.appendChild(attributeCell);
		attemptRow.appendChild(attackTypeCell);
		attemptRow.appendChild(factionCell);
		attemptRow.appendChild(weeklyBossCell);
		attemptRow.appendChild(materialCell);
		
		
		attemptContainer.prepend(attemptRow);
		
};
	
//________Сохронение	
function recordWinStatistics(attemptsNumber){
	if (stats.lastCompletedDay === dayNumber){
		return;
	}
	
	stats.completedGames = stats.completedGames + 1;
	stats.totalAttempts = stats.totalAttempts + attemptsNumber;
	
	if (stats.lastCompletedDay === dayNumber - 1){
		stats.currentStreak = stats.currentStreak + 1;
	}else{
		stats.currentStreak = 1;
	}
	
	if (stats.currentStreak > stats.bestStreak){
		stats.bestStreak = stats.currentStreak;
	}
	
	stats.lastCompletedDay = dayNumber;
	
	localStorage.setItem(statsKey, JSON.stringify(stats));
	
};


//________Сохронение
function buildSaveData() {
  const saveData = {
    version: 8,
    splash: getSplashSave(),

    pixel: {
      savedDay: dayNumber,
      usedAnswers: pixelUsedAnswers,
      stats: pixelStats
    },

    stats: stats,
    savedDay: dayNumber,
    usedAnswers: usedAnswer,

    endless: {
      score: endlessScore,

      round: {
        answerName: endlessCorrectAnswer.name,
		usedAnswers: endlessUsedAnswers
      }
    },
	
	bangboo: {
		savedDay: dayNumber,
		usedAnswers: bangbooUsedAnswers,
		stats: bangbooStats
	}
  };

  return saveData;
}

function setSaveTransferStatus(key) {
    const status = document.querySelector("#saveTransferStatus");
    status.dataset.i18n = key;
    status.textContent = getTranslation(key);
}

function setSaveTransferBusy(busy) {
    downloadSaveButton.disabled = busy;
    uploadSaveButton.disabled = busy;
    saveFileInput.disabled = busy;
}

function downloadSaveFile() {
    try {
        const blob = new Blob([JSON.stringify(buildSaveData(), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "dle-zenless-save-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
        setSaveTransferStatus("saveFileDownloaded");
    } catch {
        setSaveTransferStatus("saveDownloadFailed");
    }
}

async function loadSaveFile(file) {
  if (!file || uploadSaveButton.disabled) return;
  setSaveTransferBusy(true);
  setSaveTransferStatus("saveLoading");
  try {
    if (file.size > 1024 * 1024) throw new Error("Save file is too large");
    const content = (await file.text()).trim();
    // Также принимаем старый длинный код, сохранённый в текстовом файле.
    const saveData = parseAgentSave(content.startsWith("{") ? content : decodeURIComponent(atob(content)));
    const versionIsSupported = 
	saveData.version === 1 || 
	saveData.version === 2 || 
	saveData.version === 3 || 
	saveData.version === 4 ||
	saveData.version === 5 ||
	saveData.version === 6 ||
	saveData.version === 7 || saveData.version === 8;

	const classicDataIsValid = isPixelStatsValid(saveData.stats) && Number.isSafeInteger(saveData.savedDay) && isPixelAnswersValid(saveData.usedAnswers);

	let endlessDataIsValid = true;

	if (saveData.version === 2 || saveData.version >= 5 || saveData.endless !== undefined) {
		endlessDataIsValid = saveData.endless 
		&& Number.isSafeInteger(saveData.endless.score) && saveData.endless.score >= 0 
		&& saveData.endless.round 
		&& agents.some(function(agent) { return agent.name === saveData.endless.round.answerName; }) 
		&& isPixelAnswersValid(saveData.endless.round.usedAnswers);
	}
	
	let bangbooDataIsValid = true;

	if (saveData.version >= 3) {
		bangbooDataIsValid = saveData.bangboo 
		&& Number.isSafeInteger(saveData.bangboo.savedDay) 
		&& Array.isArray(saveData.bangboo.usedAnswers) &&
        new Set(saveData.bangboo.usedAnswers).size === saveData.bangboo.usedAnswers.length &&
        saveData.bangboo.usedAnswers.every(function(name) { return bangboos.some(function(bangboo) { return bangboo.name === name; }); });
	}
	
	let bangbooStatsDataIsValid = true;

	if (saveData.version >= 4) {
		bangbooStatsDataIsValid = saveData.bangboo && isPixelStatsValid(saveData.bangboo.stats);
	}


	const pixelDataIsValid = saveData.version < 5 || (
		saveData.pixel && Number.isSafeInteger(saveData.pixel.savedDay) &&
		isPixelAnswersValid(saveData.pixel.usedAnswers) &&
		(saveData.version < 6 || isPixelStatsValid(saveData.pixel.stats))
	);

	if (
	!versionIsSupported || 
	!classicDataIsValid || 
	!endlessDataIsValid || 
	!bangbooDataIsValid ||
	!bangbooStatsDataIsValid ||
	!pixelDataIsValid ||
	(saveData.version >= 7 && !isSplashSaveValid(saveData.splash)) ||
	(saveData.version >= 8 && !isSplashStatisticsValid(saveData.splash.stats))
	) {
	  throw new Error("Unfaithful save structure");
	}

	const shouldLoad = confirm(getTranslation("confirmLoadSave"));
    if (!shouldLoad) {
      setSaveTransferStatus("saveLoadCancelled");
      return;
    }

    localStorage.setItem(statsKey, JSON.stringify(saveData.stats));
	
    const importedAnswersKey = "usedAnswers-" + saveData.savedDay;

    localStorage.setItem(importedAnswersKey, JSON.stringify(saveData.usedAnswers));
	
	
	if (saveData.endless) {
		localStorage.setItem(endlessScoreKey,String(saveData.endless.score));

		localStorage.setItem(endlessRoundKey,JSON.stringify(saveData.endless.round));
	}
	
	if (saveData.version >= 3) {
		const importedBangbooKey = "bangbooAnswers-" + saveData.bangboo.savedDay;

		localStorage.setItem(importedBangbooKey,JSON.stringify(saveData.bangboo.usedAnswers));
	}
	
	if (saveData.version >= 4) {
		localStorage.setItem(bangbooStatsKey,JSON.stringify(saveData.bangboo.stats));
	}

	// Старые коды не содержат Pixel и не стирают его прогресс.
	if (saveData.version >= 5) {
		localStorage.setItem("pixelAnswers-" + saveData.pixel.savedDay,
			JSON.stringify(saveData.pixel.usedAnswers));
	}
	if (saveData.version >= 6) {
		localStorage.setItem(pixelStatsKey, JSON.stringify(saveData.pixel.stats));
	}

    if (saveData.version >= 7) {
        localStorage.setItem("splashAnswers-" + saveData.splash.savedDay, JSON.stringify(saveData.splash));
    }
    if (saveData.version >= 8) localStorage.setItem(splashStatsKey, JSON.stringify(saveData.splash.stats));
    alert(getTranslation("saveLoaded"));

    location.reload();

  } catch (error) {
    setSaveTransferStatus("saveLoadFailed");
  } finally {
    setSaveTransferBusy(false);
    saveFileInput.value = "";
  }
}

//________Сохронение результата в Endless
function saveEndlessRound() {
  if (!endlessCorrectAnswer) {
    return;
  }

  const roundData = {
    answerName: endlessCorrectAnswer.name,
    usedAnswers: endlessUsedAnswers
  };

  localStorage.setItem(
    endlessRoundKey,
    JSON.stringify(roundData)
  );
}

//________Загрузка результата в Endless
function loadEndlessRound() {
  const savedText =
    localStorage.getItem(endlessRoundKey);

  if (!savedText) {
    startEndlessRound();
    return;
  }

  try {
    const savedRound = parseAgentSave(savedText);

    const savedCorrectAgent = agents.find(
      function(agent) {
        return agent.name === savedRound.answerName;
      }
    );

    if (
      !savedCorrectAgent ||
      !Array.isArray(savedRound.usedAnswers)
    ) {
      throw new Error("Некорректное сохранение Endless");
    }

    endlessCorrectAnswer = savedCorrectAgent;

    endlessUsedAnswers = savedRound.usedAnswers.filter(function(answerName) {
		return agents.some(function(agent) {
			return agent.name === answerName;
		});
    });

    endlessAttempts.textContent = "";

    endlessUsedAnswers.forEach(function(answerName) {
		const savedAgent = agents.find(function(agent) {
			return agent.name === answerName;
			
		});

      if (savedAgent) {
        addAttemptRow(savedAgent,endlessCorrectAnswer,endlessAttempts);
      }
    });

	const wrongAnswersCount = endlessUsedAnswers.filter(
    function(answerName) {
        return answerName !== endlessCorrectAnswer.name;
    }
	).length;

	updateEndlessAttemptSquares(wrongAnswersCount);

	const roundWasFinished =
		endlessUsedAnswers.includes(endlessCorrectAnswer.name) ||
		endlessUsedAnswers.length >= endlessMaxAttempts;

	if (roundWasFinished) {
		finishEndlessRound();
	} else {
		endlessResultCard.hidden = true;
		endlessAnswerInput.disabled = false;
	}

	} catch (error) {
		console.error("Ошибка загрузки Endless:",error);
		localStorage.removeItem(endlessRoundKey);
		startEndlessRound();
	}
}

//________Инициализации для банбу
function initializeBangbooMode() {
	
	bangbooShareControls.hidden = true;
	bangbooShareFeedback.hidden = true;
	bangbooDailyTimer.hidden = true;
	
	bangbooPortrait.src = bangbooPlaceholderPortrait;
	bangbooPortrait.alt = "????BOO";

	bangbooMaskedName.textContent = "???BOO";

	bangbooAnswerInput.value = "";
	bangbooSuggestions.textContent = "";

	bangbooRevealedHints = 1;
	renderBangbooHints();
	
}


//________Проверка ответа для банбу
function checkBangbooAnswer() {
	const userAnswer = bangbooAnswerInput.value.trim().toLowerCase();

	bangbooAnswerInput.value = "";
	bangbooSuggestions.textContent = "";
	bangbooAnswerInput.focus();

	if (userAnswer === "") {
		return;
	}

	const selectedBangboo = bangboos.find(
		function(bangboo) {
			return bangboo.name.toLowerCase() === userAnswer;
		}
	);

	if (!selectedBangboo) {
		return;
	}

	if (bangbooUsedAnswers.includes(selectedBangboo.name)) {
		return;
	}

	bangbooUsedAnswers.push(selectedBangboo.name);
	
	localStorage.setItem(bangbooStorageKey, JSON.stringify(bangbooUsedAnswers));

	const guessedCorrectly = selectedBangboo.name === correctBangboo.name;
	addBangbooAttempt(selectedBangboo, guessedCorrectly);

	if (guessedCorrectly) {
		finishBangbooGame();
		return;
	}

	bangbooRevealedHints = Math.min(bangbooRevealedHints + 1,bangbooHints.length);

	renderBangbooHints();
}

//________Проверка победы для банбу
function finishBangbooGame() {
	
	recordBangbooWinStatistics(bangbooUsedAnswers.length);
	updateBangbooStatWindow();
	
	bangbooRevealedHints = bangbooHints.length;

	renderBangbooHints();

	bangbooPortrait.src = correctBangboo.portrait;

	bangbooPortrait.alt = correctBangboo.name;

	bangbooMaskedName.textContent = correctBangboo.name.toUpperCase();

	bangbooAnswerInput.disabled = true;
	
	bangbooAnswerInput.disabled = true;
	bangbooShareControls.hidden = false;
	
	showDailyResetTimer(bangbooDailyTimer);
}

//________ карточки попыток для банбу
function addBangbooAttempt(selectedBangboo,guessedCorrectly) {
	const attemptCard = document.createElement("div");

	attemptCard.className = "bangboo-attempt";

	if (guessedCorrectly) {
		attemptCard.classList.add("bangboo-attempt-correct");
	} else {
		attemptCard.classList.add("bangboo-attempt-wrong");
	}

	const attemptIcon = document.createElement("img");

	attemptIcon.src = selectedBangboo.icon;
	attemptIcon.alt = selectedBangboo.name;

	const attemptName = document.createElement("span");

	attemptName.textContent = selectedBangboo.name;
	
	attemptCard.appendChild(attemptIcon);
	attemptCard.appendChild(attemptName);

	bangbooAttempts.prepend(attemptCard);
}


//________ восстановление интерфейса для банбу
function restoreBangbooProgress() {
	bangbooAttempts.textContent = "";

	let wrongAnswersCount = 0;

	bangbooUsedAnswers.forEach(function(answerName) {
		const savedBangboo = bangboos.find(function(bangboo) {
			return bangboo.name === answerName;
		});

		if (!savedBangboo) {
		return;
		}

		const guessedCorrectly = savedBangboo.name === correctBangboo.name;

		addBangbooAttempt(savedBangboo,guessedCorrectly);

		if (!guessedCorrectly) {
			wrongAnswersCount = wrongAnswersCount + 1;
		}
	});

	bangbooRevealedHints = Math.min( 1 + wrongAnswersCount,bangbooHints.length);

	renderBangbooHints();

	const gameFinished = bangbooUsedAnswers.includes(correctBangboo.name);

	if (gameFinished) {
		finishBangbooGame();
	} else {
		bangbooAnswerInput.disabled = false;
	}
}

function updateBangbooStatWindow() {
	bangbooStatsGames.textContent = bangbooStats.completedGames;
	bangbooStatsAttempts.textContent = bangbooStats.totalAttempts;
	bangbooStatsCurrentStreak.textContent = bangbooStats.currentStreak;
	bangbooStatsBestStreak.textContent = bangbooStats.bestStreak;
	
	if (bangbooStats.completedGames === 0) {
		bangbooStatsAverage.textContent = "0";return;
	}
	
	const average =bangbooStats.totalAttempts /bangbooStats.completedGames;
	bangbooStatsAverage.textContent =average.toFixed(1);
}

function recordBangbooWinStatistics(attemptsNumber) {
	if (bangbooStats.lastCompletedDay === dayNumber) {
		return;
	}

	bangbooStats.completedGames = bangbooStats.completedGames + 1;

	bangbooStats.totalAttempts = bangbooStats.totalAttempts + attemptsNumber;

	if (bangbooStats.lastCompletedDay === dayNumber - 1) {
		bangbooStats.currentStreak = bangbooStats.currentStreak + 1;
	} else {
	bangbooStats.currentStreak = 1;
	}

	if (bangbooStats.currentStreak > bangbooStats.bestStreak) {
		bangbooStats.bestStreak = bangbooStats.currentStreak;
	}

	bangbooStats.lastCompletedDay = dayNumber;

	localStorage.setItem( bangbooStatsKey, JSON.stringify(bangbooStats));
}


function showModePanel(selectedMode) {
	if (splashMode) splashMode.suggestions.textContent = "";
	[agentSuggestions, endlessAgentSuggestions, bangbooSuggestions, pixelAgentSuggestions]
		.forEach(function(container) { container.textContent = ""; });
	selectedSuggestionIndex = -1;
	modePanels.forEach(function(panel) {
		panel.classList.remove("active");

		if (panel.dataset.panel === selectedMode) {
			panel.classList.add("active");
		}
	});
}


//________перкулючение языка
function setLanguage(language) {
    const selectedTranslations = translations[language];

    if (!selectedTranslations) {
        return;
    }

    const translatedElements = document.querySelectorAll("[data-i18n]");

    translatedElements.forEach(function(element) {
        const translationKey = element.dataset.i18n;
        const translatedText = selectedTranslations[translationKey];

        if (translatedText !== undefined) {
            element.textContent = translatedText;
        }
    });
	
	const translatedPlaceholders = document.querySelectorAll("[data-i18n-placeholder]");

	translatedPlaceholders.forEach(function(element) {
		const translationKey = element.dataset.i18nPlaceholder;
		const translatedText = selectedTranslations[translationKey];

		if (translatedText !== undefined) {
			element.placeholder = translatedText;
			element.setAttribute("aria-label", translatedText);
		}
	});

    document.documentElement.lang = language;

    const languageButton = document.querySelector("#languageButton");

    if (languageButton) {
        languageButton.textContent = language === "en" ? "RU" : "EN";
    }

    localStorage.setItem("siteLanguage", language);
    renderSplashMode();
    renderPixelText();

    if (!pixelShareText.hidden && pixelSolved) {
        pixelShareText.value = buildPixelShareText();
    }
}

function getTranslation(key) {
    const language = document.documentElement.lang;
    const dictionary = translations[language] || translations.en;

    return dictionary[key] ?? translations.en[key] ?? key;
}


//________определяет кавадрат в красный 
function updateEndlessAttemptSquares(failedAttempts) {
    endlessAttemptSquares.forEach(function(square, index) {
        const attemptFailed = index < failedAttempts;

        square.classList.toggle("failed", attemptFailed);
    });
}

//________показывает результата
function showClassicResult() {
    classicResultPortrait.src = correctAnswer.image;
    classicResultPortrait.alt = correctAnswer.name;

    classicResultName.textContent = correctAnswer.name;
    classicResultTriesCount.textContent = usedAnswer.length;

    answerInput.disabled = true;
    answerInput.value = "";
    agentSuggestions.textContent = "";

    classicResultCard.hidden = false;
	showDailyResetTimer(classicDailyTimer);
}

//________Функция поделиться.
function buildClassicShareText() {
    const rows = Array.from(
        attempts.querySelectorAll(".attempt-row")
    );

    const resultRows = rows.map(function(row) {
        const cells = Array.from(row.children).slice(1);

        return cells.map(function(cell) {
            if (cell.classList.contains("correct")) {
                return "🟩";
            }

            if (cell.classList.contains("partial")) {
                return "🟨";
            }

            return "🟥";
        }).join("");
    });

    const count = usedAnswer.length;
    const language = document.documentElement.lang;

    const pluralForm = new Intl.PluralRules(language).select(count);
    const triesWord = getTranslation("shareTries_" + pluralForm);

    const message = getTranslation("classicShareMessage")
        .replace("{count}", String(count))
        .replace("{tries}", triesWord);

    const gameDate = new Date(
        dayNumber * millisecondsInDay
    ).toISOString().slice(0, 10);

    return [
        message,
        gameDate,
        "",
        ...resultRows
    ].join("\n");
}


//________Функция поделиться_2
async function shareClassicResult() {
    if (!usedAnswer.includes(correctAnswer.name)) {
        return;
    }

    const resultText = buildClassicShareText();

    classicShareFeedback.hidden = false;
    classicShareText.hidden = true;

    let messageKey;

    try {
        if (!navigator.clipboard ||
            typeof navigator.clipboard.writeText !== "function") {
            throw new Error("Clipboard unavailable");
        }

        await navigator.clipboard.writeText(resultText);

        messageKey = "shareCopied";
    } catch {
        classicShareText.value = resultText;
        classicShareText.hidden = false;
        classicShareText.focus();
        classicShareText.select();

        messageKey = "shareCopyManually";
    }

    classicShareStatus.dataset.i18n = messageKey;
    classicShareStatus.textContent = getTranslation(messageKey);
}


async function copyGameResult(
    resultText,
    feedbackElement,
    statusElement,
    textField
) {
    feedbackElement.hidden = false;
    textField.hidden = true;

    let messageKey;

    try {
        if (!navigator.clipboard ||
            typeof navigator.clipboard.writeText !== "function") {
            throw new Error("Clipboard unavailable");
        }

        await navigator.clipboard.writeText(resultText);

        messageKey = "shareCopied";
    } catch {
        textField.value = resultText;
        textField.hidden = false;
        textField.focus();
        textField.select();

        messageKey = "shareCopyManually";
    }

    statusElement.dataset.i18n = messageKey;
    statusElement.textContent = getTranslation(messageKey);
}

async function shareClassicResult() {
    if (!usedAnswer.includes(correctAnswer.name)) {
        return;
    }

    await copyGameResult(
        buildClassicShareText(),
        classicShareFeedback,
        classicShareStatus,
        classicShareText
    );
}

function buildBangbooShareText() {
    const resultRows = bangbooUsedAnswers
        .slice()
        .reverse()
        .map(function(answerName) {
            return answerName === correctBangboo.name
                ? "🟩"
                : "🟥";
        });

    const count = bangbooUsedAnswers.length;
    const language = document.documentElement.lang;

    const pluralForm = new Intl.PluralRules(language).select(count);
    const triesWord = getTranslation("shareTries_" + pluralForm);

    const message = getTranslation("bangbooShareMessage")
        .replace("{count}", String(count))
        .replace("{tries}", triesWord);

    const gameDate = new Date(
        dayNumber * millisecondsInDay
    ).toISOString().slice(0, 10);

    return [
        message,
        gameDate,
        "",
        ...resultRows
    ].join("\n");
}

async function shareBangbooResult() {
    if (!bangbooUsedAnswers.includes(correctBangboo.name)) {
        return;
    }

    await copyGameResult(
        buildBangbooShareText(),
        bangbooShareFeedback,
        bangbooShareStatus,
        bangbooShareText
    );
}



function formatDailyResetTime(milliseconds) {
	
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
	
    return [hours, minutes, seconds].map(function(number) {
            return String(number).padStart(2, "0");
        })
        .join(":");
}

function updateDailyResetTimer() {
    
	const remainingTime = Math.max(0,nextDailyResetTime - Date.now());
    const formattedTime =formatDailyResetTime(remainingTime);

    dailyResetTimeElements.forEach(function(element) {
        element.textContent = formattedTime;
    });

    if (remainingTime > 0) {
        return;
    }

    if (dailyResetTimerId !== null) {
        clearInterval(dailyResetTimerId);
        dailyResetTimerId = null;
    }

    dailyResetReloadButtons.forEach(function(button) {
        button.hidden = false;
    });

    pixelAnswerInput.disabled = true;
    renderSplashMode();
    pixelAgentSuggestions.textContent = "";
    if (!pixelSolved) {
        pixelFeedbackKey = "pixelNewDay";
        renderPixelText();
    }
}

function showDailyResetTimer(timerContainer) {
    timerContainer.hidden = false;
    startDailyResetTimer();
}

function startDailyResetTimer() {
    dailyResetReloadButtons.forEach(function(button) {
        button.hidden = true;
    });

    updateDailyResetTimer();

    if (
        dailyResetTimerId === null &&
        Date.now() < nextDailyResetTime
    ) {
        dailyResetTimerId = setInterval(updateDailyResetTimer,1000);
    }
}

function drawPixelPortrait() {
    if (!pixelContext || !pixelPortraitImage.naturalWidth) {
        return;
    }

    const canvasWidth = pixelCanvas.width;
    const canvasHeight = pixelCanvas.height;

    pixelContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Сохраняем пропорции исходного изображения.
    const scale = Math.min(
        canvasWidth / pixelPortraitImage.naturalWidth,
        canvasHeight / pixelPortraitImage.naturalHeight
    );

    const drawWidth = pixelPortraitImage.naturalWidth * scale;
    const drawHeight = pixelPortraitImage.naturalHeight * scale;
    const drawX = (canvasWidth - drawWidth) / 2;
    const drawY = (canvasHeight - drawHeight) / 2;

    if (pixelSolved) {
        pixelContext.imageSmoothingEnabled = true;

        pixelContext.drawImage(
            pixelPortraitImage,
            drawX,
            drawY,
            drawWidth,
            drawHeight
        );

        return;
    }

    const levelIndex = Math.min(
        pixelWrongGuesses,
        pixelResolutionLevels.length - 1
    );

    const resolution = pixelResolutionLevels[levelIndex];
    const longestSide = Math.max(
        pixelPortraitImage.naturalWidth,
        pixelPortraitImage.naturalHeight
    );

    const smallCanvas = document.createElement("canvas");
    const smallWidth = pixelPortraitImage.naturalWidth / longestSide * resolution;
    const smallHeight = pixelPortraitImage.naturalHeight / longestSide * resolution;

    // Запас в один пиксель сохраняет края изображения при дробном сдвиге сетки.
    smallCanvas.width = Math.ceil(smallWidth + pixelGridOffset.x);
    smallCanvas.height = Math.ceil(smallHeight + pixelGridOffset.y);

    const smallContext = smallCanvas.getContext("2d");
    smallContext.imageSmoothingEnabled = true;
    smallContext.imageSmoothingQuality = "high";

    // Сдвигаем изображение относительно ячеек: в них каждый день попадают
    // разные участки исходника, поэтому меняются цвета и очертания блоков.
    smallContext.drawImage(
        pixelPortraitImage,
        pixelGridOffset.x,
        pixelGridOffset.y,
        smallWidth,
        smallHeight
    );

    // Растягиваем без сглаживания — получаются чёткие квадратики.
    pixelContext.imageSmoothingEnabled = false;
    const blockSize = Math.max(drawWidth, drawHeight) / resolution;
    pixelContext.save();
    pixelContext.beginPath();
    pixelContext.rect(drawX, drawY, drawWidth, drawHeight);
    pixelContext.clip();

    // Обратный сдвиг оставляет самого персонажа по центру и в исходных пропорциях.
    pixelContext.drawImage(
        smallCanvas,
        drawX - pixelGridOffset.x * blockSize,
        drawY - pixelGridOffset.y * blockSize,
        smallCanvas.width * blockSize,
        smallCanvas.height * blockSize
    );
    pixelContext.restore();
}

// Победа и уровень детализации восстанавливаются по истории ответов.
function isPixelAnswersValid(answers) {
    return Array.isArray(answers) && new Set(answers).size === answers.length &&
        answers.every(function(name) {
            return typeof name === "string" && agents.some(function(agent) {
                return agent.name === name;
            });
        });
}

function restorePixelProgress() {
    try {
        const saved = parseAgentSave(localStorage.getItem(pixelStorageKey) || "[]");
        if (!isPixelAnswersValid(saved)) throw new Error("Invalid Pixel save");
        const winIndex = saved.indexOf(pixelCorrectAnswer.name);
        pixelUsedAnswers = winIndex < 0 ? saved : saved.slice(0, winIndex + 1);
    } catch (error) {
        console.warn("Cannot restore Pixel progress:", error);
        pixelUsedAnswers = [];
    }

    pixelSolved = pixelUsedAnswers.includes(pixelCorrectAnswer.name);
    pixelWrongGuesses = pixelUsedAnswers.length - (pixelSolved ? 1 : 0);
    if (pixelSolved) recordPixelWinStatistics();
    pixelAttempts.textContent = "";
    pixelUsedAnswers.forEach(function(name) {
        addPixelAttempt(agents.find(function(agent) { return agent.name === name; }));
    });
    pixelFeedbackKey = "";
    updatePixelResult();
}

function checkPixelAnswer() {
    if (Date.now() >= nextDailyResetTime) {
        updateDailyResetTimer();
        return;
    }
    if (pixelSolved || pixelAnswerInput.disabled) return;

    const answer = pixelAnswerInput.value.trim().toLowerCase();
    pixelAgentSuggestions.textContent = "";
    selectedSuggestionIndex = -1;
    if (!answer) return;

    const agent = agents.find(function(candidate) {
        return candidate.name.toLowerCase() === answer;
    });
    if (!agent || pixelUsedAnswers.includes(agent.name)) {
        pixelFeedbackKey = agent ? "pixelAlreadyTried" : "pixelUnknownAgent";
        renderPixelText();
        return;
    }

    pixelUsedAnswers.push(agent.name);
    pixelSolved = agent.name === pixelCorrectAnswer.name;
    if (!pixelSolved) pixelWrongGuesses++;
    localStorage.setItem(pixelStorageKey, JSON.stringify(pixelUsedAnswers));
    if (pixelSolved) recordPixelWinStatistics();
    addPixelAttempt(agent);
    pixelAnswerInput.value = "";
    pixelFeedbackKey = "";
    updatePixelResult();
    if (!pixelSolved) pixelAnswerInput.focus();
}

function addPixelAttempt(agent) {
    const row = document.createElement("div");
    const correct = agent.name === pixelCorrectAnswer.name;
    row.className = "pixel-attempt " + (correct ? "pixel-attempt-correct" : "pixel-attempt-wrong");
    const icon = document.createElement("img");
    icon.src = agent.image;
    icon.alt = "";
    const name = document.createElement("span");
    name.textContent = agent.name;
    row.append(icon, name);
    pixelAttempts.prepend(row);
}

function updatePixelResult() {
    pixelAnswerInput.disabled = pixelSolved || Date.now() >= nextDailyResetTime;
    pixelShareButton.hidden = !pixelSolved;
    pixelDailyTimer.hidden = !pixelSolved;
    if (pixelSolved) showDailyResetTimer(pixelDailyTimer);
    renderPixelText();
    drawPixelPortrait();
}

function renderPixelText() {
    pixelFeedback.textContent = pixelFeedbackKey ? getTranslation(pixelFeedbackKey) : "";
    pixelFeedback.hidden = !pixelFeedbackKey;
    pixelImageStatus.hidden = !pixelImageState;
    pixelImageStatus.textContent = pixelImageState ? getTranslation(pixelImageState) : "";
}

function buildPixelShareText() {
    const count = pixelUsedAnswers.length;
    const plural = new Intl.PluralRules(document.documentElement.lang).select(count);
    const message = getTranslation("pixelShareMessage")
        .replace("{count}", String(count))
        .replace("{tries}", getTranslation("shareTries_" + plural));
    const gameDate = new Date(dayNumber * millisecondsInDay).toISOString().slice(0, 10);
    // Короткие строки помещаются в сообщение и при большом числе попыток.
    const squares = pixelUsedAnswers.map(function(name) {
        return name === pixelCorrectAnswer.name ? "🟩" : "🟥";
    });
    const rows = [];
    for (let i = 0; i < squares.length; i += 10) rows.push(squares.slice(i, i + 10).join(""));
    return [message, gameDate, "", ...rows].join("\n");
}

async function sharePixelResult() {
    if (!pixelSolved) return;
    await copyGameResult(buildPixelShareText(), pixelShareFeedback, pixelShareStatus, pixelShareText);
}

function isPixelStatsValid(value) {
    return value && ["completedGames", "totalAttempts", "currentStreak", "bestStreak"]
        .every(function(key) { return Number.isSafeInteger(value[key]) && value[key] >= 0; }) &&
        (value.lastCompletedDay === null || Number.isSafeInteger(value.lastCompletedDay)) &&
        value.totalAttempts >= value.completedGames &&
        value.currentStreak <= value.bestStreak && value.bestStreak <= value.completedGames &&
        (value.completedGames === 0 ? value.lastCompletedDay === null : value.lastCompletedDay !== null);
}

function addPixelWinToStatistics(target, completedDay, attemptsNumber) {
    // Повторное открытие, восстановление или импорт того же дня не добавляют победу.
    if (target.lastCompletedDay !== null && target.lastCompletedDay >= completedDay) return;
    target.completedGames++;
    target.totalAttempts += attemptsNumber;
    target.currentStreak = target.lastCompletedDay === completedDay - 1 ? target.currentStreak + 1 : 1;
    target.bestStreak = Math.max(target.bestStreak, target.currentStreak);
    target.lastCompletedDay = completedDay;
}

function loadPixelStatistics() {
    let result;
    try {
        const saved = JSON.parse(localStorage.getItem(pixelStatsKey));
        if (isPixelStatsValid(saved)) result = saved;
    } catch (error) {
        console.warn("Cannot restore Pixel statistics:", error);
    }
    if (!result) {
        result = { completedGames: 0, totalAttempts: 0, currentStreak: 0, bestStreak: 0, lastCompletedDay: null };
        // Учитываем победы, сохранённые до появления отдельной статистики Pixel.
        Object.keys(localStorage).filter(function(key) { return /^pixelAnswers-\d+$/.test(key); })
            .map(function(key) { return Number(key.slice("pixelAnswers-".length)); })
            .filter(function(day) { return Number.isSafeInteger(day) && day <= dayNumber; })
            .sort(function(a, b) { return a - b; })
            .forEach(function(day) {
                try {
                    const answers = parseAgentSave(localStorage.getItem("pixelAnswers-" + day));
                    if (!isPixelAnswersValid(answers)) return;
                    const seed = Math.abs(Math.sin(day + 404) * 10000);
                    const answer = agents[Math.floor((seed % 1) * agents.length)];
                    const winIndex = answers.indexOf(answer.name);
                    if (winIndex >= 0) addPixelWinToStatistics(result, day, winIndex + 1);
                } catch { /* Повреждённая история одного дня не мешает остальным. */ }
            });
    }
    if (result.lastCompletedDay !== null && result.lastCompletedDay < dayNumber - 1) result.currentStreak = 0;
    localStorage.setItem(pixelStatsKey, JSON.stringify(result));
    return result;
}

function recordPixelWinStatistics() {
    addPixelWinToStatistics(pixelStats, dayNumber, pixelUsedAnswers.length);
    localStorage.setItem(pixelStatsKey, JSON.stringify(pixelStats));
}

function updatePixelStatWindow() {
    const values = {
        pixelStatsGames: pixelStats.completedGames,
        pixelStatsAttempts: pixelStats.totalAttempts,
        pixelStatsAverage: pixelStats.completedGames ? (pixelStats.totalAttempts / pixelStats.completedGames).toFixed(1) : "0",
        pixelStatsCurrentStreak: pixelStats.currentStreak,
        pixelStatsBestStreak: pixelStats.bestStreak
    };
    Object.entries(values).forEach(function(entry) {
        document.getElementById(entry[0]).textContent = entry[1];
    });
}
