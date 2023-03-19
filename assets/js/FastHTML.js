export function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }
}

/**
 *
 * @param {string} type
 * @param {Object} [attributesIn]
 * @param {(HTMLElement|string|DocumentFragment)[]} [childrenIn]
 * @returns {HTMLElement}
 */
export function createElement(type, attributesIn, childrenIn) {
  let attributes = attributesIn ?? {};
  let children = childrenIn ?? [];

  let element = document.createElement(type);
  Object.assign(element, attributes);
  if (attributes.class) element.className = attributes.class;
  if (attributes.for) element.setAttribute("for", attributes.for);

  if (attributes.style) changeStyle(element, attributes.style);

  addChildren(element, children);

  return element;
}

/**
 *
 * @param {string|HTMLElement} parrentElement
 * @param {Object|CSSStyleSheet} style
 * @returns {HTMLElement|undefined}
 */
export function changeStyle(parrentElement, style) {
  if (typeof parrentElement === "string") {
    document.querySelectorAll(parrentElement).forEach((element) => {
      applyStyle(element, style);
    });
  } else {
    applyStyle(parrentElement, style);
    return parrentElement;
  }
}

/**
 * @param {HTMLElement} element
 * @param {Object|CSSStyleSheet} style
 */
function applyStyle(element, style) {
  if (!(style instanceof CSSStyleSheet)) Object.assign(element.style, style);
  else {
    if (!element.shadowRoot) element.attachShadow({ mode: "open" });
    element.shadowRoot.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      style,
    ];
  }
}

/**
 * @param {HTMLElement} element
 * @param {(HTMLElement|string|DocumentFragment)[]|string|HTMLElement|DocumentFragment} childrenIn
 * @returns {HTMLElement}
 */
export function addChildren(element, childrenIn) {
  let children = childrenIn;
  if (!(children instanceof Array)) children = [children];
  children.forEach((childIn) => {
    let child = childIn;
    let parser = new DOMParser();

    if (typeof child === "string") {
      child = parser.parseFromString(child, "text/html");
      child
        .querySelectorAll("script")
        .forEach((scriptTag) => scriptTag.remove());
      addChildren(element, Array.from(child.body.children));
      return element;
    }

    if (element.shadowRoot) element.shadowRoot.append(child);
    else element.append(child);
  });

  return element;
}

/**@param {string} path */
export function changeUrlPath(path) {
  window.history.pushState("", "", path);
  reRender();
}

export function reRender() {
  const reRenderEvent = new CustomEvent("rerender", { detail: "" });
  window.dispatchEvent(reRenderEvent);
}

/**
 * @param {HTMLElement | string} parrentElement
 * @returns {undefined | HTMLElement}
 *  */
export function clearChildren(parrentElement) {
  if (typeof parrentElement === "string") {
    document.querySelectorAll(parrentElement).forEach((element) => {
      element.innerHTML = "";
    });
  } else if (parrentElement.shadowRoot) {
    parrentElement.shadowRoot.innerHTML = "";
    return parrentElement;
  } else {
    parrentElement.innerHTML = "";
    return parrentElement;
  }
}

function urlParams(params) {
  let urlParams = {};
  for (let name in params) {
    if (params[name] == undefined) continue;
    for (let value in params[name].groups) {
      if (value == "0") continue;
      urlParams[value] = params[name].groups[value];
    }
  }

  return urlParams;
}

export function simpleRoutes(routes = {}) {
  for (let path in routes) {
    let url = new URLPattern({ pathname: path });

    if (url.test(window.location.href))
      return routes[path](urlParams(url.exec(window.location.href)));
  }
}

export async function simpleRoutesAsync(routes = {}) {
  for (let path in routes) {
    let url = new URLPattern({ pathname: path });

    if (url.test(window.location.href))
      return await routes[path](urlParams(url.exec(window.location.href)));
  }
}

export function createImageFromArrayBuffer(
  arrayBuffer,
  mimeType = "image/png"
) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  return img;
}
