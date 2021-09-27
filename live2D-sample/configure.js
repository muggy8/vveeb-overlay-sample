fetch("configs.json").then(data=>data.json()).then(configs=>{

  let chatboxSettings = configs.chatboxSettings
  let youtubeChatSettings = configs.youtubeSettings
  Object.assign(youtubeChatSettings, chatboxSettings)
  let live2DSettings = configs.live2DSettings

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

})
