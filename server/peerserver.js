import express from 'express';
import http from 'http';
import url from 'url';
import {emitter} from './eventemitter';
import graph,{haversineDistanceGraph} from './graph';
import {primMST} from './minimumSpanningTree'
/*
(TODO:Ravi)

*/

const peerserver = (option) => (socketServer) => {
      let{ send, onConnection} = socketServer(option);
      let {onMessage, onClose } = onConnection(handleConnection);
      onMessage(handleTransaction);
      onClose(handleClosingConnection);
}

export function handleClosingConnection(peers,clientID){
    delete peers[clientID];

    return {
      peers: Object.assign({},peers)
    }
}



export function handleTransaction(transactionType,data,peers){
  try{
    let message = JSON.parse(data);
    if (['LEAVE', 'CANDIDATE', 'OFFER', 'ANSWER'].indexOf(message.type) !== -1) {
        let type = message.type;
        let src = message.src;
        let dst = message.dst;
        console.log(src);
        if(transactionType === 'DESTINATION_CLIENT_LEFT'){
            delete peers[dst];
            if(src){
              let payload = JSON.stringify({
                type:'PEER_LEFT',
                dst: src

              });
              return {
                socket: peers[src].socket,
                payload,
                peers: Object.assign({},peers)
              }
            }
        };

        let destinationClient = peers[dst];
        if(destinationClient){
          let payload = JSON.stringify(message);
          console.log(payload);
          return {
            peers,
            payload,
            socket: destinationClient.socket
          }
        };

        return {
          peers: Object.assign({},peers)
        };

    }else{
      // console.log('ERROR PeerServer: ', 'unrecognized message');
      return {
        peers
      }
    }
  }catch(e){
    throw e;
  }
}


export function handleConnection(query,socket,peers){
    let id = query.id;
    let lat = query.lat;
    let long = query.long;
    console.log(id);
    console.log(lat);
    console.log(long);
    if(!lat && !long){
      return {
        peers,
        message: JSON.stringify({ type: 'ERROR', description:'Client need to provide the current coordinates'})
      };
    };

    id = id?id:generateUniqueID(peers);
    let client = peers[id]?peers[id]:{};
    client.name = id;
    client.socket = socket;
    client.coordinates = {
      lat,
      long
    }
    let message = JSON.stringify({ type: 'OPEN', clientID: id});
    peers= Object.assign({},peers,{[id]:client});

//    emitter.onConnection(peers); //Emit event

    return {
      clientID: id,
      peers,
      message,
      callback: () => emitter.onConnection(peers)
    };

};


export function generateUniqueID (clients){
  let randomNumber = generateRandomID();
  console.log(randomNumber);
  while(clients[randomNumber]){
    randomNumber = generateRandomID();
  }
  return randomNumber;
};

export function generateRandomID(){
    return Math.floor(100000 + Math.random() * 900000);
};

export const peerServerEventListner = (peerStore = {},minimumSpanningTree = {})=>(handleTransaction)=>({
  onConnection: (peers)=>{

    try{
      let adjList = {}
      let childPeers = {};
      let peerStore = {};
      for (var id in peers) { peerStore[id] = peers[id]; }
      let peerGraph = graph();
      let {addNode,removeNode,getNodes} = haversineDistanceGraph()(peerGraph);
      Object.keys(peerStore).forEach((peer)=>addNode(peerStore[peer]));
      let mst = primMST(peerGraph);
      let nodes = getNodes();
      console.log(mst,'MST');


      nodes.forEach((srcNode,index) => {
        let name = srcNode.getName()['name'];

        if(index == 0){
          adjList[name] = name;
          return; // TODO: skip it beacuse it is the root node. Handle it better you FOOL
        }

        let dst = mst[srcNode.getVertexId()];
        let dstNode = nodes[dst];

        let adjClient = adjList[name]? adjList[name]:{};
        adjClient[dst] = dstNode.getName()['name'];
        adjList[name] = adjClient;

        let client = childPeers[index]?childPeers[index]:{};
        client[dst] = dstNode.getName()['name'];
        childPeers[index]=client;
      });
      console.log(adjList," childPeers");

      //send the graph to the root node
      handleTransaction(nodes[0].getName(),[],adjList);


      //send the new peers to each other according to mst

      Object.keys(childPeers).forEach((childs,index)=>{
        let srcNode = nodes[childs]; console.log(childs);
        var childList = [];
        console.log(childs)
        Object.keys(childPeers[childs]).forEach((peer)=>{
          //console.log(nodes[peer].getName()['name'],'inside');
         // console.log(peer," peer");
          childList.push(nodes[peer].getName()['name']);
        });
       // console.log(srcNode.getName()['name'],'list');

        handleTransaction(srcNode.getName(),childList,adjList);
      });

      return {
        getNodes
      };
    }catch(e){
      console.log(e);
      throw e;
    }finally{
    }
  }
});

export const socketTransaction = (srcNode,childList,mst)=>{
  console.log(srcNode,'trans');
  // if(childList.length ==0){
  //   return;
  // }
  srcNode.socket.send(JSON.stringify({
    type:'PEER',
    childList,
    mst
  }));
}

export default peerserver;
