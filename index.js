// browserify -p tinyify ./index.js -o ./index.min.js

const proxymity = require("proxymity")
const YouTube = require('youtube-live-chat');

document.addEventListener("ready", function(){
  if (document.body.dataset.apikey && document.body.dataset.channelid){
    const yt = new YouTube(document.body.dataset.channelid, document.body.dataset.apikey);

    const template = `
    <!-- foreach: "messagesIndex" -->
    <!-- key: function(item, index, whole){ return item.id } -->
      <div class="message">
        <strong class="user">
        {:this.app.messages[this.messagesIndex].authorDetails.displayName:}:
        </strong>
        {:this.app.messages[this.messagesIndex].snippet.displayMessage:}
      </div>
    <!-- in: messages -->
    `

    let model = {
    	messages: []
    }

    yt.on("message", function(message){
    	model.messages.unshift(message)
      model.messages.splice(10)
    })
    yt.on('ready', function(){
      console.log("ready")
      yt.listen(1000)
    })
    yt.on('error', console.warn)

    const chatController = proxymity(template, model)

    const chatContainer = document.getElementById("hovering-chat")

    if (chatContainer){
    	chatController.appendTo(chatContainer)
    }
  }

  if (document.body.dataset.l2dmodel){

    window.appHost.on("tracking", function(trackingValues){
      let params = {}
      Object.keys(trackingValues).forEach((key) => {
        switch(key){
          case "EyeBallsX":
            params["ParamEyeBallX"] = trackingValues[key]
            return
          case "EyeLidsOpen":
            params["ParamEyeLOpen"] = trackingValues[key]
            params["ParamEyeROpen"] = trackingValues[key]
            return
          case "EyeLeftSmiling":
            params["ParamEyeLSmile"] = trackingValues[key]
            return
          case "EyeRightSmiling":
            params["ParamEyeRSmile"] = trackingValues[key]
            return
          case "MouthWidth":
            params["ParamMouthForm"] = trackingValues[key]
            return
          case "MouthOpeness":
            params["ParamMouthOpenY"] = trackingValues[key]
            return
          case "BodyAngleYaw":
            params["ParamBodyAngleX"] = trackingValues[key]
            return
          case "BodyAnglePitch":
            params["ParamBodyAngleY"] = trackingValues[key]
            return
          case "BodyAngleRoll":
            params["ParamBodyAngleZ"] = trackingValues[key]
            return
          case "HeadAngleYaw":
            params["ParamAngleX"] = trackingValues[key]
            return
          case "HeadAnglePitch":
            params["ParamAngleY"] = trackingValues[key]
            return
          case "HeadAngleRoll":
            params["ParamAngleZ"] = trackingValues[key]
            return
        }
      });

      console.log(JSON.stringify(params))

      window.appHost.emit("params", params)
    })

  }
})
