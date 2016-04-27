import { createStore, applyMiddleware, compose } from 'redux';

import reducer from './reducers';
import middlewares from './middlewares';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(...middlewares),

    // link to redux-devtools
    // https://github.com/zalmoxisus/redux-devtools-extension#2-use-with-redux
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

export default store;
