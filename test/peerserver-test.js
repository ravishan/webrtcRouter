import expect from 'expect.js';
import peerserver,{generateUniqueID,handleTransaction,handleClosingConnection,handleConnection,peerServerEventListner,socketTransaction} from './../server/peerserver';
import express from 'express';
import http from 'http';
import {Server as webSocketServer} from 'ws';
import WebSocket from 'ws';
import eventemitter,{emitter} from './../server/eventemitter';

describe('peerServer specifications::',()=>{
  var option;
  var server;
  var app;
  var websocket;
  var testSocketServer;
  var callbacks;

  beforeEach(()=>{
    // app = express();
    // server = http.createServer(app);
    //server.listen(8080,()=>{});
    testSocketServer = function(server){
      callbacks = [];
      function send(cb){
        callbacks.push(cb);
      }

      function onConnection(cb){
        callbacks.push(cb);
          return{
            onMessage:(cb)=>{callbacks.push(cb); },
            onClose: (cb)=>{callbacks.push(cb);}
          }
      }

      return {
        send,
        onConnection
      }
    }
  })

  afterEach(()=>{//Cleanup
    callbacks= [];
  })

  xit('should return a new instance ',()=>{
    var peer = new peerserver({},server);
    expect(peer).to.be.ok();
    peer.getSocket()
  });

  xit('should return a socket',()=>{
    var peer = new peerserver({},server);
    expect(peer.getSocket()).to.be.an(webSocketServer);
  });

  it('should Initialize a socket server', ()=>{
    var socketServer = peerserver(undefined,undefined);
    socketServer(testSocketServer);
  })

  it('should provide 3 callbacks', ()=>{
    var socketServer = peerserver(undefined,undefined);
    socketServer(testSocketServer);
    expect(callbacks.length).to.eql(3);
  });

  describe('Message transaction::',()=>{
    const src = 'srcSampleID';
    const dst = 'dstSampleID';

    it('should only accepet the recognized message types (LEAVE,CANDIDATE,OFFER,ANSWER) ',()=>{
      let data = {dst,id:src};
      const clients = {};
      clients[dst]={
           socket: 'sample'
      };
      let {socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(!socket).to.be(true);
      expect(clients === peers).to.be(true);
      expect(!payload).to.be(true);
    });

    it('should send the transaction to the appropriate destination',()=>{
      let data = {type:'CANDIDATE',dst,id:src};
      const clients = {};
      clients[dst]={
           socket: 'sample'
      };
      let {socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(socket === peers[dst].socket).to.be(true);
      expect(clients === peers).to.be(true);
      expect(payload === JSON.stringify(data)).to.be(true);
    });

    it('should remove the peer from the clients for DESTINATION_CLIENT_LEFT message type',()=>{
      let leaveMessage = JSON.stringify({type: 'LEAVE',src: src, dst})
      const clients = {};
      clients[dst]={
           socket: 'sample1'
      };
      clients[src]={
           socket: 'sample2'
      };
      let {socket,peers,payload} = handleTransaction("DESTINATION_CLIENT_LEFT",leaveMessage,clients);
      expect(socket).to.eql(peers[src].socket)
    });

    it('should deliver CANDIDATE message to the destination',()=>{
      let data = {type:'CANDIDATE',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });

    it('should deliver LEAVE message to the destination',()=>{
      let data = {type:'LEAVE',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });

    it('should deliver OFFER message to the destination',()=>{
      let data = {type:'OFFER',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });

    it('should deliver ANSWER message to the destination',()=>{
      let data = {type:'ANSWER',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });
  });

  describe('Generating unique Id',()=>{
    it('should generate a 6 digit number', ()=>{
      const randomNumber = generateUniqueID({});
      expect(randomNumber<=999999).to.be(true);
    });

  });

  describe('Handling ClosingConnection::',()=>{
    const src = 'srcSampleID';
    const dst = 'dstSampleID';
    it('should remove the peer from client list while closing the connection',()=>{
       let clients = {};
       clients[dst]={
         socket: 'sample3',
       };
       let {peers} = handleClosingConnection(clients,dst);
       expect(peers).to.eql({});
    });
  });

  describe('Handling OnConnection',()=>{
    it('should send a message that socket is open along with the clientID',()=>{
        const query = { id: 111,lat:0,long:1};
        let clients = {};
        let{clientID,peers,message} = handleConnection(query,'sampleSocket',clients);
        expect(message).to.eql(JSON.stringify({type: 'OPEN', clientID: clientID}));
    });

    it('should return the socket for that particular client',()=>{
        const query = { id: 111,lat:0,long:1};
        let clients = {};
        let{clientID,peers,message} = handleConnection(query,'sampleSocket',clients);
        expect(clientID).to.be.a('number');
        expect(peers[clientID].coordinates).to.eql({lat:0,long:1});
    });
  });

  describe('Event Emitter specifications:::',()=>{
    var candidates;
    var TestEmitter;
    beforeEach(()=>{
      candidates = [];
      TestEmitter = {
         onMessage(data){
           candidates.push(data);
         },

         onConnection(data){
           candidates.push(data);
         }
       }
      emitter.addListners(TestEmitter);
    });

    afterEach(()=>{
         candidates = [];
    })

    it('should emit onConnection event during handling connection',() => {
      const query = { id: 111, lat:0,long:1};
      let clients = {};
      let{clientID,peers,message,callback} = handleConnection(query,'sampleSocket',clients);
      callback();
      console.log(candidates,"candidates");
      expect(candidates).to.eql([ { '111': { socket: 'sampleSocket', name: 111, coordinates: {lat:0,long:1} } } ]);
    })
    
    /**This is bug***/
    it('Should emit to Onconnection event listner only after handling connection',() => {
      const query = {id: 111, lat:0,long:1};
      let clients = {};
      let{clientID,peers,message,callback} = handleConnection(query,'sampleSocket',clients);
      console.log(candidates,"candidates");
      expect(candidates).to.eql([]);
    })

  });

  describe('Peer Server Listner specifications :::',() => {
    let emitter
    beforeEach(()=>{
     emitter = new eventemitter();
    });
    function is_equal(array1,array2){
      if(array1.length != array2.length){
        return false;
      }
      return array2.every((element,index)=>element===array1[index]);
    }

    it('Should add event listner',()=>{
      let listner = peerServerEventListner()(()=>{});
      emitter.addListners(listner);
      const actualListners = emitter.getEventListners();
      const expectedListners = [listner];
      expect(is_equal(actualListners,expectedListners)).to.be.ok();
    });

    it('Should add graph nodes',()=>{
      let listner = peerServerEventListner()(()=>{});
      let {getNodes}= listner.onConnection({1:{name:1,coordinates:{lat:52.205,long:0.119}},
        0: {name:0,coordinates:{lat:48.857,long:2.351}},
        2: {name:2,coordinates:{lat:48.857,long:2.351}}
      });
      expect(getNodes().length).to.eql(3);
    })

    it('Should add graph nodes',()=>{
      let listner = peerServerEventListner()(()=>{});
      let {getNodes}= listner.onConnection({1:{name:1,coordinates:{lat:52.205,long:0.119}},
        0: {name:0,coordinates:{lat:48.857,long:2.351}},
        6: {name:6,coordinates:{lat:10.857,long:0.444}},
        2: {name:2,coordinates:{lat:48.857,long:2.351}},
        3: {name:3,coordinates:{lat:60.857,long:2.444}},
        4: {name:4,coordinates:{lat:150.857,long:4.444}},
        5: {name:5,coordinates:{lat:300.857,long:1.444}},
        7: {name:7,coordinates:{lat:100.857,long:3.444}},
        8: {name:8,coordinates:{lat:400.857,long:4.444}},
        9: {name:9,coordinates:{lat:500.857,long:5.444}},
        10: {name:10,coordinates:{lat:600.857,long:6.444}},
        11: {name:11,coordinates:{lat:800.857,long:7.444}}


      });
      expect(getNodes().length).to.eql(12);
    })

  });
});
