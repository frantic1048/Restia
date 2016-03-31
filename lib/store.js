import { createStore, applyMiddleware } from  'redux';

import reducer from './reducers';
import middlewares from './middlewares';

const store = createStore(
  reducer,
  applyMiddleware(...middlewares),
);

export default store;
