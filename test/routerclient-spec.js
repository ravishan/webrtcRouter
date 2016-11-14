import expect from 'expect.js';
import rtcEventEmitter from '../client/rtcEventEmitter';

function isArrayEqual (array1,array2) {
  if(array1.length != array2.length){
     return false;
  }

  return array1.every(function(value){
    return  array2[value] == array1[value];
  })
}

describe('Router Client specifications',() => {
    var candidates;
    var TestEmitter;
    var router;
    var error;
    function is_equal(array1,array2){
      if(array1.length != array2.length){
        return false;
      }
      return array2.every((element,index)=>element===array1[index]);
    }

    beforeEach(() => {
     router = new rtcEventEmitter();
     candidates = [];
     TestEmitter = {
        onopen(data){
          candidates.push(data);
        }
      }
    });


    it('should Emit event for the add event listners',()=>{
       router.addListners(TestEmitter);
       let data = "test";
       router.onopen(data);
       const expectedCandidates = ["test"];
       expect(is_equal(candidates,expectedCandidates)).to.be.ok();
    });
})
