import App from "./App.js";
import {
  clearChildren,
  addChildren,
  changeStyle,
  importCSS,
} from "./FastHTML.js";

// **  IIFE: Immediately Invoked Function Expression  */
(async function () {
  let mainStyle = await importCSS(location.origin + "/assets/css/style.css");

  document.adoptedStyleSheets = [mainStyle];

  addChildren(document.body, await App());

  window.addEventListener("rerender", async function (e) {
    // console.log(e.detail, window.location.pathname)
    if (e.detail != window.location.pathname) {
      changeStyle(document.body, { cursor: "wait" });
      let pre_render = await App();

      clearChildren(document.body);
      addChildren(document.body, pre_render);
    }

    changeStyle(document.body, { cursor: "" });
  });
})();
