import { combineReducers } from 'redux';
import todo from './todo';

console.log(todo);

const byId = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
    case 'TOGGLE_TODO':
      return Object.assign({},state,
                {[action.id]: todo(state[action.id], action)});
    case 'ADD_PEER_TODO':
      return Object.assign({},state,{[action.peerId]: action.items})
    default:
      return state;
  }
};

const allPeerIds = (state = [],action) => {
  switch (action.type) {
    // case 'ADD_PEER_TODO': {
    //   if(state.indexOf(action.peerId) === -1){
    //     return [...state,action.peerId];  
    //   }
    // }
    case 'SET_PEER_IDS': {
       return [...action.peerIds]
    }
    default:
      return state;
  }
}



const allIds = (state = [],action) =>{
  switch (action.type) {
    case 'ADD_TODO':
      return [...state,action.id];
    default:
      return state;
  }
}

const todos = combineReducers({
  byId,
  allIds,
  allPeerIds
});

const getAllTodos = (state) => state.allIds.map(id=>state.byId[id]);

const getAllPeerTodos = (state) => state.allPeerIds.map(id=>state.byId[id]);

const getPeerTodos = (state,id) => state.byId[id];
export const getAllPeerIds = (state) => state.allPeerIds;

export const getVisibleTodos = (state,filter) => {
  if(filter === 'PEER_VIEWS') {
      //return getAllPeerTodos(state)
      filter = 'SHOW_ALL';
  } else if(getAllPeerIds(state).indexOf(filter) != -1){
      console.log(getPeerTodos(state,filter)," inside the box")
      return getPeerTodos(state,filter)
  }
  const allTodos = getAllTodos(state);
  switch(filter){
    case 'SHOW_ALL':
      return allTodos;
    case 'SHOW_COMPLETED':
      return allTodos.filter((todo)=>todo.completed);
    case 'SHOW_ACTIVE':
      return allTodos.filter((todo)=>!todo.completed);
    default:
      throw new Error(`Unkown command: ${filter}`);
  }
};




export default todos
