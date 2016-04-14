import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from '../store';

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

export default React.createClass({
  // TODO: add propTypes for masou
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={this.props.masou} />
        </Router>
      </Provider>
    );
  },
});
