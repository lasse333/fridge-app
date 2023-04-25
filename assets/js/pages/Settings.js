import { createElement } from "../FastHTML.js";
import SettingsStyle from "../../css/settings.css" assert { type: "css" };

export default function Settings() {
  return createElement("main", { style: SettingsStyle }, [
    createElement("div", {}),
  ]);
}
