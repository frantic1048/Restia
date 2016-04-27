import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from '../store';
import createStateEmitterComponent from './createStateEmitterComponent';

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: (state) => state.get('routing').toJS(),
});

let masou;

const createStateEmitter = createStateEmitterComponent.bind(null, store);

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={masou.component}>
        <IndexRoute component={createStateEmitter('index')} />
        {masou.routes.map(({ name, path }) =>
          <Route
            key={path}
            path={path}
            component={createStateEmitter(name)}
          />
        )}
      </Route>
    </Router>
  </Provider>
);

export default Root;
export function configure(config) {
  masou = config.masou;
}
