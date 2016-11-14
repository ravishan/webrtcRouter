export default class eventemitter {

  constructor(){
    this.eventListners = [];
    this.errorEvents = {};
  }

  addListners(listner){
    this.eventListners.push(listner);
  }

  removeListners(listner){
    for(let index = 0;index<this.eventListners.length;index++){
      if(listner === this.eventListners[index]){
        this.eventListners.splice(index,1);
        index--;
      }
    }
  }

  getEventListners(){
    return this.eventListners;
  }

  emitEvent(handlerFunction,arg1,arg2,arg3,arg4,arg5){
    this.eventListners.forEach((handler)=>{
      try{

        if(handler[handlerFunction]){
          handler[handlerFunction](arg1,arg2,arg3,arg4,arg5);
        }
      }catch(e){
        console.log(e);
        errorEvents[handlerFunction] = true;
        //TODO: Need to handel ERROR
      }
    })
  }

  onMessage(data){
    this.emitEvent('onMessage',data);
  }

  onConnection(clients){
    this.emitEvent('onConnection',clients);
  }
}


export const emitter = new eventemitter();
