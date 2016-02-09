import { FETCH_META_REQUEST,
         FETCH_META_FAILURE,
         FETCH_META_SUCCESS } from '../constants/ActionTypes';
import { handleActions } from 'redux-actions';

export default handleActions({
  FETCH_META_REQUEST: (state, action) => state,
  FETCH_META_SUCCESS: (state, action) => state,
  FETCH_META_FAILURE: (state, action) => state,
});
