import React from 'react';

const tsetMasouText = '真実を貫く剣';

const testMasouComponent = React.createClass({
  render() {
    return <div>{tsetMasouText}</div>;
  },
});

module.exports = {
  __asserts: { // this property is for TESTING PURPOSE ONLY
    tsetMasouText,
  },
  masou: {
    component: testMasouComponent,
    routes: [
      'links',
      'posts',
      'posts/:postEntry',
      'about',
    ],
  },
};
