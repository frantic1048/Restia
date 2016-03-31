import { createStore } from  'redux';

import reducer from './reducers';
import middlewares from './middlewares';

const store = createStore(
  reducer,
  middlewares,
);

export default store;
