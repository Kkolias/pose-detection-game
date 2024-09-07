import { setRandomButtonLocation } from "./setRandomButtonLocation";

export function startGame() {
  // set start button to hidden
  setActionButtonVisible();
  hideFinalResult();
  hideStartButton();
  // set score to 0
  const scoreElement = document.getElementById("score-number");
  scoreElement.innerText = "0";

  // set random button location
  setRandomButtonLocation();

  let timeLeft = 15;
  const timerElement = document.getElementById("time-left");
  timerElement.innerText = timeLeft;

  const timer = setInterval(() => {
    timeLeft -= 1;
    timerElement.innerText = timeLeft;
    if (timeLeft <= 0) {
      makeStartButtonUnClickable();
      clearInterval(timer);
      showStartButton();
      showFinalResult();
      setActionButtonHidden();

      setTimeout(() => {
        makeStartButtonClickable();
      }, 2000);
      //   alert("Game over!");
    }
  }, 1000);
}

function makeStartButtonUnClickable() {
  document.getElementById("start-button").onclick = () => {};
}

function makeStartButtonClickable() {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
}

function setActionButtonVisible() {
  const actionButton = document.getElementById("action-button");
  actionButton.style.display = "block";
}

function setActionButtonHidden() {
  const actionButton = document.getElementById("action-button");
  actionButton.style.display = "none";
}

function hideStartButton() {
  const startButton = document.getElementById("start-button");
  startButton.style.display = "none";
}

function showStartButton() {
  const startButton = document.getElementById("start-button");
  startButton.style.display = "block";
}

function showFinalResult() {
  const scoreElement = document.getElementById("score-number");
  const finalScoreElement = document.getElementById("final-score");
  finalScoreElement.style.display = "block";

  const finalScoreNumber = document.getElementById("final-score-number");
  finalScoreNumber.innerText = scoreElement.innerText;
}

function hideFinalResult() {
  const finalScoreElement = document.getElementById("final-score");
  finalScoreElement.style.display = "none";
}
