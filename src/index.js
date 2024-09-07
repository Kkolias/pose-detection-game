import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { Camera } from "./camera";
import { Smoothing } from "./smoothing";

import torsoImage from "./bodyParts/torso.svg";
import headImage from "./bodyParts/head.svg";
import { drawHands } from "./utils/DrawHands";
import { drawLegs } from "./utils/drawLegs";
import { setRandomButtonLocation } from "./utils/setRandomButtonLocation";
import { handleUpdateScore } from "./utils/handleUpdateScore";
import { startGame } from "./utils/startGame";

async function loadModel() {
  const model = poseDetection.SupportedModels.MoveNet;
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };
  return await poseDetection.createDetector(model, detectorConfig);
}

function drawHead(ctx, headImage, keypoints) {
  const leftEar = keypoints.find((kp) => kp.name === "left_ear");
  const rightEar = keypoints.find((kp) => kp.name === "right_ear");
  const nose = keypoints.find((kp) => kp.name === "nose");
  const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
  const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");

  if (leftEar && rightEar && nose && leftShoulder && rightShoulder) {
    // Calculate the center of the head (midpoint between the ears)
    let headCenterX = (leftEar.x + rightEar.x) / 2;
    let headCenterY = (leftEar.y + rightEar.y) / 2;

    // Calculate the torso center (midpoint between the shoulders)
    const torsoCenterX = (leftShoulder.x + rightShoulder.x) / 2;
    const torsoCenterY = (leftShoulder.y + rightShoulder.y) / 2;

    // Set a maximum allowable distance between the head and the torso
    const maxDistance = 90; // Adjust this value as needed

    // Calculate the distance between the head center and the torso center
    const dx = headCenterX - torsoCenterX;
    const dy = headCenterY - torsoCenterY;
    const distance = Math.hypot(dx, dy);

    // If the distance exceeds the maximum, constrain the head position
    if (distance > maxDistance) {
      const scalingFactor = maxDistance / distance;
      headCenterX = torsoCenterX + dx * scalingFactor;
      headCenterY = torsoCenterY + dy * scalingFactor;
    }

    // Calculate the angle of rotation for the head
    const angle = Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x);
    // head is upside down so we need to rotate it 180 degrees
    const correctedAngle = angle + Math.PI;

    // Calculate the size of the head based on the distance between the ears
    const headWidth = Math.hypot(
      rightEar.x - leftEar.x,
      rightEar.y - leftEar.y
    );
    const headHeight = headWidth * (headImage.height / headImage.width); // Maintain aspect ratio

    // Save the context state
    ctx.save();

    // Move to the center of the head
    ctx.translate(headCenterX, headCenterY);

    // Rotate the context to match the head angle
    ctx.rotate(correctedAngle);

    // Draw the head image centered on the calculated position
    ctx.drawImage(
      headImage,
      -headWidth / 2,
      -headHeight / 2,
      headWidth,
      headHeight
    );

    // Restore the context state
    ctx.restore();
  }
}

function getCanvasWidth() {
  // by id output
  // width in px
  return document.getElementById("output").width;
}

function getCanvasHeight() {
  // by id output
  return document.getElementById("output").height;
}

const images = {
  head: new Image(),
  torso: new Image(),
};

images.head.src = headImage;
images.torso.src = torsoImage;

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function drawUpperBodyImage(keypoints, ctx) {
  const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
  const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
  const leftHip = keypoints.find((kp) => kp.name === "left_hip");
  const rightHip = keypoints.find((kp) => kp.name === "right_hip");

  if (leftShoulder && rightShoulder && leftHip && rightHip) {
    const torsoCenterX =
      (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
    const torsoCenterY =
      (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;

    const torsoWidth = Math.hypot(
      rightShoulder.x - leftShoulder.x,
      rightShoulder.y - leftShoulder.y
    );
    const torsoHeight = Math.hypot(
      leftHip.y - leftShoulder.y,
      leftHip.x - leftShoulder.x
    );

    ctx.save();

    ctx.translate(torsoCenterX, torsoCenterY);

    const angle = degreesToRadians(0);
    ctx.rotate(angle);

    ctx.drawImage(
      images.torso,
      -torsoWidth / 2,
      -torsoHeight / 2,
      torsoWidth,
      torsoHeight
    );

    ctx.restore();
  }
}

const smoothing = new Smoothing(0.5); // Adjust alpha for more or less smoothing

async function detectPose(canvas, detector, camera, ctx) {
  const poses = await detector.estimatePoses(camera.video);

  const canvasWidth = getCanvasWidth();
  const canvasHeight = getCanvasHeight();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  poses.forEach((pose) => {
    const smoothedKeypoints = smoothing.smooth(pose.keypoints);

    drawHead(ctx, images.head, smoothedKeypoints); // Draw the head
    drawUpperBodyImage(smoothedKeypoints, ctx); // Draw the upper body with an image
    // drawThickerSkeleton(smoothedKeypoints, ctx); // Draw arms and legs
    drawLegs(smoothedKeypoints, ctx); // Draw legs
    drawHands(smoothedKeypoints, ctx); // Draw hands
  });

  requestAnimationFrame(() => detectPose(canvas, detector, camera, ctx));
}

function setShowVideoCheckbox() {
  const showVideoCheckbox = document.getElementById("show-video-btn");
  showVideoCheckbox.onchange = (event) => {
    const video = document.getElementById("video");
    video.style.display = event.target.checked ? "block" : "none";
  };
}

async function app() {
  await tf.ready();

  setShowVideoCheckbox();
  document.getElementById("loading-indicator").innerHTML = "Ladataan mallia...";

  //   setRandomButtonLocation();
  document.getElementById("action-button").onclick = (event) => {
    const hand = event.hand;
    handleUpdateScore(hand);
    setRandomButtonLocation();
  };
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
  const cameraSettings = {
    targetFPS: 30,
    sizeOption: "480 x 640",
  };

  const camera = await Camera.setup(cameraSettings);

  const canvas = document.getElementById("output");
  const ctx = canvas.getContext("2d");

  canvas.width = camera.video.width;
  canvas.height = camera.video.height;

  const detector = await loadModel();

  document.getElementById("loading-indicator").innerHTML =
    "alustetaan mallia...";

  document.getElementById("loading-indicator").style.display = "none";

  detectPose(canvas, detector, camera, ctx);
}

app();
