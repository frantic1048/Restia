import { createAction } from 'redux-actions';

import types from '../constants/ActionTypes';

const fetchMetaRequest = createAction(types.FETCH_META_REQUEST);

const fetchMetaSuccess = createAction(
  types.FETCH_META_SUCCESS,
  meta => meta,
);

const fetchMetaFailure = createAction(
  types.FETCH_META_FAILURE,
  ex => ex,
);

export default () => (dispatch) => {
  dispatch(fetchMetaRequest());
  return fetch('/restia_meta.json')
    .then(res => res.json())
    .then(json => dispatch(fetchMetaSuccess(json)))
    .catch(ex => dispatch(fetchMetaFailure(ex)));
};
