// disable react/no-multi-comp for testing.
/* eslint-disable react/no-multi-comp */

// make jasmine pretty print
// http://stackoverflow.com/a/26324116/2488867
jasmine.pp = (obj) => {
  return JSON.stringify(obj, undefined, 2);
};

import React from 'react';
import ReactDOM from 'react-dom';
// import ReactTestUtils from 'react-addons-test-utils';

import Restia from '../../lib';

const tsetMasouText = '真実を貫く剣';
const testMasou = React.createClass({
  render() {
    return <div>{tsetMasouText}</div>;
  },
});

describe('Restia', () => {
  it('should have initial attributes', () => {
    const restia = new Restia();
    expect(restia.__masou)
      .toEqual(jasmine.any(Object));
  });

  it('.masou()', () => {
    const restia = new Restia();
    restia.masou(testMasou);
    expect(restia.__masou)
      .toEqual(testMasou);
  });

  it('.expand()', () => {
    const target = document.createElement('div');
    target.setAttribute('id', 'restia');
    const targetNode = document.body.appendChild(target);
    const restia = new Restia();
    restia
      .masou(testMasou)
      .expand();
    expect(targetNode.textContent)
      .toEqual(tsetMasouText);

    // unmount component for further test
    ReactDOM.unmountComponentAtNode(targetNode);
  });

  it('.expand(targetNode)', () => {
    const target = document.createElement('div');
    target.setAttribute('id', 'restia-target');
    const targetNode = document.body.appendChild(target);
    const restia = new Restia();
    restia
      .masou(testMasou)
      .expand(targetNode);
    expect(targetNode.textContent)
      .toEqual(tsetMasouText);

    // unmount component for further test
    ReactDOM.unmountComponentAtNode(targetNode);
  });
});
