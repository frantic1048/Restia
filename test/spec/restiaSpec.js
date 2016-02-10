import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createAction } from 'redux-actions';

import types from '../../lib/constants/ActionTypes';
import actions from '../../lib/actions';
import reducer from '../../lib/reducers';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('site meta data', () => {
  const siteMeta = {
    siteName: 'Restia Blog',
    authorName: 'Restia',
    URL: 'https://github.com/frantic1048/Restia',
    links: {
      npmjs: 'https://www.npmjs.com/',
      iojs: 'https://iojs.org/',
    },
    articleBase: './',
  };

  const siteMetaURL = '/restia_meta.json';

  const initialMetaState = {
    isFetching: false,
    fetchingError: null,
    siteName: '',
    authorName: '',
    URL: '',
    links: {},
    articleBase: './',
  };

  const actRequest = createAction(types.FETCH_META_REQUEST)();

  it('should have initial meta state', () => {
    expect(reducer(undefined, {}).meta)
      .toEqual(initialMetaState);
  });

  describe('fetching success', () => {
    const res = new window.Response(JSON.stringify(siteMeta), {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    const actSuccess = createAction(types.FETCH_META_SUCCESS)(siteMeta);

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch.withArgs(siteMetaURL).returns(Promise.resolve(res));
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_META_SUCCESS', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(actRequest),
        act => expect(act).toEqual(actSuccess),
      ];

      const store = mockStore({ meta: {} }, expectedActions, done);
      store.dispatch(actions.fetchMeta());
    });

    it('should return fetching state', () => {
      expect(reducer(undefined, actRequest).meta)
        .toEqual({
          ...initialMetaState,
          isFetching: true,
          fetchingError: null,
        });
    });

    it('should return state with meta', () => {
      expect(reducer(undefined, actSuccess).meta)
        .toEqual({
          ...initialMetaState,
          ...siteMeta,
          isFetching: false,
          fetchingError: null,
        });
    });
  });

  describe('fecthing failure', () => {
    const res = new window.Response('', {
      status: 404,
    });
    const actFailure = createAction(types.FETCH_META_FAILURE)(res);

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.reject(res));
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_META_FAILURE', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(actRequest),
        act => expect(act).toEqual(actFailure),
      ];

      const store = mockStore({ meta: {} }, expectedActions, done);
      store.dispatch(actions.fetchMeta());
    });

    it('should return state with error info', () => {
      expect(reducer(undefined, actFailure).meta)
        .toEqual({
          ...initialMetaState,
          isFetching: false,
          fetchingError: res,
        });
    });
  });
});
