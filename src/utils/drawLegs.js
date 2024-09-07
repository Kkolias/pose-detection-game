import { drawLine } from "./drawLine";
import { notUnvantedConnection } from "./notUnvantedConnection";
import * as poseDetection from "@tensorflow-models/pose-detection";

export function drawLegs(keypoints, ctx) {
  ctx.strokeStyle = "#5c7ffc";
  ctx.lineWidth = 40;

  const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );

  adjacentKeyPoints.forEach(([i, j]) => {
    let kp1 = keypoints[i];
    let kp2 = keypoints[j];

    // Draw only arms and legs, avoid drawing the torso
    const relevantParts = [
      "left_knee",
      "right_knee",
      "left_ankle",
      "right_ankle",
      "left_hip",
      "right_hip",
    ];

    if (
      kp1.score > 0.5 &&
      kp2.score > 0.5 &&
      relevantParts.includes(kp1.name) &&
      relevantParts.includes(kp2.name) &&
      notUnvantedConnection(kp1.name, kp2.name)
    ) {
      drawLine(ctx, kp1, kp2);
    }
  });
}
