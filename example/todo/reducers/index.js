import todos, * as fromTodos from './todos';
import visibilityFilter from './visibilityFilter';
import { createStore } from 'redux';
import { combineReducers } from 'redux';


const todoApp = combineReducers({
  todos,
  visibilityFilter
});

export default todoApp;

export const getVisibleTodos = (state,filter) =>
                        fromTodos.getVisibleTodos(state.todos,filter);

export const getAllPeerViews = (state,filter) =>
                        fromTodos.getAllPeerIds(state.todos);

