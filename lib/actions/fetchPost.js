import { createAction } from 'redux-actions';

import {
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
} from '../constants/ActionTypes';

const fetchPostRequest = createAction(
  FETCH_POST_REQUEST,
  postRequest => postRequest,
);

const fetchPostSuccess = createAction(
  FETCH_POST_SUCCESS,
  index => index,
);

const fetchPostFailure = createAction(
  FETCH_POST_FAILURE,
  ex => ex,
);

export default (postRequest) => (dispatch, getState) => {
  const { entry, version } = postRequest;
  const state = getState();
  const entries = state.get('posts').get('entries');
  const postsSourceURL = state.get('meta').get('postsSourceURL');

  // split raw post text by 2 NewLine,
  // the second part is post content.
  const rawPostSplitter = /(?:\r|\n|\r\n){2}/;

  /** do nothing on default */
  let result = Promise.resolve();

  /**
   * perform fetching only if the post is not fetched before,
   * or it's marked `isInvalid`
   */
  if (!entries.get(entry).get(version).get('content') ||
       entries.get(entry).get(version).get('isInvalid')) {
    dispatch(fetchPostRequest(postRequest));
    result = fetch(postsSourceURL + entries.get(entry).get(version).get('file'))
      .then(res => res.text())
      .then(rawPost => rawPost.split(rawPostSplitter, 2)[1])
      .then(content => dispatch(fetchPostSuccess({ ...postRequest, content })))
      .catch(ex => dispatch(fetchPostFailure({ ...postRequest, ex })));
  }
  return result;
};
