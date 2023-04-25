export async function hasCamera() {
  return (
    (await navigator.mediaDevices.enumerateDevices()).filter((device) => {
      if (device.kind == "videoinput") {
        return device;
      }
    }).length > 0
  );
}

export default class Camera {
  constructor(
    constraints = { video: true },
    videoElement = document.createElement("video")
  ) {
    this.videoElement = videoElement;
    this.constraints = constraints;
    this.recorder = null;
    this.running = false;
    this.onFrame = null;
  }

  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.videoElement.srcObject = stream;
    await this.videoElement.play();
    const canvas = document.createElement("canvas");
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const context = canvas.getContext("2d");
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (event) => {
      if (this.running) {
        context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        this.onFrame(canvas.toDataURL("image/jpeg"));
      }
    };
    this.recorder.start();
    this.running = true;
  }

  stopCamera() {
    this.running = false;
    if (this.recorder && this.recorder.state !== "inactive") {
      this.recorder.stop();
      this.recorder = null;
    }
    if (this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }
  }

  async takePicture() {
    const canvas = document.createElement("canvas");
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );
    const arrayBuffer = await new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.readAsArrayBuffer(blob);
    });
    return arrayBuffer;
  }
}

export class BarcodeScanner {
  constructor(videoElement, codeType) {
    this.videoElement = videoElement;
    this.canvas = new OffscreenCanvas(1, 1);
    this.ctx = this.canvas.getContext("2d");
    if ("BarcodeDetector" in window) {
      this.barcodeDetector = new BarcodeDetector({ formats: [codeType] });
    }
    this.running = false;
    this.onScan = function (code) {
      console.log("Detected barcode: " + code);
    };
  }

  start() {
    if (!("barcodeDetector" in window)) {
      return;
    }
    if (this.running) {
      return;
    }
    this.running = true;
    requestAnimationFrame(this.captureFrame.bind(this));
  }

  stop() {
    this.running = false;
  }

  captureFrame() {
    if (!this.running) {
      return;
    }
    const videoWidth = this.videoElement.videoWidth;
    const videoHeight = this.videoElement.videoHeight;
    this.canvas.width = videoWidth;
    this.canvas.height = videoHeight;
    this.ctx.drawImage(this.videoElement, 0, 0, videoWidth, videoHeight);
    const imageData = this.ctx.getImageData(0, 0, videoWidth, videoHeight);
    this.barcodeDetector
      .detect(imageData)
      .then((barcodes) => {
        if (this.running && barcodes.length > 0) {
          // Barcode detected
          const code = barcodes[0].rawValue;
          this.onScan(code);
        }
      })
      .finally(() => {
        requestAnimationFrame(this.captureFrame.bind(this));
      });
  }
}
