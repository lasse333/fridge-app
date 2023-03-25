import {
  changeUrlPath,
  createElement,
  createImageFromArrayBuffer,
} from "../FastHTML.js";

export default function AddForm(image) {
  let imageData = image;
  let imageElement = createImageFromArrayBuffer(image);
  let experationDateElement = createElement("input", {
    type: "hidden",
    required: false,
    name: "ExperationDate",
  });

  function saveInput(e) {
    let data = JSON.parse(window.sessionStorage.getItem("draft")) || {};

    data[e.target.id] = e.target.value;

    window.sessionStorage.setItem("draft", JSON.stringify(data));
  }

  function loadInput(key) {
    let data = JSON.parse(window.sessionStorage.getItem("draft"));
    if (!data) return "";
    if (!(key in data)) return "";
    return data[key];
  }

  let elements = [];

  elements.push(
    //Picture button
    createElement(
      "button",
      {
        class: "picture-button",
        onclick: function () {
          changeUrlPath("/add");
        },
      },
      [imageElement]
    )
  );
  elements.push(createElement("label", { for: "name", innerText: "Name:" })); //Label for name input
  elements.push(
    createElement("input", {
      id: "name",
      name: "name",
      autocomplete: "off",
      onchange: saveInput,
      value: loadInput("name"),
    })
  );
  elements.push(
    createElement("label", { for: "dateInput", innerText: "Experation Date:" })
  ); //Label for experationDate input
  elements.push(experationDateElement);
  elements.push(
    createElement("input", {
      type: "date",
      id: "date",
      value: loadInput("date"),
      onchange: function (e) {
        saveInput(e);
        experationDateElement.value = Date.parse(e.target.value);
      },
    })
  );

  return createElement("div", { class: "form-body" }, elements);
}
