import {getVisibleTodos} from '../reducers';
export const messageHandler = (getState,action) => (sendMessage,getId) => (msg) => {
	console.log(msg," inside Message");
	let data ;
	if(msg){
 	 	data = JSON.parse(msg.data);
	}
	if(!data) return; // bailout
	let state = getState(); 
	switch(data.action){
		case 'NEED_TODO_ITEMS':
		 	let todos = getVisibleTodos(state, 'SHOW_ALL');
		 	let message = JSON.stringify({
		 		targetId: data.srcId,
		 		action: 'TODO_ITEMS',
		 		payload: todos,
		 		srcId: getId()
		 	});
		 	sendMessage(message,data.srcId);
		break;
		case 'TODO_ITEMS':
		 	let {payload,srcId} = data
		 	console.log({payload,srcId}," yahooo")
		 	action({
		 		peerId:srcId,
		 		items:payload
		 	});
		break;
		default:
		break;
	}
	console.log(data," inside Message");
}





/**

 TODO: Ravi
		 		1. finish the messageHandler
		 		2. construct component to display the todo

***/