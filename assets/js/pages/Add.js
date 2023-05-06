import Camera from "../components/Camera.js";
import { createElement } from "../FastHTML.js";
import AddStyle from "../../css/add.css" assert { type: "css" };

export default async function Add() {
  let camera = new Camera({
    video: { width: 200, height: 200, facingMode: "environment" },
  });
  let cameraPopup = createElement("dialog", { class: "cameraOverlay" }, [
    camera.videoElement,
    createElement("button", {
      innerText: "Take Picture",
      onclick: async function () {
        console.log(await camera.takePicture());
        camera.stopCamera();
        cameraPopup.close();
      },
    }),
  ]);

  return createElement("main", { style: AddStyle }, [
    createElement("button", {
      innerText: "startCamera",
      onclick: function () {
        camera.startCamera();
        cameraPopup.showModal();
      },
    }),
    cameraPopup,
  ]);
}
//hello
