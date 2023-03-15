import Camera from "../components/Camera.js";
import { createElement } from "../FastHTML.js";

export default async function Add() {
  if (
    (await navigator.mediaDevices.enumerateDevices()).filter((device) => {
      if (device.kind == "videoinput") {
        return device;
      }
    }).length <= 0
  ) {
    return createElement("main", {}, [
      createElement("h1", {
        innerText: "A Camera is needed for this operation",
      }),
    ]);
  }

  let camera = new Camera({
    video: { width: 200, height: 200, facingMode: "environment" },
  });

  camera.startCamera();

  return createElement("main", {}, [camera.videoElement]);
}
