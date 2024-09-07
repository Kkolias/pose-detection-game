const VIDEO_SIZE = {
  "480 x 640": { width: 900, height: 900 },
  "900 x 950": { width: 900, height: 950 },
  "640 X 480": { width: 640, height: 480 },
  "640 X 360": { width: 640, height: 360 },
  "360 X 270": { width: 360, height: 270 },
};

export class Camera {
  constructor() {
    this.video = document.getElementById("video");
  }

  static async setup(cameraParam) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
    }

    const { targetFPS, sizeOption } = cameraParam;
    const $size = VIDEO_SIZE[sizeOption];
    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        // Only setting the video to a specified size for large screen, on
        // mobile devices accept the default size.
        width: $size.width,
        height: $size.height,
        frameRate: {
          ideal: targetFPS,
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    const camera = new Camera();
    camera.video.srcObject = stream;

    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(video);
      };
    });

    camera.video.play();

    // set video width and height to the canvas-wrapper size

    const canvasContainer = document.querySelector(".canvas-wrapper");
    const canvasWidth = canvasContainer.clientWidth;
    const canvasHeight = canvasContainer.clientHeight;

    camera.video.width = canvasWidth;
    camera.video.height = canvasHeight;

    // const videoWidth = camera.video.videoWidth;
    // const videoHeight = camera.video.videoHeight;

    // // Must set below two lines, otherwise video element doesn't show.
    // camera.video.width = videoWidth;
    // camera.video.height = videoHeight;

    // const canvasContainer = document.querySelector(".canvas-wrapper");
    // canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;

    return camera;
  }
}
