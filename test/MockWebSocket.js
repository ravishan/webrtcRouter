import EventEmitter from 'events';
export default class MockWebSocket extends EventEmitter{
  constructor(){
    super();
  //  this.on('onmessage',(e)=>this.onmessage(e))
  }
  send(msg){
     this.lastSend=msg;
  }
}
