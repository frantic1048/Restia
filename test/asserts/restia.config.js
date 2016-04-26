import React from 'react';

const tsetMasouText = '真実を貫く剣';

class testMasouComponent extends React.Component {
  render() {
    return (
      <div>
        {tsetMasouText}
        {this.props.children}
      </div>
    );
  }
}

testMasouComponent.propTypes = {
  children: React.PropTypes.element,
};

module.exports = {
  __asserts: { // this property is for TESTING PURPOSE ONLY
    tsetMasouText,
  },
  masou: {
    component: testMasouComponent,
    routes: [
      {name: 'links', path: 'links'},
      {name: 'posts', path: 'posts'},
      {name: 'about', path: 'about'},
      {name: 'post', path: 'posts/:postEntry'},
    ],
  },
};
