import { addChildren, createElement } from "./FastHTML.js";
import IndexedDB from "./components/IndexedDB.js";
import Camera, { BarcodeScanner } from "./components/Camera.js";
import NavbarStyle from "../css/navbar.css" assert { type: "css" };
import Navbar from "./components/Navbar.js";

async function App() {
  let camera = new Camera({
    video: { height: 200, width: 200, facingMode: "environment" },
  });
  let scanner = new BarcodeScanner(camera.videoElement, "ean_13");
  let codeOutput = createElement("p");
  scanner.onScan = (code) => {
    codeOutput.innerText = code;
    scanner.stop();
    camera.stopCamera();
  };
  {
    let fridge = new IndexedDB("fridge", [
      { storeName: "items", dataType: "object" },
      { storeName: "images", dataType: "arrayBuffer" },
    ]);
    await fridge.open();

    const { items, images } = fridge.tables;

    let buffer = new Uint8Array([1, 2, 3]).buffer;

    let myImage = await images.add(buffer);
    await items.add({ image: myImage, name: "hello" });
    console.log(await myImage);
    console.log(await images.get(myImage));

    console.log(fridge);
  }

  let header;
  let main;
  let footer;

  addChildren(document.body, [
    (header = createElement("header")),
    (main = createElement("main", {}, [camera.videoElement, codeOutput])),
    (footer = createElement("footer", { style: NavbarStyle }, [Navbar()])),
  ]);
}

export default App;
