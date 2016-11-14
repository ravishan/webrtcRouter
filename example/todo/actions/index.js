import {v4} from 'node-uuid';

let nextTodoId =0;
export const addTodo = (text) =>({
  type: 'ADD_TODO',
  id: v4(),
  text
});

export const setVisibilityFilter = (filter) => (
 	{
  	 type: 'SET_VISIBILITY_FILTER',
   	filter
 });

export const toggleTodo = (id) =>({
  type: 'TOGGLE_TODO',
  id
});


export const addPeerTodo = ({peerId,items}) => ({
	type: 'ADD_PEER_TODO',
	peerId,
 	items
})


export const getPeerTodo = (peerId) => {
	var message = JSON.stringify({
 		targetId: peerId,
 		action: 'NEED_TODO_ITEMS',
 		srcId: global.rtc.getId()
 	})
 	global.rtc.sendMessage(message,peerId);

	return {
 	 	type: 'SET_VISIBILITY_FILTER',
	 	filter:peerId
  	}
}

export const setPeerView = () => {
 	let peerIds = global.rtc.getPeers()

	return {
 	 	type: 'SET_PEER_IDS',
	 	peerIds
  	}
}
