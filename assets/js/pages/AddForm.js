import { createElement, createImageFromArrayBuffer } from "../FastHTML.js";

export default function AddForm(image) {
  console.log(image);
  return createElement("div", {}, [createImageFromArrayBuffer(image)]);
}
