import React from 'react';

export default function(emitState) {
  return class StateEmitter extends React.Component {
    componentDidMount() { emitState(); }
    render() { return null; }
  };
}
