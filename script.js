const agents = [
	{
		name: "nefri",
		role: "mage",
		element: "fire",
	},
	
	{
		name: "atra",
		role: "warrior",
		element: "ice",
	},
	
	{
		name: "bob",
		role: "mage",
		element: "ice",
	}
];


console.log(agents);


// 1. Найти кнопку
const checkButton = document.querySelector("#checkButton");
console.log(checkButton);
const answerInput = document.querySelector("#answerInput");
const result = document.querySelector("#result");
const attempts = document.querySelector("#attempts")

const correctAnswer = agents[0];
// 2. Следить за нажатием



checkButton.addEventListener("click", function() {
	console.log(answerInput.value);	
	
	const userAnswer = answerInput.value.trim().toLowerCase();
	
	if (userAnswer === "") {
		result.textContent = "Not NO";
		result.className = "wrong";
		return;		
	};
	
	const selectedAgent = agents.find(function(agent){
		return agent.name === userAnswer;
	});
	
	if (!selectedAgent) {
		result.textContent = "Not NO";
		result.className = "wrong";	
		return;
	};
	
	
	
	
	if (selectedAgent.name === correctAnswer.name) {
		attempts.textContent = attempts.textContent + "\n" + selectedAgent.name + " | role:" + selectedAgent.role + " | element:" + selectedAgent.element + " | OKEY";
		result.textContent = " парвыельно " + selectedAgent.name;
		result.className = "correct";
	} else {
		let message = selectedAgent.name;
		let attemptsText = selectedAgent.name;
		
		
		
		if (selectedAgent.role === correctAnswer.role){
			message = message + "| Роль совпадает ";
			attemptsText = attemptsText + "| role: " + selectedAgent.role;
		} else {
			message = message + "| Роль не совпадает ";
			attemptsText = attemptsText + "| role: " + selectedAgent.role;
		};
		
		
		
		if ( selectedAgent.element === correctAnswer.element) {
			message = message + "| Элемент совпадает ";
			attemptsText = attemptsText + "| element: " + selectedAgent.element;
			
		} else {
			message = message + "| Элемент не совпадает " ;
			attemptsText = attemptsText + "| element: " + selectedAgent.element;
		};
		attempts.textContent = attempts.textContent + "\n" + attemptsText;
		result.textContent = message;
		result.className = "wrong";
		
		
	} ;
	
	
	
});

// 3. Когда нажали — вывести сообщение