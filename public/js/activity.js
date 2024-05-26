const questions = [
    {
        question: "Who is known as the King of Pop?",
        options: ["Michael Jackson", "Elvis Presley", "Freddie Mercury", "Prince"],
        answer: "Michael Jackson"
    },
    {
        question: "Which band released the album 'Dark Side of the Moon'?",
        options: ["Pink Floyd", "The Beatles", "Led Zeppelin", "Queen"],
        answer: "Pink Floyd"
    },
    {
        question: "Which artist is famous for the song 'Purple Rain'?",
        options: ["Prince", "David Bowie", "Jimi Hendrix", "Madonna"],
        answer: "Prince"
    },
    {
        question: "What is the name of the lead singer of U2?",
        options: ["Bono", "Sting", "Mick Jagger", "Axl Rose"],
        answer: "Bono"
    },
    {
        question: "Who sang the hit song 'Rolling in the Deep'?",
        options: ["Adele", "Beyoncé", "Taylor Swift", "Katy Perry"],
        answer: "Adele"
    },
    {
        question: "Which band is known for the song 'Hotel California'?",
        options: ["Eagles", "Fleetwood Mac", "The Doors", "The Rolling Stones"],
        answer: "Eagles"
    },
    {
        question: "Which artist released the album 'Thriller'?",
        options: ["Michael Jackson", "Prince", "Madonna", "Whitney Houston"],
        answer: "Michael Jackson"
    },
    {
        question: "Who is the lead singer of the rock band Queen?",
        options: ["Freddie Mercury", "Robert Plant", "Jim Morrison", "Steven Tyler"],
        answer: "Freddie Mercury"
    },
    {
        question: "Which pop star is known for her role on the TV show 'Hannah Montana'?",
        options: ["Miley Cyrus", "Selena Gomez", "Demi Lovato", "Ariana Grande"],
        answer: "Miley Cyrus"
    },
    {
        question: "Who is the artist behind the hit single 'Shape of You'?",
        options: ["Ed Sheeran", "Justin Bieber", "Shawn Mendes", "Bruno Mars"],
        answer: "Ed Sheeran"
    }
];

let currentQuestionIndex = 0;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    displayQuestion();
});

function displayQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];

        const questionCard = document.createElement('div');
        questionCard.classList.add('question-card');

        const questionText = document.createElement('p');
        questionText.textContent = questionData.question;
        questionCard.appendChild(questionText);

        questionData.options.forEach(option => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="option" value="${option}"> ${option}`;
            questionCard.appendChild(label);
            questionCard.appendChild(document.createElement('br'));
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = "Submit";
        submitButton.onclick = checkAnswer;
        questionCard.appendChild(submitButton);

        quizContainer.appendChild(questionCard);
    } else {
        showFinalResult();
    }
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const userAnswer = selectedOption.value;
        const questionData = questions[currentQuestionIndex];

        const resultDiv = document.getElementById('result');
        if (userAnswer === questionData.answer) {
            score++;
            resultDiv.innerHTML = `<div class="question-card correct">Correct! The answer is ${questionData.answer}</div>`;
        } else {
            resultDiv.innerHTML = `<div class="question-card incorrect">Wrong! The correct answer is ${questionData.answer}</div>`;
        }

        currentQuestionIndex++;
        setTimeout(() => {
            resultDiv.innerHTML = '';
            displayQuestion();
        }, 2000);
    } else {
        alert("Please select an option.");
    }
}

function showFinalResult() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `<div class="question-card final">You scored ${score} out of ${questions.length}</div>`;
}
