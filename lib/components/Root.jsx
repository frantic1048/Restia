import React              from 'react';
import { Provider }       from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Void from './Void';
import store from '../store';

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: (state) => state.get('routing'),
});

class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { masou } = this.props;
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={masou.component}>
            { masou.routes.map((path) =>
              <Route path={path} key={path} component={Void} />
            )}
          </Route>
        </Router>
      </Provider>
    );
  }
}

Root.propTypes = {
  masou: React.PropTypes.object,
};

export default Root;
