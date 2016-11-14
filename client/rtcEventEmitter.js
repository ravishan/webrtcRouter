import eventemitter from '../server/eventemitter';
import Rx from 'rx';
import {compose} from './../server/utils';
import { findPeerChannel,forwardMessage,retriveAllChannelsToForwardTo } from './router';


export default class rtcEventEmitter extends eventemitter {
  onopen(id,msg) {
    this.emitEvent('onopen',id,msg);
  }

  onclose(id,msg) {
    this.emitEvent('onclose',id,msg);
  }
}

export function rtcEmitter (rtcAgent,onNextCb) {
	rtcAgent = rtcAgent((channelStreams) => {
	    mergeChannels(channelStreams).subscribe(onNext,onError,onCompleted);
	});

  const mergeChannels = (channels) => Rx.Observable.merge(...channels);


  const sendMessage = (msg,targetId) => {
   	let target = targetId? targetId : msg.targetId
 		findPeerChannel(rtcAgent.sendChannel(),rtcAgent.receiveChannel(),rtcAgent.webSocketClientObj().getforwardTable(),target).send(msg);
  };

  const notifyAll = (msg) => {
        let messages = retriveAllChannelsToForwardTo(rtcAgent.sendChannel(),rtcAgent.receiveChannel(),rtcAgent.webSocketClientObj().getforwardTable(),msg);
        Object.keys(messages).forEach((index) => {
            let message = messages[index].message;
            let channel = messages[index].channel;
            channel.send(JSON.stringify(message));
        })
  }

  const forwardMessageCb = (send) => (msg) => {
    console.log(msg," msg1")
    let forwardMsg = forwardMessage(rtcAgent.webSocketClientObj().getId())(msg);
    console.log(forwardMsg," forwardMsg");
    if(forwardMsg.NeedToForward){ //ForwardMessage
        sendMessage(msg.data,forwardMsg.targetId);
    }
    console.log(msg," msg")
    return msg;
  };
  
  const getId = () => rtcAgent.webSocketClientObj().getId();

  const onNext = compose(onNextCb(sendMessage,getId),forwardMessageCb(sendMessage,getId));
  const onError = (msg) => {
   	 	console.log("ONError");
   	 	console.log(msg);
  };
  const onCompleted = (msg) => {
 		console.log("onCompleted");
   	 	console.log(msg);
  };
  

   return {
   	    	 	sendMessage,
            notifyAll,
            getPeers: () => Object.keys(rtcAgent.webSocketClientObj().getforwardTable()),
            getId
   	 	    };


 }

// export function rtcEmitter (rtcAgent) {
// 	rtcAgent = rtcAgent((channelStreams)=>{
// 		console.log(channelStreams," channelStreams");
// 	    mergeChannels(channelStreams).subscribe(onNext,onError,onCompleted);
// 	})

//    const mergeChannels = (channels) => Rx.Observable.merge(...channels);
//    const onNext = (msg) => {
//    	 	console.log(msg," came inside");
//    	 	let data;
//    	 	if(msg){
//    	 		data = JSON.parse(msg.data)
//    	 	}
//    	 	if(data && data["targetId"]  && data.targetId !== rtcAgent.webSocketClientObj().getId()) { //forward message
//    	 		console.log(" Inside forward message")
//    	 		peerChannel(data.targetId).send(msg.data)
//    	 	}
//    	 	console.log(msg);
//    }
//    const onError = (msg) => {
//    	 	console.log("ONError");
//    	 	console.log(msg);
//    }
//    const onCompleted = (msg) => {
//  		console.log("onCompleted");
//    	 	console.log(msg);
//    }




//    const lookUpForwardTable = (targetId) => rtcAgent.webSocketClientObj().getforwardTable()[targetId];
//    const getChannel = (id) => rtcAgent.sendChannel()[id]?rtcAgent.sendChannel()[id]:rtcAgent.receiveChannel()[id];
  
//    const peerChannel = compose(getChannel,lookUpForwardTable);

//    return {
//    	 	 	peerChannel : compose(getChannel,lookUpForwardTable)
//    	 	  }


//  }
