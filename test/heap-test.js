import expect from 'expect.js';
import {createMinHeap} from './../server/heap';



describe('Heap specifications::',()=>{
  var minHeap;
  beforeEach(()=>{
    minHeap = createMinHeap(3);
  });

  it('Should be able to add heapNode',()=>{
    minHeap.addHeapNode(0,0,0);
    expect(minHeap.getHeap()[0].getKey()).to.eql(0);
  });

  it('Should be able to MinHeapify the heapNodes',()=>{
    minHeap.addHeapNode(0,4,0);
    minHeap.addHeapNode(1,3,0);
    minHeap.addHeapNode(2,2,0);
    minHeap.setPos([0,1,2]);
    minHeap.minHeapify(0);
    expect(minHeap.getHeap()[0].getKey()).to.eql(2)
  });

  it('Should extract node from the Heap',()=>{
    minHeap.addHeapNode(0,4,0);
    minHeap.addHeapNode(1,3,0);
    minHeap.addHeapNode(2,2,0);
    minHeap.setPos([1,2,3]);
    minHeap.minHeapify(0);
    expect(minHeap.extractMin().getKey()).to.eql(2);
  });

  it('Should remove the extracted node from the Heap',()=>{
    minHeap.addHeapNode(0,4,0);
    minHeap.addHeapNode(1,3,0);
    minHeap.addHeapNode(2,2,0);
    minHeap.setPos([1,2,3]);
    minHeap.minHeapify(0);
    minHeap.extractMin();
    expect(minHeap.getHeap()[0].getKey()).to.eql(3);
  });



});
