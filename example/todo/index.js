import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'
import {loadState, saveState} from './localstorage'
import {rtcAgent,rtcEmitter} from '../../client'
import {messageHandler} from './handler/messageHandler'
import { addPeerTodo } from './actions'


const persistedState = loadState()

let store = createStore(todoApp,persistedState);


store.subscribe(() => {
  console.log(store.getState()," starting");
  saveState(store.getState());
});

console.log(window,"RTCPeerConnection");
var agent = rtcAgent(navigator,WebSocket,RTCPeerConnection,RTCSessionDescription,RTCIceCandidate);
var rtc = rtcEmitter(agent,messageHandler(store.getState,({peerId,items}) => {
 		store.dispatch(addPeerTodo(({peerId,items}))) }));

global.rtc = rtc;



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
