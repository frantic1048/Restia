import {FETCH_POSTS_INDEX_REQUEST,
        FETCH_POSTS_INDEX_SUCCESS,
        FETCH_POSTS_INDEX_FAILURE,
        FETCH_POST_REQUEST,
        FETCH_POST_SUCCESS,
        FETCH_POST_FAILURE,
      } from '../constants/ActionTypes';
import { handleActions } from 'redux-actions';

export default handleActions({
  [FETCH_POSTS_INDEX_REQUEST]: state => ({
    ...state,
    isFetching: true,
    fetchingError: null,
  }),
  [FETCH_POSTS_INDEX_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload,
    isFetching: false,
    fetchingError: null,
  }),
  [FETCH_POSTS_INDEX_FAILURE]: (state, action) => ({
    ...state,
    isFetching: false,
    fetchingError: action.payload,
  }),
  [FETCH_POST_REQUEST]: state => state,
  [FETCH_POST_SUCCESS]: state => state,
  [FETCH_POST_FAILURE]: state => state,
}, {
  isFetching: false,
  fetchingError: null,
  release: null,
  entries: null,
});
