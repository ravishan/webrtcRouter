import {compose} from './utils';

export const createHeapNode = (vertex,key,parent) => {
  return{
    getVertex: ()=>vertex,
    getKey: ()=>key,
    getParent: ()=>parent,
    setKey: (k)=>(key=k)
  };
};


export const createMinHeap = (capacity) => {
  let heap = [];
  let pos = [];
  let size = capacity;
  const pushHeap = (node) => {heap.push(node);return node;};

  const minHeapify = (index) => {
    let smallest = index;
    let left = 2*index +1;
    let right = 2*index +2;

    if(left < size && heap[left].getKey() < heap[smallest].getKey()){
      smallest = left;
    }

    if(right< size && heap[right].getKey() < heap[smallest].getKey()){
      smallest = right;
    }

    if(smallest != index){
      var smallestNode = heap[smallest];
      var indexNode = heap[index];

       //swap pos
       [pos[smallestNode.getVertex()],pos[indexNode.getVertex()]] =
                    [index,smallest];

      //swapping
      [heap[smallest],heap[index]] = [heap[index],heap[smallest]];

      minHeapify(smallest); //recurse the new smallest number
    }
  };

  const extractMin = () => {
    let rootNode = heap[0];
    let lastNode = heap[size-1];
    heap[0] = lastNode;
    //update positions
    pos[rootNode.getVertex()]= heap.length-1; //(TODO: Check here not sure about the logic)
    pos[lastNode.getVertex()]= 0;

    size--;
    minHeapify(0);
    return rootNode
  };

  const bottomUpHeapify = (v,key)=>{
    let index = pos[v];
    heap[index].setKey(key);

      while(index>0 && (heap[index].getKey()< heap[Math.round((index-1)/2)].getKey())){
        [pos[heap[index].getVertex()],pos[heap[Math.round((index-1)/2)].getVertex()]]
                                = [Math.round((index-1)/2),index];
        [heap[index],heap[Math.round((index-1)/2)]] = [heap[Math.round((index-1)/2)],heap[index]];
        index= Math.round((index-1)/2);
      }
  }

  const isInMinHeap = (vertex) =>pos[vertex]<size;

  return {
    getHeap: ()=>heap,
    setHeap: (list)=>heap=list,
    addHeapNode: compose(pushHeap,createHeapNode),
    minHeapify,
    extractMin,
    isInMinHeap,
    setPos: (p)=>(pos=p),
    bottomUpHeapify,
    getSize: ()=>size,
    getPos: ()=>pos
  };
};
