//const methodHandlers = (function() {
  'use strict';


  const _eventHandlers = {};
  const _selected = {};
  export const publicProperty = 'I am a public property';


    export function registerHandler(name, obj){
      if(typeof obj  != undefined ){
        if(_eventHandlers[name] == undefined){
          console.log("handler init")
          _eventHandlers[name]=[]
          console.log("adding, there are "+_eventHandlers[name].length)
        }
        console.log("adding function for event ="+name)
        _eventHandlers[name].push(obj)
        console.log("added there are "+_eventHandlers[name].length)
        return 0;
      }
      else
        return 1;
    }
    export function invokeHandlers (name){
      if(_eventHandlers[name] != undefined){
        for(const obj of _eventHandlers[name]){
          console.log("invoking handler for ="+name)
          obj.func(obj.ctx)
        }
      }
    }
    export function getSelectedRow(type){
      if( _selected[type] == undefined )
        return -1
      else
      return _selected[type];
    }
    export function setSelectedRow(type,index){
        console.log("setting selected for "+type + " to "+index )
        _selected[type]=index;
    }
//})();