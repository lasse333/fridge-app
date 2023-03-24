import Navbar from "./components/navbar.js";
import Fridge from "./pages/Fridge.js";
import Add from "./pages/AddItem.js";
import Item from "./pages/Item.js";
import Settings from "./pages/Settings.js";
import { createElement } from "./FastHTML.js";
import { getItems } from "./components/localstorage.js";
import { getLang, setLang } from "./components/language.js";

function App() {
  const main = createElement("main", {
    style: {
      display: "grid",
      /*placeItems: "center",*/ maxWidth: "100vw",
      overflowY: "scroll",
    },
  });

  //START UP
  Notification.requestPermission();

  if (getLang() == null) {
    setLang("en");
  }

  //database.init()

  if (true) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("../ServiceWorker.js")
        .then((reg) => console.log("service worker registered", reg))
        .catch((err) => console.log("service worker not registered", err));
    }
  }

  //navigator.permissions.query({ name: "periodic-background-sync" }).then((status)=>{ //console.log(status)})

  navigator.permissions
    .query({ name: "periodic-background-sync" })
    .then((status) => {
      if (status.state === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.periodicSync.register("check-expired", {
            minInterval: 3 * 60 * 60 * 1000,
          });
        });
      } else {
        //console.log("EYE")
      }
    });

  document.body.appendChild(main);
  Navbar();

  let path = location.pathname.slice(1).split("/");

  switch (path[1]) {
    case "add":
      Add();
      break;

    case "fridge":
      Fridge();
      break;

    case "settings":
      Settings();
      break;

    case "item":
      if (getItems() && getItems()[+path[2]]) {
        Item(+path[2]);
      } else {
        Add();
      }
      break;

    default:
      Add();
      break;
  }
}

export default App;
