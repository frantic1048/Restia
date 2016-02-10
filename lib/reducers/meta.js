import {FETCH_META_REQUEST,
        FETCH_META_SUCCESS,
        FETCH_META_FAILURE} from '../constants/ActionTypes';
import { handleActions } from 'redux-actions';

export default handleActions({
  [FETCH_META_REQUEST]: state => ({
    ...state,
    isFetching: true,
    fetchingError: null,
  }),
  [FETCH_META_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload,
    isFetching: false,
    fetchingError: null,
  }),
  [FETCH_META_FAILURE]: (state, action) => ({
    ...state,
    isFetching: false,
    fetchingError: action.payload,
  }),
}, {
  isFetching: false,
  fetchingError: null,
  siteName: '',
  authorName: '',
  URL: '',
  links: {},
  articleBase: './',
});
