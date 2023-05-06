import {
  changeUrlPath,
  createElement,
  createImageFromArrayBuffer,
} from "../FastHTML.js";
import IndexedDB from "../components/IndexedDB.js";

export default async function AddForm(image) {
  let fridge = new IndexedDB("fridge", [
    { storeName: "items", dataType: "object" },
    { storeName: "images", dataType: "arrayBuffer" },
  ]);
  await fridge.open();

  const { items, images } = fridge.tables;

  let imageData = image;
  let imageElement = createImageFromArrayBuffer(image);
  let nameElement = createElement("input", {
    id: "name",
    name: "name",
    autocomplete: "off",
    onchange: saveInput,
    value: loadInput("name"),
  });
  let experationDateElement = createElement("input", {
    type: "hidden",
    required: false,
    id: "ExperationDate",
    name: "ExperationDate",
    onchange: saveInput,
    value: loadInput("ExperationDate"),
  });
  let amountElement = createElement("input", {
    type: "number",
    id: "amount",
    min: 1,
    step: 1,
    value: loadInput("amount") || 1,
    onchange: saveInput,
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

  //Picture button
  elements.push(
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

  //Name input
  elements.push(createElement("label", { for: "name", innerText: "Name:" }));
  elements.push(nameElement);

  //Experation Date input
  elements.push(
    createElement("label", { for: "dateInput", innerText: "Experation Date:" })
  );
  elements.push(experationDateElement);
  elements.push(
    createElement("input", {
      type: "date",
      id: "date",
      value: loadInput("date"),
      onchange: function (e) {
        saveInput(e);
        experationDateElement.value = Date.parse(e.target.value) / 1000;
        experationDateElement.onchange({ target: experationDateElement });
      },
    })
  );

  //Amount input
  elements.push(
    createElement("label", { for: "amount", innerText: "Amount:" })
  );
  elements.push(amountElement);
  elements.push(
    createElement(
      "button",
      {
        class: "add-button",
        onclick: function () {
          amountElement.stepUp();
          amountElement.onchange({ target: amountElement });
        },
      },
      [createElement("img", { src: "../assets/icons/Add.svg" })]
    )
  );
  elements.push(
    createElement(
      "button",
      {
        class: "remove-button",
        onclick: function () {
          amountElement.stepDown();
          amountElement.onchange({ target: amountElement });
        },
      },
      [createElement("img", { src: "../assets/icons/Remove.svg" })]
    )
  );

  //Submit button
  elements.push(
    createElement("button", {
      innerText: "Put item in fridge",
      class: "submit-button",
      onclick: async function () {
        let storedImage = await images.add(imageData);
        let itemData = {
          name: nameElement.value,
          date: +experationDateElement.value,
          amount: +amountElement.value,
          image: storedImage,
        };

        await items.add(itemData);
      },
    })
  );

  return createElement("div", { class: "form-body" }, elements);
}
