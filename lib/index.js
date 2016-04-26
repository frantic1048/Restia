/**
 * emulate a full ES6 environment
 * http://babeljs.io/docs/usage/polyfill/
 */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import RestiaRoot from './components/Root';
import configure from './configurator';

class Restia {
  constructor(userConf) {
    configure(userConf);
    this.config = userConf;
  }
  expand() {
    const target = document.createElement('div');
    const targetNode = document.body.appendChild(target);
    ReactDOM.render(
      <RestiaRoot />,
      targetNode,
    );
    return targetNode;
  }
}

export default Restia;
