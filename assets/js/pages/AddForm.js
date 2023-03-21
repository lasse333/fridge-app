import {
  changeUrlPath,
  createElement,
  createImageFromArrayBuffer,
} from "../FastHTML.js";

export default function AddForm(image) {
  let imageData = image;
  let imageElement = createImageFromArrayBuffer(image);

  return createElement("div", { class: "form-body" }, [
    createElement(
      "button",
      {
        class: "picture-button",
        onclick: function () {
          changeUrlPath("/add");
        },
      },
      [imageElement]
    ),
    createElement("label", { for: "name", innerText: "Name:" }),
    createElement("input", { id: "name" }),
  ]);
}
