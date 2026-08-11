console.log(agents[0].faction);


// 1. Найти кнопку
const checkButton = document.querySelector("#checkButton");

const answerInput = document.querySelector("#answerInput");
const attempts = document.querySelector("#attempts");
const attemptCount = document.querySelector("#attemptCount");
const agentSuggestions = document.querySelector("#agentSuggestions");
//const correctAnswer = agents[0];

const devDayOffset = Number(localStorage.getItem("devDayOffset") || 0);

const millisecondsInDay = 1000 * 60 * 60 * 24;
const dayNumber = Math.floor(Date.now() / millisecondsInDay) + devDayOffset;

const dailySeed = Math.abs(Math.sin(dayNumber) * 10000);
const dailyIndex = Math.floor((dailySeed % 1) * agents.length);


const correctAnswer = agents[dailyIndex];

const statsButton = document.querySelector("#statsButton");
const statsDialog = document.querySelector("#statsDialog");
const closeStatsButton = document.querySelector("#closeStatsButton");

const statsGames = document.querySelector("#statsGames");
const statsAttempts = document.querySelector("#statsAttempts");
const statsAverage = document.querySelector("#statsAverage");
const statsCurrentStreak = document.querySelector("#statsCurrentStreak");
const statsBestStreak = document.querySelector("#statsBestStreak");

const resetStatsButton = document.querySelector("#resetStatsButton");

const saveCodeField = document.querySelector("#saveCodeField");
const createSaveCodeButton = document.querySelector("#createSaveCodeButton");
const loadSaveCodeButton = document.querySelector("#loadSaveCodeButton");

//const usedAnswer = [];

const storageKey = "usedAnswers-" + dayNumber;
const savedAnswers = localStorage.getItem(storageKey);


const usedAnswer = savedAnswers ? JSON.parse(savedAnswers): [];
 
 let selectedSuggestionIndex = -1;
 
 
attemptCount.textContent = usedAnswer.length;

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
//console.log(stats);
// Фунуции
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

function showAgentSuggestions() {
	agentSuggestions.textContent = "";
	selectedSuggestionIndex = -1;
	
	const searchText = answerInput.value.trim().toLowerCase();
	
	const filteredAgents = agents.filter(function(agent) {
		//return agent.name.toLowerCase().includes(searchText);
		
			const matchesSearch = agent.name.toLowerCase().includes(searchText);
			
			const wasNotUsed = !usedAnswer.includes(agent.name);
			
			return matchesSearch && wasNotUsed;		
	});
	
	if (filteredAgents.length === 0){
		const emptyMassage = document.createElement("div");
		emptyMassage.className = "suggestion-empty";
		emptyMassage.textContent = "It's Not Agent";
		
		agentSuggestions.appendChild(emptyMassage);
		return;
		
	};
	
	
	filteredAgents.forEach(function(agent){
		const suggestion = document.createElement("button");
		suggestion.type = "button";
		suggestion.className = "suggestion-item";
		
		const avatar = document.createElement("img");
		avatar.src = agent.image;
		avatar.alt = agent.name;
		avatar.className = "suggestion-avatar";
		
		const name = document.createElement("span");
		name.textContent = agent.name;
		
		
		
		suggestion.appendChild(avatar);
		suggestion.appendChild(name);
		
		suggestion.addEventListener("click", function(){
			answerInput.value = agent.name;
			agentSuggestions.textContent = "";
			checkButton.click();
		});
		
		agentSuggestions.appendChild(suggestion);
		
		
	});
	
};

function addAttemptRow(agent){
	
	const attemptRow = document.createElement("div");
		attemptRow.className = "attempt-row";
		
		
		const nameCell = document.createElement("span");
		
		const avatar = document.createElement("img");
		avatar.src = agent.image;
		avatar.alt = agent.name;
		avatar.className = "agent-avatar";
		
		nameCell.appendChild(avatar);
		
		//-------------------------------------------------------//
		
		const raceCell = addIcon(agent, "race", races);
		
		//-------------------------------------------------------//
		
		const rankCell = addIcon(agent, "rank", rankImages);
		
		//-------------------------------------------------------//
		
		const specialtyCell = addIcon(agent, "specialty", specialtyImages);
		
		//------------------------------------------------------//
		
		const attributeCell = addIcon(agent, "attribute", attributeImages);

		//-------------------------------------------------------//
		
		const attackTypeCell = addIcon(agent, "attackType", attackTypeImages);
		
		//-------------------------------------------------------//
		
		const factionCell = addIcon(agent, "faction", factionImages);
		//-------------------------------------------------------//
		
		const weeklyBossCell = addIcon(agent, "weeklyBoss", weeklyBoss);
		
		//-------------------------------------------------------//
		
		const materialCell = addIcon(agent, "material", materials);
		
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
		
		
		attempts.prepend(attemptRow);
		
	console.log("типа тут агент", agent);
};

usedAnswer.forEach(function(answerName) {
	const savedAgent = agents.find(function(agent){
		return agent.name === answerName;
	});
	
	if (savedAgent){
		addAttemptRow(savedAgent);
		
	}
	
	
});
// 2. Следить за нажатием

const isGameFinished = usedAnswer.includes(correctAnswer.name);

 
if (isGameFinished){
		
		answerInput.disabled = true;
		checkButton.disabled = true;
	
}

checkButton.addEventListener("click", function() {
	console.log(answerInput.value);	
	
	
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
	
	attemptCount.textContent = usedAnswer.length;
	
	localStorage.setItem(
		storageKey,
		JSON.stringify(usedAnswer)
	
	);
	
	console.log(localStorage.getItem("usedAnswers-" + dayNumber));
	
	addAttemptRow(selectedAgent);
	
	if (selectedAgent.name === correctAnswer.name) {
		recordWinStatistics(usedAnswer.length);
		updateStatWindow();
		
		answerInput.disabled = true;
		checkButton.disabled = true;
	};
	
	
	
});

answerInput.addEventListener("click", function() {
	showAgentSuggestions()
	
});

answerInput.addEventListener("input", function() {
	showAgentSuggestions()
	
});



answerInput.addEventListener("keydown", function(event){
	if (event.key == "ArrowUp"){
		event.preventDefault();
	
		const suggestionItems = agentSuggestions.querySelectorAll(".suggestion-item");
	
		if (suggestionItems.length === 0){
			return;
		}
		
		if (selectedSuggestionIndex <= 0){
			selectedSuggestionIndex = suggestionItems.length - 1;
		} else {
			selectedSuggestionIndex = selectedSuggestionIndex - 1;
		}
		
	
		
		suggestionItems.forEach(function(item){
			
			item.classList.remove("is-selected");
		
		});
	
		suggestionItems[selectedSuggestionIndex] 
		.classList.add("is-selected");
	}
	
	
	
	
	if (event.key == "ArrowDown"){
		event.preventDefault();
	
		const suggestionItems = agentSuggestions.querySelectorAll(".suggestion-item");
	
		if (suggestionItems.length === 0){
			return;
		}
	
		selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestionItems.length;
		
		suggestionItems.forEach(function(item){
			
			item.classList.remove("is-selected");
		
		});
	
		suggestionItems[selectedSuggestionIndex] 
		.classList.add("is-selected");
	}
	
	
	
	if (event.key === "Enter") {
		event.preventDefault();
		
		const selectedItem = agentSuggestions.querySelector(".suggestion-item.is-selected");
		
		if (selectedItem){
			selectedItem.click();
			return;
		}
		
		checkButton.click();
	}
	
	if (event.key === "Escape") {
		agentSuggestions.textContent = "";
		selectedSuggestionIndex = -1;
	}
		
	});
	document.addEventListener("click", function(event){
		if (!event.target.closest(".search-box")){
			agentSuggestions.textContent="";
		}
	});
	
	statsButton.addEventListener("click", function(){
		updateStatWindow();
		statsDialog.showModal();
		
	});
	
	closeStatsButton.addEventListener("click", function(){
		statsDialog.close();
		
	});
	
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
  const shouldReset = confirm("Relode all static?");

  if (!shouldReset) {
    return;
  }

  localStorage.removeItem(statsKey);
  localStorage.removeItem(storageKey);
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
// 3. Когда нажали — вывести сообщение