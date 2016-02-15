import {FETCH_POSTS_INDEX_REQUEST,
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
  [FETCH_POSTS_INDEX_SUCCESS]: (state, action) => state.mergeDeep(
    Immutable.fromJS({
      ...action.payload,
      isFetching: false,
      fetchingError: null,
    })
  ),
  [FETCH_POSTS_INDEX_FAILURE]: (state, action) => state.merge(
    Immutable.Map({
      isFetching: false,
      fetchingError: action.payload,
    })
  ),
  [FETCH_POST_REQUEST]: (state, action) => {
    const {entry, version} = action.payload;
    return state.mergeDeep(
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
    );
  },
  [FETCH_POST_SUCCESS]: state => state,
  [FETCH_POST_FAILURE]: state => state,
}, Immutable.Map({
  isFetching: false,
  fetchingError: null,
  release: null,
  entries: {},
}));
