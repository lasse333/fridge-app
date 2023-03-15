import App from "./App.js";
import { clearChildren, addChildren, changeUrlPath } from "./FastHTML.js";
import mainStyle from "../css/style.css" assert { type: "css" };

// **  IIFE: Immediately Invoked Function Expression  */
(async function () {
  document.adoptedStyleSheets = [mainStyle];
  let page = await App();

  addChildren(document.body, page);

  window.addEventListener("rerender", async function (e) {
    if (e.detail != window.location.pathname) {
      page = await App();
      clearChildren(document.body);
      addChildren(document.body, page);
    }
  });
})();
