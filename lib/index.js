/**
 * emulate a full ES6 environment
 * http://babeljs.io/docs/usage/polyfill/
 */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import RestiaRoot from './components/Root';

class Restia {
  constructor() {
    this.__masou = {
      component: null,
      routes: [],
    };
  }
  masou(m) {
    this.__masou = m;
    return this;
  }
  expand() {
    const target = document.createElement('div');
    target.setAttribute('id', 'restia');
    const targetNode = document.body.appendChild(target);
    return ReactDOM.render(
      <RestiaRoot masou={this.__masou} />,
      targetNode,
    );
  }
}

export default Restia;
