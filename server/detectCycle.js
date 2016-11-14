
export const isCycle = (graph) => {
  let parent = [];

  for(let index =0;index<graph.getNodes().length;index++){
    parent[index] = -1;
  }

  for(let index =0; index<graph.getNodes().length;index++){
    let uNode = graph.getNodes()[index];
    let edgesList = uNode.getEdges();

    let srcSet = find(parent,uNode.getName());
    for(let edge=0;edge<edgesList.length;edge++){
      let vNode = edgesList[edge];
      let targetSet = find(parent,vNode.getName());
      if(targetSet === srcSet){
        return true;
      }
      parent = union(parent,targetSet,srcSet);
    }
  }

  return false;

}

const find = (parent,index) => {
  if(parent[index] === -1){
    return index;
  }
  return find(parent,parent[index]);
};

const union = (parent,x,y) => {
  let x_set = find(parent,x);
  let y_set = find(parent,y);

   parent[x_set] = y_set;
   return parent;
};
