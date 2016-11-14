import {Server} from 'ws';
import url from 'url';

export default function webSocketServer(option){
  return createWebsocketServer()(new Server({
    server: option.server
  }));
}

export function createWebsocketServer(clients = {}){

  return function(webSocket){
        function send(cb){
              return webSocket.send(cb());
        }

        function onConnection(connectionCB){
          let onMessageCallback;
          let onCloseCallback;

          webSocket.on('connection',(socket)=>{
            let query = url.parse(socket.upgradeReq.url, true).query;
            let {clientID,peers,message,callback} = connectionCB(query,socket,clients);
            clients = peers
            socket.send(message);
            onMessage(socket,clientID)(onMessageCallback);
            onClose(socket,clientID)(onCloseCallback);
            callback();
          });



          return {
             onMessage:(cb)=>{onMessageCallback = cb},
             onClose: (cb)=>{onCloseCallback = cb}
          }
        };

      function onMessage(socket,clientID){
        return function(cb){
          return socket.on('message',(message)=>{
            let{ socket,peers,payload } = cb("SEND_TO_DESTINATION",message,clients);
            clients = peers;
              try{
                if(socket){
                  socket.send(payload);
                }
              }catch(e){
                 cb("DESTINATION_CLIENT_LEFT",payload,clients);
              }
          });
        }
      };

      function onClose(socket,clientID){
        return function(cb){
          return socket.on('close',()=>{
              let{peers} = cb(clients,clientID);
              clients = peers;
          });
        }
      }

      return {
        send,
        onConnection,
        getClients : ()=>clients
      };
  }
}
