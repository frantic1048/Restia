import React              from 'react';
import { Provider }       from 'react-redux';
import { createStore, combineReducers, appleMiddleware} from 'redux';
import { Router, Route, browserHistory } from 'react-router-redux';

import reducers from '../reducers';

const reducer =  combineReducers({
  ...reducers,
  routing: routeReducer,
});

const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleWare = appleMiddleware(reduxRouterMiddleware)(createStore);

const store = createStoreWithMiddleWare(reducer);

const RestiaApp = () => ( // eslint-disable-line no-extra-parens
  <div>
    RestiaApp
  </div>
);

export default (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={RestiaApp} />
    </Router>
  </Provider>
);
