import { getLang, langText, setLang } from "../components/language.js"
import { createElement, clearChildren, changeUrlPath } from "../FastHTML.js"

export default function Settings() {
    clearChildren("main")
    changeUrlPath("/settings")
    window.onclick()

    document.querySelector("main").appendChild(
        createElement("div", {style: {
            padding: "20px"
        }}, [
            createElement("label", {innerText: langText[getLang()]["Settings"]["langLabel"] + ":"}),
            createElement("select", {onchange: function(e) {
                setLang(e.target.value)
                window.onclick()
                Settings()
            },
            style: {
                width: "100%",
                padding: "20px",
                margin: "5px 0 20px"
            }}, [
                createElement("option", {innerText: "English", value: "en", selected: (getLang() == "en")}),
                createElement("option", {innerText: "Dansk", value: "da", selected: (getLang() == "da")}),
                createElement("option", {innerText: "Deutsch", value: "de", selected: (getLang() == "de")})
            ])
        ])
    )

}