import React from 'react';

export default function(emitState) {
  return class StateEmitter extends React.Component {
    constructor(props) { super(props); }
    componentDidMount() { emitState(); }
    render() { return null; }
  };
}
