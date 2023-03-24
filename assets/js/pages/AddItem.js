import { clearChildren, changeUrlPath, createElement } from "../FastHTML.js";
import { camera, startVideo } from "../components/camera.js";
import { saveItem, sortItems } from "../components/localstorage.js";
import Fridge from "./Fridge.js";
import createUUID from "../components/uuid.js";
import { getLang, langText } from "../components/language.js";

export default function Add() {
  clearChildren("main");
  changeUrlPath("/add");
  window.onclick();

  const photo = createElement("img", {
    style: {
      width: "100%",
      margin: "0 auto 20px",
      display: "block",
    },
  });

  const imageInput = createElement("input", {
    type: "hidden",
    name: "ImageData",
    required: true,
  });
  const experationDateTimestamp = createElement("input", {
    type: "hidden",
    name: "ExperationDate",
    required: false,
  });
  const amountInput = createElement("input", {
    type: "number",
    step: 1,
    min: 1,
    required: true,
    placeholder: langText[getLang()]["AddItem"]["amountInput"],
    name: "ItemAmount",
    value: 1,
  });

  const formular = createElement(
    "form",
    {
      onsubmit: function (e) {
        e.preventDefault(); /*console.log(e)*/
      },
      className: "formular",
      autocomplete: "off",
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "0 20px",
        gap: "20px",
      },
    },
    [
      imageInput,
      createElement("label", {
        innerText: langText[getLang()]["AddItem"]["nameInput"] + ":",
      }),
      createElement("input", {
        type: "text",
        placeholder: langText[getLang()]["AddItem"]["nameInput"],
        name: "ItemName",
        required: true,
      }),
      createElement(
        "label",
        {
          innerText:
            langText[getLang()]["AddItem"]["expirationDateInput"] + ":",
        },
        []
      ),
      createElement("input", {
        type: "date",
        placeholder: langText[getLang()]["AddItem"]["expirationDateInput"],
        required: false,
        onchange: function (e) {
          experationDateTimestamp.value = Date.parse(e.target.value);
        },
      }),
      experationDateTimestamp,
      createElement("label", {
        innerText: langText[getLang()]["AddItem"]["amountInput"] + ":",
      }),
      amountInput,
      createElement(
        "div",
        {
          style: {
            display: "flex",
            gap: "10px",
          },
        },
        [
          createElement(
            "button",
            {
              onclick: function (e) {
                e.preventDefault();
                amountInput.value = +amountInput.value + 1;
              },
              style: {
                width: "100%",
                backgroundColor: "#5c0",
              },
            },
            [
              createElement("img", {
                src: "/fridge-app/assets/icons/Add.svg",
                style: { height: "20px", width: "20px" },
              }),
            ]
          ),
          createElement(
            "button",
            {
              onclick: function (e) {
                e.preventDefault();
                if (+amountInput.value > +amountInput.min)
                  amountInput.value = +amountInput.value - 1;
              },
              style: {
                width: "100%",
                backgroundColor: "#c20",
              },
            },
            [
              createElement("img", {
                src: "/fridge-app/assets/icons/Remove.svg",
                style: { height: "20px", width: "20px" },
              }),
            ]
          ),
        ]
      ),
      createElement("br"),
      createElement("input", {
        type: "submit",
        value: langText[getLang()]["AddItem"]["submitButton"],
        style: {
          fontSize: "20px",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          backgroundColor: "#05f",
          whiteSpace: "break-spaces",
        },
      }),
    ]
  );

  const imageInputForm = (imgBase64) => {
    photo.setAttribute("src", "data:image/*;base64," + imgBase64);
    imageInput.value = imgBase64;
    clearChildren("main");
    document.querySelector("main").appendChild(
      createElement(
        "div",
        {
          style: {
            height: "100%",
            width: "100%",
            padding: "20px 0",
          },
        },
        [
          createElement(
            "button",
            {
              onclick: function () {
                startVideo(imageInputForm);
              },
              style: {
                width: "calc(100% - 20px)",
                maxWidth: "50vmin",
                margin: "0 auto",
                display: "block",
                padding: "0",
                border: "none",
                outline: "none",
                background: "none",
              },
            },
            [photo]
          ),
          formular,
        ]
      )
    );

    formular.onsubmit = function (e) {
      e.preventDefault();
      let formData = {};
      for (let i = 0; i < e.target.children.length; i++) {
        let child = e.target.children[i];
        if (child.name && child.tagName.toLowerCase() == "input") {
          formData[child.name] = child.value;
        }
      }

      formData.uuid = createUUID();

      // init()
      // write(formData)
      // db.close()
      saveItem(formData);
      sortItems();

      for (let i = 0; i < e.target.children.length; i++) {
        let child = e.target.children[i];
        if (child.tagName.toLowerCase() == "input" && child.type != "submit") {
          child.value = "";
        }
      }

      Fridge();
    };
  };

  camera(imageInputForm);
}
