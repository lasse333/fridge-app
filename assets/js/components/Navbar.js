import { changeUrlPath, createElement } from "../FastHTML.js";

export default function Navbar() {
  const makeButton = (pageUrl, buttonText, img) => {
    let newElement = createElement(
      "button",
      {
        onclick: function () {
          changeUrlPath(pageUrl);
        },
      },
      [
        createElement("img", {
          src: "../assets/icons/" + img,
          alt: buttonText,
        }),
        createElement("span", {
          innerText: buttonText,
        }),
      ]
    );

    if (window.location.pathname.startsWith(pageUrl)) {
      newElement.classList.add("active");
    } else {
      newElement.classList.remove("active");
    }

    return newElement;
  };
//pleaseplease commit
  return createElement("nav", {}, [
    makeButton("/fridge", "Fridge", "Fridge.svg"),
    makeButton("/add", "Add Item", "Add.svg"),
    makeButton("/settings", "Settings", "Settings.svg"),
  ]);
}
