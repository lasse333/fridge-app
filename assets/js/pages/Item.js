import { convertReadable, toDateString } from "../components/datetime.js";
import { getLang, langText } from "../components/language.js";
import {
  getItems,
  removeItem,
  sortItems,
  updateItem,
} from "../components/localstorage.js";
import { changeUrlPath, clearChildren, createElement } from "../FastHTML.js";
import Fridge from "./Fridge.js";

export default function Item(i) {
  if (i == null) Fridge();

  sortItems();
  let items = getItems();

  clearChildren("main");
  changeUrlPath("/item/" + i);

  const removeItemButton = createElement("button", {
    innerText: langText[getLang()]["Item"]["removeButton"],
    disabled: true,
    onclick: function () {
      if (
        confirm(
          langText[getLang()]["Item"]["confirm1"] +
            items[i].ItemName +
            langText[getLang()]["Item"]["confirm2"]
        )
      )
        removeItem(i);
      Fridge();
    },
    style: {
      width: "100%",
      backgroundColor: "#c20",
      padding: "5px auto",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "20px",
    },
  });

  document.querySelector("main").appendChild(
    createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateRows: "60px auto",
        },
      },
      [
        createElement(
          "header",
          {
            style: {
              backgroundColor: "#222",
              display: "flex",
            },
          },
          [
            createElement(
              "button",
              {
                onclick: Fridge,
                style: {
                  margin: "0",
                  background: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  outline: "none",
                },
              },
              [
                createElement("img", {
                  src: "../assets/icons/Back.svg",
                  style: {
                    height: "30px",
                    width: "30px",
                  },
                }),
              ]
            ),
            createElement("h1", {
              innerText: items[i].ItemName,
              style: {
                display: "flex",
                alignItems: "center",
              },
            }),
          ]
        ),
        createElement("img", {
          src: "data:image/*;base64," + items[i].ImageData,
          style: {
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
          },
        }),
        createElement(
          "div",
          {
            style: {
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            },
          },
          [
            items[i].ExperationDate != ""
              ? createElement("h3", {
                  innerText:
                    langText[getLang()]["Item"]["dateLabel"] +
                    ": " +
                    toDateString(
                      items[i].ExperationDate,
                      langText[getLang()]["Item"]["locale"]
                    ),
                })
              : null,
            createElement("h3", {
              innerText:
                langText[getLang()]["Item"]["timeLabel"] +
                ": " +
                (items[i].ExperationDate == ""
                  ? langText[getLang()]["Item"]["unknown"]
                  : convertReadable(items[i].ExperationDate) ||
                    langText[getLang()]["Item"]["expired"]),
            }),
            createElement("br"),
            createElement("h3", {
              innerText:
                langText[getLang()]["Item"]["amountLabel"] +
                ": " +
                items[i].ItemAmount,
            }),
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
                    style: {
                      width: "100%",
                      backgroundColor: "#5c0",
                      padding: "5px auto",
                    },
                    onclick: function () {
                      updateItem(i, {
                        ItemAmount: +items[i].ItemAmount + 1 + "",
                      });
                      Item(i);
                    },
                  },
                  [
                    createElement("img", {
                      src: "../assets/icons/Add.svg",
                      style: { height: "20px", width: "20px" },
                    }),
                  ]
                ),
                createElement(
                  "button",
                  {
                    style: {
                      width: "100%",
                      backgroundColor: "#c20",
                      padding: "5px auto",
                    },
                    onclick: function () {
                      if (+items[i].ItemAmount > 1)
                        updateItem(i, {
                          ItemAmount: +items[i].ItemAmount - 1 + "",
                        });
                      Item(i);
                    },
                  },
                  [
                    createElement("img", {
                      src: "../assets/icons/Remove.svg",
                      style: { height: "20px", width: "20px" },
                    }),
                  ]
                ),
              ]
            ),
            createElement("br"),
            removeItemButton,
          ]
        ),
      ]
    )
  );

  setTimeout(function () {
    removeItemButton.disabled = false;
  }, 3 * 1000);
}
