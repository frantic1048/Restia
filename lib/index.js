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
    this.__masou = <div />;
  }
  masou(m) {
    this.__masou = m;
    return this;
  }
  expand(target = document.getElementById('restia')) {
    return ReactDOM.render(
      <RestiaRoot masou={this.__masou} />,
      target,
    );
  }
}

export default Restia;
