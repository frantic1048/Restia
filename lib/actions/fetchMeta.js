import { createAction } from 'redux-actions';

import {
  FETCH_META_REQUEST,
  FETCH_META_SUCCESS,
  FETCH_META_FAILURE,
} from '../constants/ActionTypes';

const fetchMetaRequest = createAction(
  FETCH_META_REQUEST,
);

const fetchMetaSuccess = createAction(
  FETCH_META_SUCCESS,
  meta => meta,
);

const fetchMetaFailure = createAction(
  FETCH_META_FAILURE,
  ex => ex,
);

export default () => (dispatch) => {
  dispatch(fetchMetaRequest());
  return fetch('/restia_meta.json')
    .then(res => res.json())
    .then(json => dispatch(fetchMetaSuccess(json)))
    .catch(ex => dispatch(fetchMetaFailure(ex)));
};
