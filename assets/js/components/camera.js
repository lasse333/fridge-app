import { createElement, clearChildren, addChildren } from "../FastHTML.js"
import { getLang, langText } from "./language.js"


const imageSize = 200

const video = createElement("video", {style: {
    height: "100%",
    maxWidth: "100vmin",
    margin: "0 auto",
    display: "block"
}})

const canvas = createElement("canvas", {height: imageSize, width: imageSize,style: {
    width: "100%",
    maxWidth: "100vmin",
    margin: "0 auto",
    display: "block",
    backgroundColor: "#000"
}})

let stream



const takePicture = (e, f) => {
    e.preventDefault()

    document.querySelector("main").appendChild(canvas)
    document.querySelector("main").style.overflowY = "scroll"

    const context = canvas.getContext("2d")

    context.drawImage(video, 0, 0, imageSize, imageSize)

    const data = canvas.toDataURL('image/png').split(';base64,')[1];

    stream.getTracks().forEach(function(track) {
        track.stop();
    });
    
    f(data)
}



export function startVideo(f) {
    clearChildren("main")

    document.querySelector("main").appendChild(video)
    document.querySelector("main").style.overflowY = "hidden"
    
    navigator.mediaDevices.getUserMedia(
        { video: {
            height: imageSize,
            width: imageSize,
            facingMode: "environment",
            exposureMode: "continuous",
            pointsOfInterest: {x: imageSize/2, y: imageSize/2}
        }, 
        audio: false 
    })
    .then(function(streamIn) {
        stream = streamIn
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        //console.error(`An error occurred: ${err}`);
    });
    
    video.onclick = function(e) {takePicture(e, f)}
}

export function camera(f) {
    addChildren(document.querySelector("main"), [createElement("div", {style: {
        height: "100%",
        width: "100%",
        display: "grid",
        placeItems: "center"
    }}, [
        createElement("button", {onclick: function() {startVideo(f)}, innerText: langText[getLang()]["camera"]["button"], style: {
            fontSize: "20px",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            backgroundColor: "#05f"
        }})
    ])])
}