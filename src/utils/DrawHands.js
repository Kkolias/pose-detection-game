import { drawLine } from "./drawLine";
import { notUnvantedConnection } from "./notUnvantedConnection";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { getCanvasWidth } from "./getCanvasWidth";

const shoulderOffset = 50; // Adjust this value as needed

export function drawHands(keypoints, ctx) {
  ctx.strokeStyle = "#5c7ffc";
  ctx.lineWidth = 40;
  const canvasWidth = getCanvasWidth();

  const actionButton = document.getElementById("action-button");
  const startButton = document.getElementById("start-button");

  const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );

  adjacentKeyPoints.forEach(([i, j]) => {
    let kp1 = keypoints[i];
    let kp2 = keypoints[j];

    if (kp1.name === "left_shoulder" || kp1.name === "right_shoulder") {
      kp1 = { ...kp1, y: kp1.y + shoulderOffset };
    }
    if (kp2.name === "left_shoulder" || kp2.name === "right_shoulder") {
      kp2 = { ...kp2, y: kp2.y + shoulderOffset };
    }

    // Draw only arms and legs, avoid drawing the torso
    const relevantParts = [
      "left_shoulder",
      "right_shoulder",
      "left_elbow",
      "right_elbow",
      "left_wrist",
      "right_wrist",
    ];

    if (
      kp1.score > 0.4 &&
      kp2.score > 0.4 &&
      relevantParts.includes(kp1.name) &&
      relevantParts.includes(kp2.name) &&
      notUnvantedConnection(kp1.name, kp2.name)
    ) {
      drawLine(ctx, kp1, kp2);

      if (isLeftHand(kp1, kp2)) {
        const leftWrist = getLeftWrist([kp1, kp2]);
        if (isNearButton(actionButton, leftWrist, canvasWidth)) {
          handleButtonClick("left"); // Simulate button click
        }
        if (isNearButton(startButton, leftWrist, canvasWidth)) {
          handleStartButtonClick(); // Start the game
        }
      }
      if (isRightHand(kp1, kp2)) {
        const rightWrist = getRightWrist([kp1, kp2]);
        if (isNearButton(actionButton, rightWrist, canvasWidth)) {
          handleButtonClick("right"); // Simulate button click
        }
        if (isNearButton(startButton, rightWrist, canvasWidth)) {
          handleStartButtonClick(); // Start the game
        }
      }
    }
  });
}

function handleButtonClick(hand) {
  const button = document.getElementById("action-button");
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  // Add the hand prop to the event
  event.hand = hand;

  // Dispatch the custom event on the button
  button.dispatchEvent(event);
}

function handleStartButtonClick() {
  const button = document.getElementById("start-button");
  button.click();
}

function getLeftWrist(keypoints) {
  return keypoints.find((kp) => kp.name === "left_wrist");
}

function isLeftHand(keyPoint1, keyPoint2) {
  return keyPoint1.name === "left_wrist" || keyPoint2.name === "left_wrist";
}

function getRightWrist(keypoints) {
  return keypoints.find((kp) => kp.name === "right_wrist");
}

function isRightHand(keyPoint1, keyPoint2) {
  return keyPoint1.name === "right_wrist" || keyPoint2.name === "right_wrist";
}

function isNearButton(button, wrist, canvasWidth, threshold = 50) {
  const buttonRect = button.getBoundingClientRect();

  const y = wrist.y;
  const x = correctMirroredX(wrist.x, canvasWidth);

  const distX = x - (buttonRect.left + buttonRect.width / 2);
  const distY = y - (buttonRect.top + buttonRect.height / 2);

  const xOffset = 0;
  const yOffset = 0;

  const correctedDistX = distX + xOffset;
  const correctedDistY = distY + yOffset;
  const distXPositive = Math.abs(correctedDistX);
  const distYPositive = Math.abs(correctedDistY);

  return distXPositive < threshold && distYPositive < threshold;
}

function correctMirroredX(x, canvasWidth) {
  return canvasWidth - x;
}
