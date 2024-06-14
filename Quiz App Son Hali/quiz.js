const quizData = [
    {
        "id": 1,
        "text": "Which type of JavaScript language is",
        "answers": [
            { "id": 1, "text": "Object-Oriented", "isCorrect": false },
            { "id": 2, "text": "Object-Based", "isCorrect": true },
            { "id": 3, "text": "Assembly-language", "isCorrect": false },
            { "id": 4, "text": "High-level", "isCorrect": false }
        ]
    },
    {
        "id": 2,
        "text": "Which one of the following also known as Conditional Expression",
        "answers": [
            { "id": 1, "text": "Alternative to if-else", "isCorrect": false },
            { "id": 2, "text": "Switch statement", "isCorrect": false },
            { "id": 3, "text": "If-then-else statement", "isCorrect": false },
            { "id": 4, "text": "Immediate if", "isCorrect": true }
        ]
    },
    {
        "id": 3,
        "text": "The 'function' and 'var' are known as:",
        "answers": [
            { "id": 1, "text": "Keywords", "isCorrect": false },
            { "id": 2, "text": "Data types", "isCorrect": false },
            { "id": 3, "text": "Declaration statements", "isCorrect": true },
            { "id": 4, "text": "Prototypes", "isCorrect": false }
        ]
    },
    {
        "id": 4,
        "text": "Which of the following variables takes precedence over the others if the names are the same?",
        "answers": [
            { "id": 1, "text": "Global variable", "isCorrect": false },
            { "id": 2, "text": "The local element", "isCorrect": true },
            { "id": 3, "text": "The two of the above", "isCorrect": false },
            { "id": 4, "text": "None of the above", "isCorrect": false }
        ]
    },
    {
        "id": 5,
        "text": "In JavaScript, which one of the following is not considered as an error:",
        "answers": [
            { "id": 1, "text": "Syntax error", "isCorrect": false },
            { "id": 2, "text": "Missing of semicolons", "isCorrect": false },
            { "id": 3, "text": "Division by zero", "isCorrect": true },
            { "id": 4, "text": "Missing of Bracket", "isCorrect": false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 20; // Her soru için 30 saniye limit

const quizOrderElement = document.getElementById('quizOrder');
const questionBodyElement = document.querySelector('.question__body');
const quizProgressElement = document.querySelector('.quiz__progress');
const quizNextButton = document.querySelector('.quiz__next-btn');
const quizModalElement = document.querySelector('.quiz__modal');
const quizModalTextElement = document.querySelector('.modal__text');
const quizModalClose = document.querySelector('.modal__close');
const quizModalButton = document.querySelector('.quiz__btn');
const timerElement = document.createElement('div');
timerElement.id = 'timer';
timerElement.className = 'timer';

function loadQuestion() {
    clearInterval(timer); // Önceki zamanlayıcıyı temizle
    startTimer();

    const currentQuestion = quizData[currentQuestionIndex];
    questionBodyElement.innerHTML = `
        <div>
            <h1>${currentQuestion.id} - ${currentQuestion.text}</h1>
        </div>
        <div class="qustion__answers">
            ${currentQuestion.answers.map((answer, index) => `
                <div class="question__answer" data-answer-index="${index}" data-is-correct="${answer.isCorrect}">
                    <div class="choice">${String.fromCharCode(65 + index)}</div>
                    <div class="text">${answer.text}</div>
                </div>
            `).join('')}
        </div>
    `;

    questionBodyElement.appendChild(timerElement); // Timer'ı ekle
    quizOrderElement.textContent = `${currentQuestionIndex + 1}/${quizData.length}`;
    quizProgressElement.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;

    document.querySelectorAll('.question__answer').forEach(answerElement => {
        answerElement.addEventListener('click', () => {
            clearInterval(timer); // Kullanıcı cevapladığında zamanlayıcıyı durdur
            checkAnswer(answerElement.dataset.answerIndex, answerElement);
        });
    });
}

function startTimer() {
    let timeLeft = timeLimit;
    timerElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null, null); // Süre dolduğunda yanlış cevap işlemi yap
        }
    }, 1000);
}

function checkAnswer(selectedIndex, selectedElement) {
    const currentQuestion = quizData[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.answers.findIndex(answer => answer.isCorrect);
    
    if (selectedIndex !== null && currentQuestion.answers[selectedIndex].isCorrect) {
        score++;
        selectedElement.classList.add('correct-answer');
    } else {
        // Cevap verilmediğinde veya yanlış cevap verildiğinde
        if (selectedElement) {
            selectedElement.classList.add('incorrect-answer');
        }
        document.querySelectorAll('.question__answer')[correctAnswerIndex].classList.add('correct-answer');
    }

    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        setTimeout(loadQuestion, 1500); // 1.5 saniye bekleyip sonraki soruya geç
    } else {
        setTimeout(showResults, 1500); // 1.5 saniye bekleyip sonuçları göster
    }
}

function showResults() {
    quizModalElement.style.display = 'flex';
    quizModalTextElement.innerHTML = `Congrats, you have <span id="totalCorrectChoice">${score}</span> correct choices.`;
}

quizNextButton.addEventListener('click', () => {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
});

quizModalClose.addEventListener('click', () => {
    quizModalElement.style.display = 'none';
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
});

quizModalButton.addEventListener('click', () => {
    quizModalElement.style.display = 'none';
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
});

quizModalElement.style.display = 'none';
loadQuestion();