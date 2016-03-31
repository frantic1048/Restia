import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from '../store';

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

export default (content) => ( // eslint-disable-line no-extra-parens
  <Provider store={store}>
    <Router history={history}>
      {content}
    </Router>
  </Provider>
);
