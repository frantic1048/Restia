import { combineReducers } from 'redux-immutable';

import meta from './meta';
import posts from './posts';
import routing from './routing';

export default combineReducers({
  meta,
  posts,
  routing,
});
