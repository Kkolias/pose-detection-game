export function drawLine(ctx, kp1, kp2) {
  ctx.beginPath();
  ctx.moveTo(kp1.x, kp1.y);
  ctx.lineTo(kp2.x, kp2.y);
  ctx.stroke();
}
