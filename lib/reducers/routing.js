// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

// TODO: Test me!
export default handleActions({
  [LOCATION_CHANGE]: (state, action) => state.merge(
    Immutable.Map({
      locationBeforeTransitions: action.payload,
    })
  ),
}, Immutable.Map({
  locationBeforeTransitions: undefined,
}));
