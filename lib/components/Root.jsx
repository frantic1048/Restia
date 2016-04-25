import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Void from './Void';
import store from '../store';

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

let _masou;

class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={_masou.component}>
            { _masou.routes.map((path) =>
              <Route path={path} key={path} component={Void} />
            )}
          </Route>
        </Router>
      </Provider>
    );
  }
}

export default Root;
export function configure({masou}) {
  _masou = masou;
}
