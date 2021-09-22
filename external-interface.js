(function(window, setupBindings){
    if (!window.appHost){
        let callbackMemory = {}
        let stashedEvents = {}
        window.appHost = {
            on: function(eventName, callback){
                if (!callbackMemory[eventName]){
                    callbackMemory[eventName] = []
                }
                callbackMemory[eventName].push(callback)

                if (stashedEvents[eventName]){
                  for(let stashedEvent of stashedEvents[eventName]){
                    callback(stashedEvent.eventName, stashedEvent.value)
                  }
                }

                return function(){
                    callbackMemory[eventName].splice(
                        callbackMemory[eventName].indexOf(callback),
                        1
                    )
                }
            },
            emit: function(eventName, value){
              if (callbackMemory[eventName]){
                for(let callback of callbackMemory[eventName]){
                  callback(value)
                }
              }
              else{
                stashedEvents[eventName] = []
                stashedEvents[eventName].push({eventName, value})
              }
            }
        }

        setupBindings(window.appHost)
    }
})(window, function(appHost){
    window.addEventListener("message", (event) => {
        let payload = JSON.parse(event.data)
        appHost.emit(payload.type, payload.payload)
    }, false);
});
