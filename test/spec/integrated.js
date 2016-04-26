// disable react/no-multi-comp for testing.
/* eslint-disable react/no-multi-comp */

// make jasmine pretty print
// http://stackoverflow.com/a/26324116/2488867
jasmine.pp = (obj) => {
  return JSON.stringify(obj, undefined, 2);
};

import ReactDOM from 'react-dom';
// import ReactTestUtils from 'react-addons-test-utils';

import Restia from '../../lib';
import testConfig from '../asserts/restia.config';

describe('Restia', () => {
  it('should TypeError when config is not satisfied', () => {
    expect(() => {
      return new Restia(null);
    }).toThrowError(TypeError);
  });

  it('should apply passed user config', () => {
    const restia = new Restia(testConfig);
    expect(restia.config)
    .toEqual(testConfig);
  });

  it('.expand()', () => {
    const restia = new Restia(testConfig);
    const targetNode = restia.expand();

    const { tsetMasouText } = testConfig.__asserts;
    expect(targetNode.textContent)
      .toEqual(tsetMasouText);

    // unmount component for further test
    ReactDOM.unmountComponentAtNode(targetNode);
    targetNode.remove();
  });
});
