import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from '../store';
import { updateRoutingState } from '../actions';

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

let _masou;

function createStateEmitter(stateName) {
  return function emitState() {
    store.dispatch(updateRoutingState(stateName));
  };
}

class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={_masou.component}>
            <IndexRoute onEnter={createStateEmitter('index')}/>
            { _masou.routes.map(({name, path}) =>
              <Route
                key={path}
                path={path}
                onEnter={createStateEmitter(name)}
              />
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
