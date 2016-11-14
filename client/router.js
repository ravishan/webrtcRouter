   import {compose} from './../server/utils';
   const lookUpForwardTable = (forwardTable) => (targetId) => forwardTable[targetId];
   const getChannel = (sendChannel,receiveChannel) => (id) => sendChannel[id]? sendChannel[id] : receiveChannel[id];

   const findPeerChannel = (sendChannel,receiveChannel,forwardTable,id) => compose(getChannel(sendChannel,receiveChannel),lookUpForwardTable(forwardTable))(id)
   
   const prepareMessageForAllPeers = (msg) => (targetId) => ({
      targetId,
      payload: msg
   });

   const retriveAllChannelsToForwardTo = (sendChannel,receiveChannel,forwardTable,msg) => {
      let messages = {}
      let appendIdInMessage = prepareMessageForAllPeers(msg);
      let getCurrentChannel = getChannel(sendChannel,receiveChannel);

      Object.keys(forwardTable).forEach((item) => {
            messages[item]= {
               channel : getCurrentChannel(forwardTable[item]),
               message : appendIdInMessage(item)
            }
      })
      return messages;
   }

   const forwardMessage = (id) => (msg) => {
         let data;
         if(msg){
            data = JSON.parse(msg.data)
         }
         if(data && data["targetId"]  && data.targetId != id)
         {
            return {
               NeedToForward: true,
               targetId: data["targetId"]
            }
         }
         return {
            NeedToForward: false
         }
   }

   export {
      findPeerChannel,
      forwardMessage,
      retriveAllChannelsToForwardTo
   }