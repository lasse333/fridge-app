import { createElement, importCSS } from "../FastHTML.js";

export default async function Settings() {
  let SettingsStyle = await importCSS(
    location.origin + "/assets/css/settings.css",
  );
  return createElement("main", { style: SettingsStyle }, [
    createElement("div", {}),
  ]);
}
