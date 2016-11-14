import { webSocketClient,getGeolocation,OPEN ,PEER,OFFER,ANSWER,CANDIDATE} from './wsclient';
import curry from 'lodash/curry';
import Rx from 'rx';


export const rtcAgent = curry((navigator,WebSocket,RTCPeerConnection,RTCSessionDescription,RTCIceCandidate,eventCallback) => {
  var createOfferConnection=null;
  var createAnswerConnection=null;
  var webSocketClientObj=null;
  var sendChannel = {};
  var receiveChannel = {};
  var channelStreams = [];
  const locationMontior=getGeolocation(navigator);

  locationMontior(function(position){
    if(position){ console.log("INSIDE");
      if(!webSocketClientObj) {
        const webSocket = new WebSocket(`wss://ravi-zt46.tsi.zohocorpin.com:9090/rtcserver?lat=${position.coords.latitude}&long=${position.coords.longitude}`)
        webSocketClientObj=new webSocketClient(webSocket);
      }
      else {
        webSocketClientObj.sendObject({type:"updatelocation",coords:{lat:position.coords.latitude,long:position.coords.longitude}});
      }
      var pm=PeerConnectionManager(RTCPeerConnection);
      
      webSocketClientObj.subscribe(OPEN,function(){});

      webSocketClientObj.subscribe(PEER,function(msg){
        var peerIds = webSocketClientObj.getPeers();

        //Close the previously connected Peers which are not needed.
        var prevOfferedPeers = webSocketClientObj.getStaleOffers();//
        prevOfferedPeers.forEach((peerId) => {
          sendChannel[peerId].close()
        })

        //Offer connection for the new peers
        peerIds.forEach((peerId) => {
          var connection=pm(peerId);
          sendChannel[peerId] = connection.createDataChannel('sendDataChannel',null);
          connection.createOffer().then(function(sdp) {
            connection.setLocalDescription(sdp,()=>{},(e)=>{console.log(e)});
            webSocketClientObj.sendObject({type:OFFER,src:webSocketClientObj.getId(),dst:peerId,sdp:sdp});
          },(e)=>{console.log(e)});
            let source = Rx.Observable.create(observer => {
              console.log(observer," observer");
              sendChannel[peerId].onmessage = (msg) => {
               observer.onNext(msg);
            };

              sendChannel[peerId].onopen = (msg) => {
               console.log(msg," SENDCHANNEL OPEN");
            };

              sendChannel[peerId].onclose = (msg) => {
                observer.onCompleted();
                delete sendChannel[peerId];
            };

            return function(){
              console.log("disposable");
            }
          })
          channelStreams.push(source);
          if(eventCallback) eventCallback(channelStreams); // (TODO: Have a better way to handle this)
        })
      })
      webSocketClientObj.subscribe(OFFER,function(msg){
          var connection = pm(msg.src);
          var srcId = parseInt(msg.src);
          connection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          connection.createAnswer().then(function(sdp) {
            connection.setLocalDescription(sdp,()=>{},(e)=>{console.log(e)});
            connection.ondatachannel = (event) => {
              receiveChannel[srcId] = event.channel;
              let source = Rx.Observable.create(observer => {
                receiveChannel[srcId].onmessage  = (msg) => {
                     observer.onNext(msg);
                     console.log(msg);
                };
                receiveChannel[srcId].onopen = () => {
                      observer.onNext();
                     console.log("r-open")
                };
                receiveChannel[srcId].onclose = () =>{
                     observer.onCompleted();
                     delete receiveChannel[srcId];
                     console.log("r-close")
                }

                return function(){
                    console.log("disposable");
                }

              })
              channelStreams.push(source);
              if(eventCallback) eventCallback(channelStreams);
            }

           webSocketClientObj.sendObject({type:ANSWER,src:webSocketClientObj.getId(),dst:msg.src,sdp:sdp});
        },(e)=>{console.log(e)});
      })
      webSocketClientObj.subscribe(ANSWER,function(msg){
      //  var offer = webSocketClientObj.getOffers();
        var connection = pm(msg.src);
        connection.setRemoteDescription(new RTCSessionDescription(msg.sdp));

      })
      webSocketClientObj.subscribe(CANDIDATE,function(msg){
        var connection = pm(msg.src);
        connection.addIceCandidate(new RTCIceCandidate(msg.candidate))
      })
      function PeerConnectionManager (RTCPeerConnection) {
        var peerConnections={};
        return (id)=>{
          if(!peerConnections[id]){
              peerConnections[id]=new RTCPeerConnection(null,null)
          }
          else{
            console.log("old")
          }
          peerConnections[id].onicecandidate = function (evt) {
            if(evt.candidate)
             webSocketClientObj.sendObject({ type:CANDIDATE, candidate:evt.candidate,src:webSocketClientObj.getId(),dst:id });
         };
         console.log(peerConnections[id].onicecandidate)
          return peerConnections[id];
        }
      }
    }
  })
  return{
    webSocketClientObj: () => webSocketClientObj ,
    sendChannel:()=>sendChannel,
    receiveChannel:()=>receiveChannel,
    getChannelStreams:()=>channelStreams
  }
})
