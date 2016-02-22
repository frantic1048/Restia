// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import { UPDATE_LOCATION } from 'react-router-redux';

export default handleActions({
  [UPDATE_LOCATION]: (state, action) => state.merge(
    Immutable.fromJS({
      location: action.payload,
    })
  ),
}, Immutable.fromJS({
  location: undefined,
}));
