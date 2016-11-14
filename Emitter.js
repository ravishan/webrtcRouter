export default class Emitter{
  constructor(){
    this.cbs=[];
  }
  subscribe(cb){
    this.cbs.push(cb)
    return ()=>{
      this.cbs=this.cbs.filter((tcb)=>{
        if(tcb != cb) return true;
      })
    }
  }
  emit(){
    this.cbs.slice().forEach((cb)=>{
      cb();
    })
  }
}


/*var emitterObj=new Emitter();
var unSubscribeTest=emitterObj.subscribe(()=>{
  console.log("test")
});
var unSubscribeTest1=emitterObj.subscribe(()=>{
  console.log("test1")
});
emitterObj.emit();
unSubscribeTest1();
emitterObj.emit();
emitterObj.emit();
*/
