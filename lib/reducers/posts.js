// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */
import { FETCH_POSTS_INDEX_REQUEST,
        FETCH_POSTS_INDEX_SUCCESS,
        FETCH_POSTS_INDEX_FAILURE,
        FETCH_POST_REQUEST,
        FETCH_POST_SUCCESS,
        FETCH_POST_FAILURE,
       } from '../constants/ActionTypes';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';

export default handleActions({
  [FETCH_POSTS_INDEX_REQUEST]: state => state.merge(
    Immutable.Map({
      isFetching: true,
      fetchingError: null,
    })
  ),
  [FETCH_POSTS_INDEX_SUCCESS]: (state, { payload }) => state.mergeDeep(
    Immutable.fromJS({
      ...payload,
      isFetching: false,
      fetchingError: null,
    })
  ),
  [FETCH_POSTS_INDEX_FAILURE]: (state, { payload }) => state.merge(
    Immutable.Map({
      isFetching: false,
      fetchingError: payload,
    })
  ),
  [FETCH_POST_REQUEST]: (state, { payload: { entry, version } }) => state.mergeDeep(
    Immutable.fromJS({
      entries: {
        [entry]: {
          [version]: {
            isFetching: true,
            fetchError: null,
          },
        },
      },
    })
  ),
  [FETCH_POST_SUCCESS]: (state, { payload: { entry, version, content } }) => state.mergeDeep(
    Immutable.fromJS({
      entries: {
        [entry]: {
          [version]: {
            isFetching: false,
            fetchError: null,
            content,
          },
        },
      },
    })
  ),
  [FETCH_POST_FAILURE]: (state, { payload: { entry, version, ex } }) => state.mergeDeep(
    Immutable.fromJS({
      entries: {
        [entry]: {
          [version]: {
            isFetching: false,
            fetchError: ex,
          },
        },
      },
    })
  ),
}, Immutable.fromJS({
  isFetching: false,
  fetchingError: null,
  release: null,
  entries: {},
}));
