import { combineReducers } from 'redux-immutable';

import meta from './meta';
import posts from './posts';

export default combineReducers({
  meta,
  posts,
});
