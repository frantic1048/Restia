import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from '../store';
import routes from '.routes';

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

export default (
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
);
