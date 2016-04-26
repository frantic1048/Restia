import { createAction } from 'redux-actions';

import {
  FETCH_POSTS_INDEX_REQUEST,
  FETCH_POSTS_INDEX_SUCCESS,
  FETCH_POSTS_INDEX_FAILURE,
} from '../constants/ActionTypes';

const fetchPostsIndexRequest = createAction(
  FETCH_POSTS_INDEX_REQUEST,
);

const fetchPostsIndexSuccess = createAction(
  FETCH_POSTS_INDEX_SUCCESS,
  index => index,
);

const fetchPostsIndexFailure = createAction(
  FETCH_POSTS_INDEX_FAILURE,
  ex => ex,
);

export default () => (dispatch) => {
  dispatch(fetchPostsIndexRequest());
  return fetch('/restia_index.json')
    .then(res => res.json())
    .then(json => dispatch(fetchPostsIndexSuccess(json)))
    .catch(ex => dispatch(fetchPostsIndexFailure(ex)));
};
