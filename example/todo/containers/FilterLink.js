import { connect } from 'react-redux'
import { setVisibilityFilter,getPeerTodo,setPeerView } from '../actions'
import Link from '../components/Link'
import {getAllPeerViews} from '../reducers';

const mapStateToProps = (state, ownProps) => {
  console.log(getAllPeerViews(state)," state inside");
  console.log(ownProps.filter === state.visibilityFilter," state inside");
  console.log(ownProps.filter," state inside");
  return {
    active: ownProps.filter === state.visibilityFilter,
    peers: getAllPeerViews(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      if(ownProps.filter === 'PEER_VIEWS'){
        dispatch(setPeerView(ownProps.filter));
      } else if(ownProps.filter === 'SHOW_ALL' || ownProps.filter === 'SHOW_ACTIVE' || ownProps.filter === 'SHOW_COMPLETED'){
        dispatch(setVisibilityFilter(ownProps.filter));
      } else {
        dispatch(getPeerTodo(ownProps.filter));
      }
      
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink
