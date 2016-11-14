import expect from 'expect';
import { rtcAgent,PeerConnectionManager } from '../client/rtcagent';
import { webSocketClient } from '../client/wsclient';

var webSocketStub = function (url) {
  let messagesEventCallBack = [];
  let sendMessages = [];

   const onmessage = (cb) => {
    messagesEventCallBack = cb;
  }

  const send = (message) => {
    sendMessages.push(message);
  }

  return {
    onmessage,
    send,
    messagesEventCallBack,
    sendMessages,
    url
  }

}

let connections = [];

var mockPeerConnection=  function (){

   let instance = new function(){
     return {
        createDataChannel: ()=>{
          return {
            onmessage: (msg)=>{

            },
            onopen: ()=>{

            },
            onclose: ()=>{

            },
            close: () => {

            }
          }
        },
        createOffer: ()=>{
          return Promise.resolve("test");
        },
        setLocalDescription: ()=>{

        },
        onicecandidate: () => {

        },
        setRemoteDescription: ()=>{

        },
        createAnswer: () => {
          return {
            then: (e)=>{
              e("test");
            }
          }
        },
        ondatachannel: (e) => {
          console.log(e," -->e")
        }

      }
    }
    connections.push(instance)

    return instance;
}

var MockRTCSessionDescription = function(){
  return {
    setRemoteDescription : (e)=>{

    }
  }
}

//coords.latitude}&long=${position.coords.longitude
var mockNavigator={
  geolocation : {
    getCurrentPosition: (cb) => {
      cb({
          coords: {
            latitude: 0.0,
            longitude: 0.0
          }
      });
    }
  }
}

describe('RTCAgent',function(){
    var rtc = {};
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
    beforeEach(() => {
      rtc = rtcAgent(mockNavigator,webSocketStub,mockPeerConnection,MockRTCSessionDescription,null,()=>null);
    });

    afterEach(()=>{
      connections = [];

    })

    it('Should recieve the webSocket, SendChannel Object and RecieveChannel Object',() => {
      expect(rtc).toIncludeKeys(['webSocketClientObj', 'sendChannel','receiveChannel']);
    });

    it('Should create the dataChannel for the peerIds message ',() => {
       rtc.webSocketClientObj().webSocket.onmessage({data:JSON.stringify({type:"OPEN", clientID:"3"})});
       rtc.webSocketClientObj().webSocket.onmessage({data:JSON.stringify({type:"PEER", childList:["1","2"],mst:data})});
       expect(rtc.sendChannel()).toIncludeKeys(['1', '2']);
    })

    it('Should create the receiveChannel for the offer messages ',() => {
       rtc.webSocketClientObj().webSocket.onmessage({data:JSON.stringify({type:"OFFER", src:"1",sdp:"sample"})});
       connections[0].ondatachannel({channel:webSocketStub});
       expect(rtc.receiveChannel()).toIncludeKeys(['1']);
    })

    it('Should close the stale connection when new peerList arrives',() => {
      rtc.webSocketClientObj().webSocket.onmessage({data:JSON.stringify({type:"OPEN", clientID:"1"})});
      rtc.webSocketClientObj().webSocket.onmessage({data:JSON.stringify({type:"PEER", childList:["4"],mst:data})});
      rtc.webSocketClientObj().webSocket.onmessage({data:JSON.stringify({type:"PEER", childList:["5"],mst:data})});
      expect(rtc.webSocketClientObj().getStaleOffers()).toInclude("4");
    })
})
