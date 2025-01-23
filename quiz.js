import { quizData } from './quizData.js';

const quiz = document.getElementById("quiz");
const nextBtn = document.getElementById("next");
const scoreContainer = document.getElementById("score-container");
const scoreDisplay = document.getElementById("score");

let userAnswers = [];
let currentQuestionIndex = 0;

// Retrieve the stored data (if any)
const storedData = JSON.parse(localStorage.getItem('quizState'));
if (storedData) {
    currentQuestionIndex = storedData.questionIndex || 0;
    userAnswers = storedData.userAnswers || [];
}

function renderQuestion(index) {
    const question = quizData[index];
    quiz.innerHTML = `
        <div class="question">
            <h3>${index + 1}. ${question.question}</h3>
            <div class="options">
                ${question.options.map((option, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${i}">
                        <span class="alphabet">${String.fromCharCode(65 + i)}</span> ${option}
                    </label><br>
                `).join('')}
            </div>
        </div>
    `;
    nextBtn.disabled = true; // Disable next button until an option is selected
    attachRadioListeners(index); // Attach listeners after rendering question
}

function attachRadioListeners(index) {
    const radioButtons = document.querySelectorAll(`input[name="q${index}"]`);
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
            disableOptions(); // Disable all options once an answer is selected
            showFeedback(event.target, index); // Show feedback (green or red)
            saveAnswer(event.target); // Save the selected answer
        });
    });
}

function disableOptions() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.disabled = true; // Disable all radio buttons
    });
}

function showFeedback(selectedRadio, index) {
    const allLabels = document.querySelectorAll(`label`);
    allLabels.forEach(label => {
        label.style.backgroundColor = '';  // Reset background color
        label.style.color = '';           // Reset text color
    });

    const selectedLabel = selectedRadio.parentElement;
    const correctOptionIndex = quizData[index].correct;

    // If selected answer is correct
    if (parseInt(selectedRadio.value) === correctOptionIndex) {
        selectedLabel.style.backgroundColor = 'green'; // Correct answer color
    } else {
        selectedLabel.style.backgroundColor = 'red'; // Wrong answer color
        // Highlight correct answer in green
        const correctLabel = document.querySelectorAll(`input[name="q${index}"]`)[correctOptionIndex].parentElement;
        correctLabel.style.backgroundColor = 'green';
    }

    nextBtn.disabled = false; // Enable next button after selection and feedback
}

function saveAnswer(selectedRadio) {
    userAnswers[currentQuestionIndex] = parseInt(selectedRadio.value);
}

function moveToNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    } else {
        const score = calculateScore();
        scoreDisplay.textContent = `${score} / ${quizData.length}`;
        scoreContainer.style.display = "block";
        quiz.style.display = "none"; // Hide quiz after completion
        nextBtn.disabled = true; // Disable next after quiz is completed
    }

    // Save state to localStorage after moving to the next question
    localStorage.setItem('quizState', JSON.stringify({
        questionIndex: currentQuestionIndex,
        userAnswers: userAnswers
    }));
}

function calculateScore() {
    let score = 0;
    quizData.forEach((q, index) => {
        if (userAnswers[index] === q.correct) {
            score++;
        }
    });
    return score;
}

nextBtn.addEventListener("click", () => {
    moveToNextQuestion();
});

// Initialize Quiz
renderQuestion(currentQuestionIndex);
