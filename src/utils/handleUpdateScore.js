export function handleUpdateScore(inputHand) {
  if (isCorrectHand(inputHand)) {
    increaseScore();
  } else {
    decreaseScore();
  }
}

function isCorrectHand(inputHand) {
  const handClass =
    inputHand === "left" ? "left-hand-button" : "right-hand-button";

  const button = document.getElementById("action-button");
  return button.classList.contains(handClass);
}

function increaseScore() {
  const scoreElement = document.getElementById("score-number");
  const currentScore = parseInt(scoreElement.innerText);
  scoreElement.innerText = currentScore + 1;
}

function decreaseScore() {
  const scoreElement = document.getElementById("score-number");
  const currentScore = parseInt(scoreElement.innerText);
  scoreElement.innerText = currentScore - 1;
}
