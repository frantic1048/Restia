// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import { FETCH_META_REQUEST,
         FETCH_META_SUCCESS,
         FETCH_META_FAILURE } from '../constants/ActionTypes';

export default handleActions({
  [FETCH_META_REQUEST]: state => state.merge(
    Immutable.Map({
      isFetching: true,
      fetchingError: null,
    })
  ),
  [FETCH_META_SUCCESS]: (state, action) => state.merge(
    Immutable.Map({
      ...action.payload,
      isFetching: false,
      fetchingError: null,
    })
  ),
  [FETCH_META_FAILURE]: (state, action) => state.merge(
    Immutable.Map({
      isFetching: false,
      fetchingError: action.payload,
    })
  ),
}, Immutable.fromJS({
  isFetching: false,
  fetchingError: null,
  siteName: '',
  authorName: '',
  URL: '',
  links: {},
  articleBase: './',
}));
