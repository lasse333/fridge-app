import Camera from "../components/Camera.js";
import { createElement } from "../FastHTML.js";
import AddStyle from "../../css/add.css" assert { type: "css" };

export default async function Add() {
  let camera = new Camera({
    video: { width: 200, height: 200, facingMode: "environment" },
  });

  let previewPicture = createElement("img", {
    src: "/assets/icons/Fridge.svg",
  });

  async function takePicture() {
    console.log(await camera.takePicture());
    camera.stopCamera();
    cameraPopup.close();
  }

  let cameraPopup = createElement("dialog", { class: "cameraOverlay" }, [
    createElement("div", { class: "cameraContainer" }, [
      createElement("button", { class: "cameraFeed", onclick: takePicture }, [
        camera.videoElement,
      ]),
      createElement("button", {
        innerText: "Take Picture",
        onclick: takePicture,
      }),
    ]),
  ]);

  return createElement("main", { style: AddStyle }, [
    createElement("div", { class: "pageContainer" }, [
      createElement(
        "button",
        {
          class: "changePicture",
          onclick: function () {
            camera.startCamera();
            cameraPopup.showModal();
          },
        },
        [previewPicture]
      ),
    ]),
    cameraPopup,
  ]);
}
