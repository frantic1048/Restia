import { createAction } from 'redux-actions';

import { UPDATE_ROUTING_STATE } from '../constants/ActionTypes';

export default createAction(
  UPDATE_ROUTING_STATE,
  stateName => stateName,
);
