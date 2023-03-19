import Camera from "../components/Camera.js";
import { addChildren, clearChildren, createElement } from "../FastHTML.js";
import AddStyle from "../../css/add.css" assert { type: "css" };
import AddForm from "./AddForm.js";

export default async function Add() {
  if (
    (await navigator.mediaDevices.enumerateDevices()).filter((device) => {
      if (device.kind == "videoinput") {
        return device;
      }
    }).length <= 0
  ) {
    return createElement("main", { style: AddStyle }, [
      createElement("div", {}, [
        createElement("h2", {
          innerText: "A Camera is needed for this operation",
        }),
      ]),
    ]);
  }

  let camera = new Camera({
    video: { width: 200, height: 200, facingMode: "environment" },
  });

  camera.startCamera();

  let page = createElement("main", { style: AddStyle }, [
    createElement("div", {}, [
      camera.videoElement,
      createElement("button", {
        innerText: "Take Picture",
        onclick: async function () {
          clearChildren(page);
          addChildren(page, AddForm(await camera.takePicture()));
          camera.stopCamera();
        },
      }),
    ]),
  ]);

  return page;
}
