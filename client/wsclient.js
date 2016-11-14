import EventEmitter from 'events';
import isEqual  from 'lodash/isEqual';
import {generateForwardTable} from '../server/graph';

export const OPEN="OPEN",PEER="PEER",OFFER="OFFER",ANSWER="ANSWER",CANDIDATE="CANDIDATE";
export const webSocketClient = ( webSocket ) => {
  console.log(webSocket,"WebSocket")
  var id=null,
      selfGenerateForwardTable = null,
      forwardTable = null,
      peerIds=[],
      mst = {},
      staleOffers = [],
      offer={
        1: {
          id:"-1",
          sdp:null,
          candidate:null
        }
      },
      ans={
        id:1,
        sdp:null,
        candidate:null
      },
      listeners={
        [OPEN]:[],
        [PEER]:[],
        [OFFER]:[],
        [ANSWER]:[],
        [CANDIDATE]:[]
      };

  const subscribe=(type,fn)=>{
    listeners[type].push(fn);
    return ()=>listeners[type].filter((listener)=>listener!=fn)
  }

  webSocket.onmessage=(e)=>{
        console.log(e.data)
    var msg=JSON.parse(e.data);
    console.log("msg",msg.type)
    if(!msg) return;
    switch(msg.type){
      case OPEN:
        id=msg.clientID;
        selfGenerateForwardTable = generateForwardTable(id.toString());
      break
      case PEER:
        let prevPeers = peerIds;
        peerIds = msg.childList;
        mst = msg.mst;
        console.log(id," peerId");
        forwardTable = selfGenerateForwardTable(mst);
        console.log(forwardTable," forwardTable");
        staleOffers = prevPeers.filter((id) => peerIds.indexOf(id)==-1)

      case OFFER:
    //    offer[msg.src]=msg;
      break;
      case ANSWER:
      break;
      case CANDIDATE:
      break;
      default:
      return;
    }

    listeners[msg.type].forEach((listener)=>{
      console.log(msg)
      listener(msg)
    })
  }
  return {
    getPeers(){
      return peerIds;
    },
    getOffers(){
      return offer;
    },
    getStaleOffers(){
      return staleOffers;
    },
    getId(){
      return id
    },
    sendObject(ob){
      webSocket.send(JSON.stringify(ob))
    },
    getMST(){
      return mst;
    },
    subscribe,
    webSocket,
    getforwardTable(){
      return forwardTable;
    }
  }
}
export const getGeolocation=(navigator)=>(cb)=>{
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      cb(position)
    })
  } else {
    cb(null)
  }
}
