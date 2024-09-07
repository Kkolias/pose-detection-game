export function setRandomButtonLocation() {
  const button = document.getElementById("action-button");

  const windowHeight = window.innerHeight;
  const minYpx = 0;
  const maxYpx = windowHeight * 0.5;

  const randomYPx = Math.floor(Math.random() * (maxYpx - minYpx) + minYpx);
  button.style.top = `${randomYPx}px`;

//   const windowWidth = window.innerWidth;
  const maxXpx = 840;
  const minXpx = 60;

  const randomXPx = Math.floor(Math.random() * (maxXpx - minXpx) + minXpx);
  button.style.left = `${randomXPx}px`;

  // set new random color for the button
  //   const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  //   button.style.backgroundColor = `#${randomColor}`;

  setRandomHandStyle();
}

function setRandomHandStyle() {
  const random = Math.random();
  if (random > 0.5) {
    addLeftHandButtonClass();
  } else {
    addRightHandButtonClass();
  }
}

function addLeftHandButtonClass() {
  const button = document.getElementById("action-button");
  button.classList.remove("right-hand-button");
  button.classList.add("left-hand-button");
  button.innerHTML = "Vasen";
}

function addRightHandButtonClass() {
  const button = document.getElementById("action-button");
  button.classList.remove("left-hand-button");
  button.classList.add("right-hand-button");
  button.innerHTML = "Oikea";
}
