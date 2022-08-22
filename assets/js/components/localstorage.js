export function saveItem(item) {
    let items = JSON.parse(window.localStorage.getItem("items"))
    if (items == "" || items == null) items = []

    
    items.push(item)

    navigator.serviceWorker.ready.then((reg) => {
        reg.active.postMessage(JSON.stringify({"c": "ADD", "d":item}))
    })

    window.localStorage.setItem("items", JSON.stringify(items))
}

export function getItems() {
    return JSON.parse(window.localStorage.getItem("items"))
}

export function updateItem(i, updatedInfo) {
    let items = JSON.parse(window.localStorage.getItem("items"))

    Object.assign(items[i], updatedInfo)

    navigator.serviceWorker.ready.then((reg) => {
        reg.active.postMessage(JSON.stringify({"c": "UPDATE", "d":items[i]}))
    })

    window.localStorage.setItem("items", JSON.stringify(items))
}

export function removeItem(i) {
    let items = JSON.parse(window.localStorage.getItem("items"))

    let removedItem = items.splice(+i, 1)[0]

    navigator.serviceWorker.ready.then((reg) => {
        reg.active.postMessage(JSON.stringify({"c": "DELETE", "d": removedItem}))
    })
    //console.log(removedItem)

    window.localStorage.setItem("items", JSON.stringify(items))
}

export function sortItems() {
    if (!window.localStorage.items) return
    let items = getItems()

    items.sort((a,b) => {
        if (a.ExperationDate == ""  && b.ExperationDate == "") {
            if (a.ItemName.slice(0,1) > b.ItemName.slice(0,1)) {
                return 1
            } else {
                return -1
            }
        }
        if (a.ExperationDate == "") return -1
        if (b.ExperationDate == "") return 1
        if (+a.ExperationDate > +b.ExperationDate) return 1
        if (+a.ExperationDate < +b.ExperationDate) return -1
        return 0
    })

    window.localStorage.setItem("items", JSON.stringify(items))
}