import React from 'react'
import FilterLink from '../containers/FilterLink'
import { connect } from 'react-redux'
import {getAllPeerViews} from '../reducers';

const FooterMethod = ({peers = []}) => {
  console.log(peers," peers Inside");
  var peerViews = [];
  peerViews = peers.map((i)=>{ console.log(i,'inside'); return (<FilterLink filter= {i}>
                      {i}
                     </FilterLink>)
                  });

  return (<p>
    Show:
    {" "}
    <FilterLink filter="SHOW_ALL">
      All
    </FilterLink>
    {", "}
    <FilterLink filter="SHOW_ACTIVE">
      Active
    </FilterLink>
    {", "}
    <FilterLink filter="SHOW_COMPLETED">
      Completed
    </FilterLink>
    {", "}
    <FilterLink filter="PEER_VIEWS">
      PeerViews
    </FilterLink>
    {", "}
    {peerViews}

  </p>);
}

const mapStateToProps = (state, ownProps) => {
  console.log(getAllPeerViews(state)," all peers");
  return {
    peers: getAllPeerViews(state)
  }
}


const Footer = connect(
  mapStateToProps
)(FooterMethod)



export default Footer

