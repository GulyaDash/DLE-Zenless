
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
function addIcon(agent, categoryName, categoryImages){
	
	const categoryCell = document.createElement("span");
	const categoryIcon = document.createElement("img");
	
	const categoryValue = agent[categoryName];
	const correctValue = correctAnswer[categoryName];
	
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
	
	console.log("Static: ", stats);
};


//________Сохронение
function createSaveCode() {
  const saveData = {
    version: 1,
    stats: stats,
    savedDay: dayNumber,
    usedAnswers: usedAnswer
  };

  const saveText = JSON.stringify(saveData);

  const saveCode = btoa(encodeURIComponent(saveText));

  saveCodeField.value = saveCode;
  saveCodeField.select();
}

//________Загрузка и проверка на ошибки в коде сохранения
function loadSaveCode() {
  const enteredCode = saveCodeField.value.trim();

  if (enteredCode === "") {
    alert("First, paste the save code");
    return;
  }

  try {
    const saveText = decodeURIComponent(atob(enteredCode));
    const saveData = JSON.parse(saveText);

    if (saveData.version !== 1 || !saveData.stats || typeof saveData.savedDay !== "number" || !Array.isArray(saveData.usedAnswers)) {
      throw new Error("Unfaithful save structure");
    }

    const shouldLoad = confirm("Load save and replace current stats?");

    if (!shouldLoad) {
      return;
    }

    localStorage.setItem(statsKey, JSON.stringify(saveData.stats));

    const importedAnswersKey = "usedAnswers-" + saveData.savedDay;

    localStorage.setItem(importedAnswersKey, JSON.stringify(saveData.usedAnswers));

    alert("Save loaded");

    location.reload();

  } catch (error) {
    console.error("Loading error:", error);

    alert("Failed to load save file. Check your code.");
  }
}

	
