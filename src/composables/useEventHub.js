import { v4 as uuidv4 } from 'uuid';

const eventHandlers = {};
const events = {}

export function useEventHub() {
  function registerForEvent(eventName, callback){
    if(typeof callback === 'function' ){
      const eventUUID = uuidv4()
      const eventCb = {
        callback,
        eventName,
        failures: 0
      }
      events[eventUUID] = eventCb
      if(eventHandlers[eventName] === undefined){
        eventHandlers[eventName] = []
      }
      eventHandlers[eventName].push(eventUUID)
      return eventUUID;
    }
    return null;
  }

  function deregisterForEvent(callbackID) {
    const event = events[callbackID]['eventName']
    const index = eventHandlers[event].indexOf(callbackID);
    if (index > -1) {
      eventHandlers[event].splice(index, 1);
    }
    delete events[callbackID]
  }

  function emitEvent(eventName){
    if(eventHandlers[eventName] != undefined){
      for(const callBackID of eventHandlers[eventName]){
        const func = events[callBackID].callback
        func()
      }
    }
  }

  return {
    registerForEvent,
    deregisterForEvent,
    emitEvent
  }
}
