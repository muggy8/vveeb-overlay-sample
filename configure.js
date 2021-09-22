// CHAT BOX RELATED CONFIGUREATIONS

// if you want to display your youtube chatbox then adjust your youtube related settings below
let youtubeChatSettings = {
  // if you want to show your youtube chat in the overlay while streaming then change this to true.
  showChatbox: true,

  // if you want to show your youtube chat in your overlay when stream is active, declare your own youtube API key and channel id here.
  apiKey: "",
  channelId: "",

  // this is to controle the color of the text that shows up in the chat. the value is an RGB hex code.
  mesageColor: "000000",
  messageOutlineColor: "FFFFFF",

  // this lets you control which edge the chat box is attached to
  positionVertical: "top",  // or "bottom"
  positionHorizontal: "right", // or "left"

  // this lets you control the the number of pixels from the edge of the horizontal and vertical position
  positionVerticalOffset: 0,
  positionHorizontalOffset: 0,

  // this is the width and height of the chat box that is to be displayed.
  chatWidth: 160,
  chatHeight: 144,
}

// twitch is currently not supported right now but this demo is open source so feel free to do that if you want


// LIVE2D MODEL RELATED CONFIGUREATIONS

let live2DSettings = {
  // if you want to show a live2d based vtuber model then change this to true
  showModel:true,

  // declare your model background color here. the values goes from 0 to 1. if you want to have a transparent background, you dont have to chagne anything/
  bgRed: 0,
  bgGreen: 0,
  bgBlue: 0,
  bgAlpha: 0, // transparency value 0 for fully transparent and 0 for fully opaque

  // declare your model's zoom (how "big" your model is in the rendering area) the value goes from 0 to infinity. the bigger the value goes, the bigger the model is in the rendering area.
  zoom: 1,

  // declare your model's position here (where your  model is in the rendering area) the values goes from -1 to 1 but you can technically go beyond too
  modelX: 0,
  modelY: 0,

  // declare your model's rotation in radians here. if you want to convert your rotation degrees from degrees to radians use "radians(degrees)" to convert your number
  rotation: radians(0), // use radians(180) to have your model be upside down

  // declare your model name here and place your model in the Resources folder.
  modelName: "Hiyori",

  // this lets you control which edge the live2D box is attached to
  positionVertical: "bottom",  // or "top"
  positionHorizontal: "left", // or "right"

  // this lets you control the the number of pixels from the edge of the horizontal and vertical position
  positionVerticalOffset: 0,
  positionHorizontalOffset: 0,

  // this is the width and height of the live2D box that is to be displayed.
  rendererWidth: 160,
  rendererHeight: 144,
}

// =============================================================================================
// dont touch the stuff below unless you know what you're doing
// =============================================================================================
if (youtubeChatSettings.showChatbox){
  setupYoutubeChatbox(youtubeChatSettings)
}
if (live2DSettings.showModel){
  setupLive2dModel(live2DSettings)
}

function setupYoutubeChatbox(youtubeChatSettings){
  let cssConfigString = `
    --yt-message-color: #${youtubeChatSettings.mesageColor};
    --yt-message-shadow: #${youtubeChatSettings.messageOutlineColor};
    --yt-box-width: ${youtubeChatSettings.chatWidth}px;
    --yt-box-height: ${youtubeChatSettings.chatHeight}px;
  `

  document.body.setAttribute("data-apikey", youtubeChatSettings.apiKey)
  document.body.setAttribute("data-channelid", youtubeChatSettings.channelId)
  document.body.setAttribute("style", cssConfigString)

  let cssChatBoxString = `
    ${youtubeChatSettings.positionHorizontal}: ${youtubeChatSettings.positionHorizontalOffset}px;
    ${youtubeChatSettings.positionVertical}: ${youtubeChatSettings.positionVerticalOffset}px;
  `
  let chatBox = document.getElementById("hovering-chat")
  if (chatBox){
    chatBox.setAttribute("style", cssChatBoxString)
  }
}

function setupLive2dModel(configs){
  function emitModelPosition(){
    window.appHost.emit("zoom", configs.zoom)
    window.appHost.emit("bgcolor", [configs.bgRed, configs.bgGreen, configs.bgBlue, configs.bgAlpha])
    window.appHost.emit("translate", [configs.modelX, configs.modelY])
    window.appHost.emit("rotate", configs.rotation)
  }

  let offrunning = window.appHost.on("running", function(){
    emitModelPosition()
    offrunning()
  })

  let offModel = window.appHost.on("modelloaded", function(value){
    window.appHost.emit("loadModel", configs.modelName)
    offModel()
  })

  window.addEventListener("resize", () => {
    setTimeout(() => {
      emitModelPosition()
    }, 0)
  })

  window.appHost.emit("startModel")

  document.body.setAttribute("data-l2dmodel", "true")

  let rendererCssStyling = `
    width: ${configs.rendererWidth}px;
    height: ${configs.rendererHeight}px;
    ${configs.positionVertical}: ${configs.positionVerticalOffset}px;
    ${configs.positionHorizontal}: ${configs.positionHorizontalOffset}px;
  `

  let renderer = document.getElementById("renderer-container")
  if (renderer){
    renderer.setAttribute("style", rendererCssStyling)
  }
}

function radians(degrees){
  if (degrees < 0) {
    degrees += 360;/*from w  w  w .  java2 s.c o m*/
  }
  return degrees / 180 * Math.PI;
};
