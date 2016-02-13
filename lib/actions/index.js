import { createAction } from 'redux-actions';
import 'isomorphic-fetch';

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

const fetchMeta = () => (dispatch) => {
  dispatch(fetchMetaRequest());
  return fetch('/restia_meta.json')
    .then(res => res.json())
    .then(json => dispatch(fetchMetaSuccess(json)))
    .catch(ex => dispatch(fetchMetaFailure(ex)));
};

const fetchPostsIndexRequest = createAction(types.FETCH_POSTS_INDEX_REQUEST);

const fetchPostsIndexSuccess = createAction(
  types.FETCH_POSTS_INDEX_SUCCESS,
  index => index,
);

const fetchPostsIndexFailure = createAction(
  types.FETCH_POSTS_INDEX_FAILURE,
  ex => ex,
);

const fetchPostsIndex = () => (dispatch) => {
  dispatch(fetchPostsIndexRequest());
  return fetch('/restia_index.json')
    .then(res => res.json())
    .then(json => dispatch(fetchPostsIndexSuccess(json)))
    .catch(ex => dispatch(fetchPostsIndexFailure(ex)));
};

export default {
  fetchMeta,
  fetchPostsIndex,
};
