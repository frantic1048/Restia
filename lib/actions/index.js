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

const fetchPostRequest = createAction(
  types.FETCH_POST_REQUEST,
  post => post,
);

const fetchPostSuccess = createAction(
  types.FETCH_POST_SUCCESS,
  index => index,
);

const fetchPostFailure = createAction(
  types.FETCH_POST_FAILURE,
  ex => ex,
);

const fetchPost = (post) => (dispatch, getState) => {
  const { entry, version } = post;
  const state = getState();
  const { entries } = state.posts;
  const { postsSourceURL } = state.meta;

  /** do nothing on default */
  let result = Promise.resolve();

  /**
   * perform fetching only if the post is not fetched before,
   * or it's marked `isInvalid`
   */
  // console.log(entries);
  if (!entries[entry][version].content ||
       entries[entry][version].isInvalid) {
    dispatch(fetchPostRequest(post));
    result = fetch(postsSourceURL + entries[entry][version].file)
      .then(res => res.text())
      .then(text => dispatch(fetchPostSuccess({...post, content: text})))
      .catch(ex => dispatch(fetchPostFailure(ex)));
  }
  return result;
};

export default {
  fetchMeta,
  fetchPostsIndex,
  fetchPost,
};
