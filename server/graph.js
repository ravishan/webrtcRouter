import {
    compose2, compose,computeHaversineDistance
}
from './utils';

export const createNode = (name) => {
    let adjList = [];
    let weights = [];
    let vertexId;

    return {
        addEdge: (neighbour, weight) => {
            adjList.push(neighbour);
            weights.push(weight);
        },
        getEdges: () => adjList,
        getWeights: () => weights,
        setEdges: (edgelist) => (adjList=edgelist),
        getName: () => name,
        setVertexId: (id)=>(vertexId=id),
        getVertexId: ()=>vertexId
    };

};


const graph = () => {
    let nodes = [];

    const pushNode = (node) => {nodes.push(node);return node;};


    const isNameNotEqual = (name,value) => {
      if(typeof(value.getName()) === "object"){
          return value.getName()['name'] !== name;}
      else {
          return value.getName() !== name;
      }
    }

    const removeNodeFromList = (name) => {
        nodes = nodes.filter(
            (value) => isNameNotEqual(name,value))
        return name
    };

    const removeNodeFromEdge = (name) => nodes.forEach(
        compose (({edges,value})=>(value.setEdges(edges.filter(
          (value) => isNameNotEqual(name,value)
      ))),(value) => ({edges: value.getEdges(),value}))
    );

    return {
        addNode: compose(pushNode,createNode),
        removeNode: compose(removeNodeFromEdge,removeNodeFromList),
        getNodes: () => nodes,
        removeAllNodes: ()=>(nodes=[])
    };
}


export const haversineDistanceGraph = (haversineDistance = computeHaversineDistance) => (graph) =>{
  const lookUp  = {};
  const addNode = (name) => {
      let prevNodes = Object.assign([],graph.getNodes());
      let srcNode = graph.addNode(name);
      let srcCoord = srcNode.getName()['coordinates'];
      let srcLat   = srcCoord.lat;
      let srcLong  = srcCoord.long;
      var distance = haversineDistance(srcLat,srcLong);
      prevNodes.forEach ((tarNode)=>{
        let {lat:targetLat,long:targetLong} = tarNode.getName()['coordinates'];

        if(!lookUp[[targetLat,targetLong,srcLat,srcLong]] ||
                        !lookUp[[srcLat,srcLong,targetLat,targetLong]]){
             let weight = distance(targetLat,targetLong);
             lookUp[[srcLat,srcLong,targetLat,targetLong]] =
                      lookUp[[targetLat,targetLong,srcLat,srcLong]] = weight;
        }

        srcNode.addEdge(tarNode,lookUp[[srcLat,srcLong,targetLat,targetLong]]);
        tarNode.addEdge(srcNode,lookUp[[targetLat,targetLong,srcLat,srcLong]]);
    });
    return srcNode;
  };

  return {
    addNode,
    removeNode:graph.removeNode,
    getNodes: graph.getNodes,
    removeAllNodes:graph.removeAllNodes
  }
};

export const constructGraph = (data) => {
    console.log(data," Graph");
    let mstGraph = graph();
    let allNodes = {};
    Object.keys(data).forEach((i) => {
      let node = allNodes[i]? allNodes[i]:mstGraph.addNode(i);
      allNodes[i] = node;
      Object.keys(data[i]).forEach((j) => {
          if(i==j){
            return;
          }
          let value = data[i][j];
          let tarNode = allNodes[value]? allNodes[value]:mstGraph.addNode(value);
          allNodes[value] = tarNode;
          tarNode.addEdge(node);
          node.addEdge(tarNode);
      });
    });
    return mstGraph;
};

export const breadthFirstSearch = (graph,comparator) => (aNode,bNode) => {
  let parent = {};
  let queue = [];
  queue.push([aNode]);
  while (queue.length != 0) {
      let path = queue.pop();
      let node = path[path.length-1]
      let parent = path.length>1? path[path.length-2].getName() : undefined;

      if (comparator(bNode)(node)) {
        return path;
      }

      let edges = node.getEdges();
      edges.forEach((edgeNode) => {
        if(parent != undefined && parent === edgeNode.getName()) {
            return;
        }

        let newPath = [...path,edgeNode];
        queue = queue.concat([newPath]);
      })
  }
}

export const contructForwardTable = (searchFn = breadthFirstSearch) => ({graph,currentNode}) => {
  let forwardTable = {};
  let nodes = graph.getNodes();
  let findPath = searchFn(graph,(a)=>(b)=>a.getName()
                                              === b.getName());
   console.log(currentNode," currentNode");
   nodes.forEach((node) => {
        let currentId = currentNode.getName();
        let jName = node.getName();
        if (currentId != jName) {
          let path = findPath(currentNode,node);
          if(path && path.length >1) {
              forwardTable[jName] = path[1].getName();
          }
          //(TODO:RAVI): PUT INVARIANT HERE
        }
    })
   return forwardTable;
}

const currentNode = (id) => (graph_1) => { return {   currentNode:graph_1.getNodes().find((node)=>{console.log(node.getName(),"inside node"); return node.getName()===id}),
                                                    graph:graph_1
                                                }
                                        };

// forwardTable :: number -> fn
export const generateForwardTable = (id) => compose(contructForwardTable(),currentNode(id),constructGraph);



export default graph;