export class Smoothing {
    constructor(alpha = 0.5) {
      this.alpha = alpha;
      this.previousPoints = {};
    }
  
    smooth(keypoints) {
      const smoothed = keypoints.map(kp => {
        if (!this.previousPoints[kp.name]) {
          this.previousPoints[kp.name] = { x: kp.x, y: kp.y };
        }
        
        const smoothedX = this.alpha * kp.x + (1 - this.alpha) * this.previousPoints[kp.name].x;
        const smoothedY = this.alpha * kp.y + (1 - this.alpha) * this.previousPoints[kp.name].y;
        
        this.previousPoints[kp.name] = { x: smoothedX, y: smoothedY };
  
        return { ...kp, x: smoothedX, y: smoothedY };
      });
  
      return smoothed;
    }
  }