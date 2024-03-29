import { createElement, simpleRoutesAsync, importCSS } from "./FastHTML.js";
import Navbar from "./components/Navbar.js";
import Add from "./pages/Add.js";
import Fridge from "./pages/Fridge.js";
import Settings from "./pages/Settings.js";

async function App() {
  // {
  //   let fridge = new IndexedDB("fridge", [
  //     { storeName: "items", dataType: "object" },
  //     { storeName: "images", dataType: "arrayBuffer" },
  //   ]);
  //   await fridge.open();

  //   const { items, images } = fridge.tables;

  //   let buffer = new Uint8Array([1, 2, 3]).buffer;

  //   let myImage = await images.add(buffer);
  //   await items.add({ image: myImage, name: "hello" });
  //   console.log(await myImage);
  //   console.log(await images.get(myImage));

  //   console.log(fridge);
  // }
  let NavbarStyle = await importCSS(location.origin + "/assets/css/navbar.css");
  let header;
  let main;
  let footer;

  if (window.location.pathname == "/") {
    window.history.pushState("", "", "/fridge");
  }

  return [
    (header = createElement("header", {}, [
      await simpleRoutesAsync({
        "/fridge": function () {
          return createElement("h1", { innerText: "Fridge" });
        },
        "/add": function () {
          return createElement("h1", { innerText: "Add Item" });
        },
        "/settings": function () {
          return createElement("h1", { innerText: "Settings" });
        },
        "/*": async () => {
          return "hello";
        },
      }),
    ])),
    await simpleRoutesAsync({
      "/fridge": Fridge,
      "/add": Add,
      "/settings": Settings,
      "/*": async () => {
        return "hello";
      },
    }),
    (footer = createElement("footer", { style: NavbarStyle }, [Navbar()])),
  ];
}

export default App;
