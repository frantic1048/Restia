// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import { UPDATE_ROUTING_STATE } from '../constants/ActionTypes';

export default handleActions({
  [LOCATION_CHANGE]: (state, action) => state.merge(
    Immutable.Map({
      locationBeforeTransitions: action.payload,
    })
  ),
  [UPDATE_ROUTING_STATE]: (state, action) => state.merge(
    Immutable.Map({
      state: action.payload.state,
      params: action.payload.params,
    })
  ),
}, Immutable.Map({
  locationBeforeTransitions: undefined,
  state: undefined,
  params: undefined,
}));
