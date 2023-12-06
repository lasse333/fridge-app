import Camera from "../components/Camera.js";
import {
  createElement,
  createImageFromArrayBuffer,
  importCSS,
} from "../FastHTML.js";

export default async function Add() {
  let AddStyle = await importCSS(location.origin + "/assets/css/add.css");
  let camera = new Camera({
    video: { width: 200, height: 200, facingMode: "environment" },
  });

  let previewPicture = createElement("img", {
    src: "/assets/icons/Camera.svg",
  });
  let ImageData = new ArrayBuffer(0);

  async function takePicture() {
    ImageData = await camera.takePicture();

    previewPicture.src = createImageFromArrayBuffer(ImageData).src;
    console.log(ImageData);

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
      //Open camera, Show picture, take Picture
      createElement(
        "button",
        {
          class: "changePicture",
          onclick: function () {
            camera.startCamera();
            cameraPopup.showModal();
          },
        },
        [previewPicture],
      ),
      createElement("input", { placeholder: "Item name" }),
    ]),
    //Pop ups
    cameraPopup,
  ]);
}
