import { quizData } from './quizData.js';

const quiz = document.getElementById("quiz");
const saveBtn = document.getElementById("save");
const nextBtn = document.getElementById("next");
const scoreContainer = document.getElementById("score-container");
const scoreDisplay = document.getElementById("score");

let userAnswers = [];
let currentQuestionIndex = 0;

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
    saveBtn.disabled = false; // Enable save button
    attachRadioListeners(index); // Attach listeners after rendering question
}

function attachRadioListeners(index) {
    const radioButtons = document.querySelectorAll(`input[name="q${index}"]`);
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
            changeColorOnSelect(event.target);
            saveAnswer();
        });
    });
}

function changeColorOnSelect(selectedRadio) {
    // Remove previously selected colors
    const allLabels = document.querySelectorAll('label');
    allLabels.forEach(label => {
        label.style.backgroundColor = '';  // Reset background color
        label.style.color = '';           // Reset text color
    });

    const selectedLabel = selectedRadio.parentElement;
    selectedLabel.style.backgroundColor = '#007bff';  // Selected color
    selectedLabel.style.color = '#fff';                // Text color when selected
}

function saveAnswer() {
    const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        nextBtn.disabled = false; // Enable next button after answer is selected
    }
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

saveBtn.addEventListener("click", () => {
    saveAnswer();
});

nextBtn.addEventListener("click", () => {
    saveAnswer();

    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    } else {
        const score = calculateScore();
        scoreDisplay.textContent = `${score} / ${quizData.length}`;
        scoreContainer.style.display = "block";
        quiz.style.display = "none"; // Hide quiz after completion
        saveBtn.disabled = true; // Disable save after quiz is completed
        nextBtn.disabled = true; // Disable next after quiz is completed
    }
});

// Initialize Quiz
renderQuestion(currentQuestionIndex);
