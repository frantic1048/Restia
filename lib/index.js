/**
 * emulate a full ES6 environment
 * http://babeljs.io/docs/usage/polyfill/
 */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import RestiaRoot from './components/Root';
import configure, { initConfig } from './configurator';
class Restia {
  constructor(userConf) {
    configure(userConf);
    this.config = userConf || initConfig;
  }
  expand() {
    const target = document.createElement('div');
    target.setAttribute('id', 'restia');
    const targetNode = document.body.appendChild(target);
    return ReactDOM.render(
      <RestiaRoot />,
      targetNode,
    );
  }
}

export default Restia;
