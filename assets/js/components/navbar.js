import { addChildren, clearChildren, createElement } from "../FastHTML.js";
import Fridge from "../pages/Fridge.js";
import Add from "../pages/AddItem.js";
import Settings from "../pages/Settings.js";
import { getLang, langText, setLang } from "./language.js";

export default function Navbar() {
  const nav = createElement("nav", {
    style: {
      height: "60px",
      width: "100%",
      backgroundColor: "#222",
      display: "flex",
    },
  });

  let tabs = [];

  const makeButton = (func, pageUrl, pageUrlPart, buttonText, img) => {
    let newElement = createElement(
      "button",
      {
        onclick: func,
        style: buttonStyle,
      },
      [
        createElement("img", {
          src: "/fridge-app/assets/icons/" + img,
          alt: buttonText,
          style: iconStyle,
        }),
        createElement("span", {
          innerText: langText[getLang()]["navbar"][buttonText],
          style: textStyle,
        }),
      ]
    );

    tabs.push({
      url: pageUrl,
      urlPart: pageUrlPart,
      lang: buttonText,
      element: newElement,
    });

    return newElement;
  };

  window.onclick = function () {
    if (window.localStorage.lang) setLang(getLang());
    clearChildren("nav");
    tabs.map((button, i) => {
      let urlPart = location.pathname.slice(1).split("/")[button.urlPart];
      button.element.querySelector("span").innerText =
        langText[getLang()]["navbar"][button.lang];
      if (button.element.classList.contains("active"))
        button.element.classList.remove("active");

      if (button.url == urlPart) button.element.classList.add("active");

      nav.appendChild(button.element);
    });
  };

  let iconStyle = {
    height: "30px",
    width: "30px",
  };

  let textStyle = {
    fontSize: "12px",
    color: "#fff",
  };

  let buttonStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "0px 20px",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    border: "none",
  };

  document.body.appendChild(
    addChildren(nav, [
      makeButton(Fridge, "fridge", 0, "Fridge", "Fridge.svg"),
      makeButton(Add, "add", 0, "AddItem", "Add.svg"),
      makeButton(Settings, "settings", 0, "Settings", "Settings.svg"),
    ])
  );
}
