document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-quiz");
  const nxtBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-quiz");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choiceList = document.getElementById("options-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");

  let questions = [];
  let questionIdx = 0;
  let score = 0;

  // ✅ Fetch from Open Trivia API
  async function fetchQuestions() {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
    );
    const data = await res.json();
    return data.results.map(formatQuestion);
  }

  // ✅ Format and decode HTML
  function formatQuestion(item) {
    const choices = [...item.incorrect_answers];
    const correctIndex = Math.floor(Math.random() * (choices.length + 1));
    choices.splice(correctIndex, 0, item.correct_answer);

    return {
      question: decodeHTML(item.question),
      choices: choices.map(decodeHTML),
      answer: decodeHTML(item.correct_answer),
    };
  }

  // ✅ Decode HTML entities
  function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  startBtn.addEventListener("click", async () => {
    startBtn.classList.add("hidden");
    questions = await fetchQuestions();
    questionIdx = 0;
    score = 0;
    questionContainer.classList.remove("hidden");
    showQuestion();
  });

  nxtBtn.addEventListener("click", () => {
    questionIdx++;
    if (questionIdx < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  function showQuestion() {
    nxtBtn.classList.add("hidden");
    const currentQuestion = questions[questionIdx];
    questionText.textContent = "Q. " + currentQuestion.question;
    choiceList.innerHTML = "";

    currentQuestion.choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;
      li.classList.add("highlight");
      li.addEventListener("click", () =>
        selectAnswer(choice, currentQuestion.answer)
      );
      choiceList.appendChild(li);
    });
  }

  function selectAnswer(selected, correct) {
    // Disable all options after selection
    Array.from(choiceList.children).forEach((li) => {
      li.style.pointerEvents = "none";
      if (li.textContent === correct) {
        li.style.backgroundColor = "#c8f7c5"; // green
        li.style.borderColor = "#2ecc71";
      } else if (li.textContent === selected) {
        li.style.backgroundColor = "#f7c5c5"; // red
        li.style.borderColor = "#e74c3c";
      }
    });

    if (selected === correct) {
      score++;
    }

    nxtBtn.classList.remove("hidden");
  }

  function showResult() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreDisplay.textContent = `${score} out of ${questions.length}`;
  }

  restartBtn.addEventListener("click", () => {
    resultContainer.classList.add("hidden");
    startBtn.classList.remove("hidden");
  });
});
