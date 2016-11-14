import expect from 'expect.js';
import eventemitter from'./../server/eventemitter';

describe('Event Emitter specifications',()=>{
    var candidates;
    var TestEmitter;
    var eventEmitter;
    var error;
    function is_equal(array1,array2){
      if(array1.length != array2.length){
        return false;
      }
      return array2.every((element,index)=>element===array1[index]);
    }

    beforeEach(() => {
     eventEmitter = new eventemitter();
     candidates = [];
     TestEmitter = {
        onMessage(data){
          candidates.push(data);
        }
      }
    });


    it('should add event listner',()=>{
      eventEmitter.addListners(TestEmitter);
      const actualListners = eventEmitter.getEventListners();
      const expectedListners = [TestEmitter];
      expect(is_equal(actualListners,expectedListners)).to.be.ok();
    });

    it('should remove event listner', ()=>{
      eventEmitter.addListners(TestEmitter);
      eventEmitter.removeListners(TestEmitter);
      const actualListners = eventEmitter.getEventListners();
      const expectedListners = [];
      expect(is_equal(actualListners,expectedListners)).to.be.ok();
    });

    it('should Emit event for the add event listners',()=>{
       eventEmitter.addListners(TestEmitter);
       let data = "test";
       eventEmitter.onMessage(data);
       const expectedCandidates = ["test"];
       expect(is_equal(candidates,expectedCandidates)).to.be.ok();
    });
})
