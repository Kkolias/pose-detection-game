import foreArmImage from "../bodyParts/foreArm.svg";
import upperArmImage from "../bodyParts/upperArm.svg";
import legPartImage from "../bodyParts/legPart.svg";

const images = {
    upperArm: new Image(),
    forearm: new Image(),
    thigh: new Image(),
    calf: new Image(),
  };
  
  images.upperArm.src = upperArmImage;
  images.forearm.src = foreArmImage;
  images.thigh.src = legPartImage;
  images.calf.src = legPartImage;


function drawSegment(ctx, image, x1, y1, x2, y2) {
    // Calculate the distance between the points
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
  
    // Calculate the angle of the segment
    const angle = Math.atan2(dy, dx);
  
    // Save the context state
    ctx.save();
  
    // Move to the starting point
    ctx.translate(x1, y1);
  
    // Rotate the context
    ctx.rotate(angle);
  
    // Draw the image
    ctx.drawImage(image, 0, 0, length, image.height);
  
    // Restore the context state
    ctx.restore();
  }
  
  // V3 !!!!!
  function isPointVisible(x, y, canvasWidth, canvasHeight) {
    return x >= 0.5 && x <= canvasWidth && y >= 0.5 && y <= canvasHeight;
  }
  
  // Function to draw a segment only if both points are visible
  function drawVisibleSegment(
    ctx,
    image,
    x1,
    y1,
    x2,
    y2,
    canvasWidth,
    canvasHeight
  ) {
    if (
      isPointVisible(x1, y1, canvasWidth, canvasHeight) &&
      isPointVisible(x2, y2, canvasWidth, canvasHeight)
    ) {
      drawSegment(ctx, image, x1, y1, x2, y2);
    }
  }
  
  // Updated function to draw the skeleton with visibility check
  export function drawThickerSkeleton(keypoints, ctx, canvasWidth, canvasHeight) {
    // Draw upper arms
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
  
    if (leftShoulder && leftElbow) {
      drawVisibleSegment(
        ctx,
        images.upperArm,
        leftShoulder.x,
        leftShoulder.y,
        leftElbow.x,
        leftElbow.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    if (rightShoulder && rightElbow) {
      drawVisibleSegment(
        ctx,
        images.upperArm,
        rightShoulder.x,
        rightShoulder.y,
        rightElbow.x,
        rightElbow.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    // Draw forearms
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");
  
    if (leftElbow && leftWrist) {
      drawVisibleSegment(
        ctx,
        images.forearm,
        leftElbow.x,
        leftElbow.y,
        leftWrist.x,
        leftWrist.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    if (rightElbow && rightWrist) {
      drawVisibleSegment(
        ctx,
        images.forearm,
        rightElbow.x,
        rightElbow.y,
        rightWrist.x,
        rightWrist.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    // Draw thighs
    const leftHip = keypoints.find((kp) => kp.name === "left_hip");
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee");
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee");
  
    if (leftHip && leftKnee) {
      drawVisibleSegment(
        ctx,
        images.thigh,
        leftHip.x,
        leftHip.y,
        leftKnee.x,
        leftKnee.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    if (rightHip && rightKnee) {
      drawVisibleSegment(
        ctx,
        images.thigh,
        rightHip.x,
        rightHip.y,
        rightKnee.x,
        rightKnee.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    // Draw calves
    const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle");
    const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle");
  
    if (leftKnee && leftAnkle) {
      drawVisibleSegment(
        ctx,
        images.calf,
        leftKnee.x,
        leftKnee.y,
        leftAnkle.x,
        leftAnkle.y,
        canvasWidth,
        canvasHeight
      );
    }
  
    if (rightKnee && rightAnkle) {
      drawVisibleSegment(
        ctx,
        images.calf,
        rightKnee.x,
        rightKnee.y,
        rightAnkle.x,
        rightAnkle.y,
        canvasWidth,
        canvasHeight
      );
    }
  }