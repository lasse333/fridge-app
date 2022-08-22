export function openFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

export function createElement(type, attributesIn, childrenIn) {
    let attributes = attributesIn ?? {}
    let children = childrenIn ?? []

    let element = document.createElement(type)
    Object.assign(element, attributes)

    if (attributes.style) Object.assign(element.style, attributes.style)

    children.forEach(e => {
        if (e == null) return
        element.appendChild(e)
    })

    return element
}

export function changeStyle(selectors, style) {
    document.querySelectorAll(selectors).forEach((element) => {
        Object.assign(element.style, style)
    })
}

export function addChildren(element, children) {
    children.forEach(child => element.appendChild(child))

    return element
}

export function changeUrlPath(path) {

    window.history.pushState("", "", path);

}

export function clearChildren(selectors) {
    document.querySelectorAll(selectors).forEach((element) => {
        element.innerHTML = ""
    })
}