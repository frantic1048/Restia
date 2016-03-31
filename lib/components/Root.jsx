import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from '../store';

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

// TODO: test me!
export default (content) => ( // eslint-disable-line no-extra-parens
  <Provider store={store}>
    <Router history={history}>
      {content}
    </Router>
  </Provider>
);
