import expect from 'expect.js'
import graph, {createNode} from './../server/graph';
import {primMST} from './../server/minimumSpanningTree';
import {isCycle} from './../server/detectCycle'

describe('Minimum spanning tree specifications',()=>{
  let rootGraph, mstGraph;
    beforeEach(()=>{
      let {addNode,getNodes} = graph();
      let node0 = addNode(0);
      let node1 = addNode(1);
      let node2 = addNode(2);
      let node3 = addNode(3);
      let node4 = addNode(4);
      let node5 = addNode(5);
      let node6 = addNode(6);
      let node7 = addNode(7);
      let node8 = addNode(8);

      node0.addEdge(node1,4);
      node1.addEdge(node0,4);

      node0.addEdge(node7,8);
      node7.addEdge(node0,8);

      node1.addEdge(node2,8);
      node2.addEdge(node1,8);

      node1.addEdge(node7,11);
      node7.addEdge(node1,11);

      node2.addEdge(node3,7);
      node3.addEdge(node2,7);

      node2.addEdge(node8,2);
      node8.addEdge(node2,2);

      node2.addEdge(node5,4);
      node5.addEdge(node2,4);

      node3.addEdge(node4,9);
      node4.addEdge(node3,9);

      node3.addEdge(node5,14);
      node5.addEdge(node3,14);

      node4.addEdge(node5,10);
      node5.addEdge(node4,10);

      node5.addEdge(node6,2);
      node6.addEdge(node5,2);

      node6.addEdge(node7,1);
      node7.addEdge(node6,1);

      node6.addEdge(node8,6);
      node8.addEdge(node6,6);

      node7.addEdge(node8,7);
      node8.addEdge(node7,7);

      rootGraph = {addNode,getNodes};
      mstGraph = graph();
    })
    it('Should contain all Nodes',()=>{
      let mst = primMST(rootGraph);
      expect (mst).to.eql([ -1, 0, 5, 2, 3, 6, 7, 0, 2 ]);
    });                 //[  0   1, 2, 3, 4, 5, 6, 7, 8 ]

    it('Should be acyclic',()=>{
      let mst = primMST(rootGraph);

      let node0 = mstGraph.addNode(0);
      let node1 = mstGraph.addNode(1);
      let node2 = mstGraph.addNode(2);
      let node3 = mstGraph.addNode(3);
      let node4 = mstGraph.addNode(4);
      let node5 = mstGraph.addNode(5);
      let node6 = mstGraph.addNode(6);
      let node7 = mstGraph.addNode(7);
      let node8 = mstGraph.addNode(8);

      node1.addEdge(node0);
      node2.addEdge(node5);
      node3.addEdge(node2);
      node4.addEdge(node3);
      node5.addEdge(node6);
      node6.addEdge(node7);
      node7.addEdge(node0);
      node8.addEdge(node2);

      expect(isCycle(mstGraph)).to.not.be.ok();

    });

    it('',()=>{

    })
})
