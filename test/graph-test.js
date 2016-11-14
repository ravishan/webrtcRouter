import graph, {createNode,haversineDistanceGraph,constructGraph,breadthFirstSearch,contructForwardTable,generateForwardTable} from './../server/graph';
import {computeHaversineDistance} from './../server/utils';
import expect from 'expect.js';
import {compose} from './../server/utils';

describe('Graph Specification ::',()=>{

   it('Should add Nodes in Graph',()=>{
      let {addNode,getNodes} = graph();
      addNode(0);
      expect(getNodes().length).to.eql(1);

   });

   it('Should remove node from NodeList',()=>{
      let {addNode,getNodes,removeNode} = graph();
      addNode('sample');
      removeNode('sample');
      expect(getNodes().length).to.eql(0);
   });

   it('Should remove node from the edge list ',()=>{
     let {addNode,getNodes,removeNode} = graph();
     let node1 = addNode('sample');
     let node2 = addNode('happy');
     node2.addEdge(node1);
     removeNode('sample');
     expect(node2.getEdges().length).to.eql(0);
   })

  describe('Node specifications ::',()=>{
    it('Should return object on creating a node',()=>{
      let node1 = createNode("sample");
      expect(node1).to.be.ok();
    });

    it('Should return Name api',()=>{
      let node1 = createNode('sample');
      expect(node1.getName()).to.eql('sample');
    });

    it('Should add edges',()=>{
      let {addEdge,getEdges} = createNode('sample');
      addEdge(createNode('happy'),5);
      expect(getEdges().length).to.eql(1);
    });

    it('should return edges',()=>{
      let {addEdge,getEdges} = createNode('sample');
      addEdge(createNode('happy'),5);
      expect(getEdges()[0].getName()).to.eql('happy');
    });

  });

  describe('HaversineDistanceGraph specifications:::',()=>{
    var newNode1,newNode2,newNode3,remove,nodes
    before(()=>{
      var {addNode,removeNode,getNodes} =
                    haversineDistanceGraph(computeHaversineDistance)(graph());
      newNode1 = addNode({name:0,coordinates:{lat:52.205,long:0.119}});
      newNode2 = addNode({name:1,coordinates:{lat:48.857,long:2.351}});
      newNode3 = addNode({name:2,coordinates:{lat:48.857,long:2.351}});
      remove = removeNode;
      nodes = getNodes;

    })
    it('Should compute weight',()=>{
      expect(newNode1.getWeights()[0]).to.eql(404.2791639886792);
    });
    it('Should add Edges ',()=>{
      expect(newNode1.getEdges()[0].getName()).to.eql({ name: 1, coordinates: { lat: 48.857, long: 2.351 } });
    });

    it('Should have corresponding weight with respect to edge',()=>{
      expect(newNode1.getWeights()[0]).to.eql(404.2791639886792);
    });

    it('Should have add the bidirectional edge ',()=>{
      expect(newNode2.getEdges()[0].getName()).to.eql({name:0,coordinates:{lat:52.205,long:0.119}});
    });

    it('Should have add the bidirectional edge weight ',()=>{
      expect(newNode2.getWeights()[0]).to.eql(404.2791639886792);

    });

    it('Should remove the node ',() => {
       remove(0);
       expect(nodes()[0].getName()['name']).to.eql(1);
    });

    it('Should remove the node from the edge list ',() => {
        expect(nodes()[0].getEdges().length).to.eql(1);
        expect(nodes()[0].getEdges()[0].getName()['name']).to.eql(2);
    });
  });

  describe('Construct Forward Table',() => {
    it('Should construct Forward Table',() => {
        let data = { '1': { '0': 0 },
                     '2': { '0': 0 },
                     '3': { '0': 0 },
                     '4': { '1': 1 },
                     '5': { '1': 1 },
                     '6': { '8': 8 },
                     '7': { '6': 6 },
                     '8': { '0': 0 },
                     '9': { '6': 6 },
                    '10': { '6': 6 },
                    '11': { '6': 6 } }

         expect(generateForwardTable('1')(data)).to.eql({ '0': 0,
                                             '2': 0,
                                              '3': 0,
                                              '4': '4',
                                              '5': '5',
                                              '6': 0,
                                              '7': 0,
                                              '8': 0,
                                              '9': 0,
                                              '10': 0,
                                              '11': 0 });

    })
  })


});
