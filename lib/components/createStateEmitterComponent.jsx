import React from 'react';

import { updateRoutingState } from '../actions';

export default function (store, stateName) {
  class StateEmitter extends React.Component {
    componentDidMount() {
      store.dispatch(updateRoutingState({
        state: stateName,

        // pass Route params into store.
        // https://github.com/reactjs/react-router/blob/master/docs/API.md#params
        params: this.props.params,
      }));
    }
    render() { return null; }
  }

  StateEmitter.propTypes = {
    params: React.PropTypes.object.isRequired,
  };
  return StateEmitter;
}
