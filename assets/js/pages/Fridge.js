import { createElement, clearChildren, changeUrlPath, addChildren } from "../FastHTML.js"
import { getItems, sortItems } from "../components/localstorage.js"
import Item from "./Item.js"
import { getLang, langText } from "../components/language.js"

export default function Fridge() {

    const aMilisecond = 1
    const aSecond = 1000 * aMilisecond
    const aMinute = 60 * aSecond
    const anHour = 60 * aMinute
    const aDay = 24 * anHour
    const aWeek = 7 * aDay
    const aMonth = 30 * aDay
    const aYear = 365 * aDay

    clearChildren("main")
    changeUrlPath("/fridge")
    window.onclick()
    sortItems()
    let items = getItems()
    let list = createElement("div", {style: {
        width: "100%",
        padding: "10px",
        minHeight: "100%",
        alignItems: "center",
    }})
    document.querySelector("main").appendChild(list)

    if (items == null || items == "") {
        list.appendChild(createElement("div", {style: {
            display: "grid",
            placeItems: "center",
            height: "100%"
        }}, [createElement("h1", {innerText: langText[getLang()]["Fridge"]["emptyMessage"], style: {textAlign: "center"}})]))
        return
    }

    let intervals = {}

    items.map((item, i) => {
        let newElement = createElement("button", {onclick: function() {Item(i)},style: {
            padding: "0",
            background: "none", 
            border: "none", 
            display: "flex", 
            flexDirection: "column", 
            color: "#fff",
            maxWidth: "250px",
            width: "100%",
            overflowWrap: "anywhere",
            fontSize: "18px",
            

        }}, [
            createElement("img", {src: "data:image/*;base64," + item.ImageData, style: {
                width: "100%"
            }}),
            createElement("p", {innerText: `${item.ItemAmount}x ${item.ItemName}`, style: {
                display: "inline-block",
                margin: "5px auto",
            }})
        ])

        if (item.ExperationDate == "") !intervals.Unknown ? intervals.Unknown = [newElement] : intervals.Unknown.push(newElement)


        if (item.ExperationDate != "") {
            let deltaTime = +item.ExperationDate-Date.now()
            
            switch (true) {
                case deltaTime < 0: // Expired
                    !intervals.Expired ? intervals.Expired = [newElement] : intervals.Expired.push(newElement)
                    break
                case deltaTime > 12*aMonth-aDay: // 12 Months
                    !intervals["12Month"] ? intervals["12Month"] = [newElement] : intervals["12Month"].push(newElement)
                    break
                case deltaTime > 6*aMonth-aDay: // 6 Months
                    !intervals["6Month"] ? intervals["6Month"] = [newElement] : intervals["6Month"].push(newElement)
                    break
                case deltaTime > 2*aMonth-aDay: // 2 Months
                    !intervals["2Month"] ? intervals["2Month"] = [newElement] : intervals["2Month"].push(newElement)
                    break
                case deltaTime > aMonth-3*aDay: // a Month
                    !intervals["1Month"] ? intervals["1Month"] = [newElement] : intervals["1Month"].push(newElement)
                    break
                case deltaTime > 2*aWeek-aDay: // 2 Weeks
                    !intervals["2Week"] ? intervals["2Week"] = [newElement] : intervals["2Week"].push(newElement)
                    break
                case deltaTime > aWeek-aDay: // a Week
                    !intervals["1Week"] ? intervals["1Week"] = [newElement] : intervals["1Week"].push(newElement)
                    break
                case deltaTime > 5*aDay: // 6 Days
                    !intervals["6Day"] ? intervals["6Day"] = [newElement] : intervals["6Day"].push(newElement)
                    break
                case deltaTime > 4*aDay: // 5 Days
                    !intervals["5Day"] ? intervals["5Day"] = [newElement] : intervals["5Day"].push(newElement)
                    break
                case deltaTime > 3*aDay: // 4 Days
                    !intervals["4Day"] ? intervals["4Day"] = [newElement] : intervals["4Day"].push(newElement)
                    break
                case deltaTime > 2*aDay: // 3 Days
                    !intervals["3Day"] ? intervals["3Day"] = [newElement] : intervals["3Day"].push(newElement)
                    break
                case deltaTime > aDay: // 2 Days
                    !intervals["2Day"] ? intervals["2Day"] = [newElement] : intervals["2Day"].push(newElement)
                    break
                case deltaTime > 0: // a Day
                    !intervals["1Day"] ? intervals["1Day"] = [newElement] : intervals["1Day"].push(newElement)
                    break
                default: //Unknown
                    !intervals["Unknown"] ? intervals["Unknown"] = [newElement] : intervals["Unknown"].push(newElement)
                    break
            }
            
        }

    })

    let intervalKeys = ["Unknown", "Expired", "1Day", "2Day", "3Day", "4Day", "5Day", "6Day", "1Week", "2Week", "1Month", "2Month", "6Month", "12Month"]
    let intervalTitles = {
        "Unknown": langText[getLang()]["Fridge"]["Unknown"],
        "Expired": langText[getLang()]["Fridge"]["Expired"],
        "1Day": langText[getLang()]["Fridge"]["1Day"],
        "2Day": langText[getLang()]["Fridge"]["2Day"],
        "3Day": langText[getLang()]["Fridge"]["3Day"],
        "4Day": langText[getLang()]["Fridge"]["4Day"],
        "5Day": langText[getLang()]["Fridge"]["5Day"],
        "6Day": langText[getLang()]["Fridge"]["6Day"],
        "1Week": langText[getLang()]["Fridge"]["1Week"], 
        "2Week": langText[getLang()]["Fridge"]["2Week"], 
        "1Month": langText[getLang()]["Fridge"]["1Month"], 
        "2Month": langText[getLang()]["Fridge"]["2Month"], 
        "6Month": langText[getLang()]["Fridge"]["6Month"],
        "12Month": langText[getLang()]["Fridge"]["12Month"]
    }

    intervalKeys.forEach((key) => {
        if (intervals[key]) {
            addChildren(list, [
                createElement("h2", {innerText: intervalTitles[key]}),
                createElement("hr", {style: {
                    margin: "5px"
                }}),
                createElement("div", {style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gridAutoRows: "minmax(300px, 300px)",
                    gap: "10px",
                }}, intervals[key])
            ])
        }
    })

}