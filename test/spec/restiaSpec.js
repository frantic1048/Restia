import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createAction } from 'redux-actions';

import types from '../../lib/constants/ActionTypes';
import actions from '../../lib/actions';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

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

describe('site meta data', () => {
  beforeEach(() => {
    sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    window.fetch.restore();
  });

  it('should FETCH_META_SUCCESS with meta data when fetcing succeed', (done) => {
    const res = new window.Response(JSON.stringify(siteMeta), {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });

    window.fetch.returns(Promise.resolve(res));

    const expectedActions = [
      act => expect(act).toEqual(createAction(types.FETCH_META_REQUEST)()),
      act => expect(act).toEqual(createAction(types.FETCH_META_SUCCESS)(siteMeta)),
    ];

    const store = mockStore({ meta: {} }, expectedActions, done);
    store.dispatch(actions.fetchMeta());
  });

  it('should FETCH_META_FAILURE when fetching fails', (done) => {
    const res = new window.Response('', {
      status: 404,
    });

    window.fetch.returns(Promise.reject(res));

    const expectedActions = [
      act => expect(act).toEqual(createAction(types.FETCH_META_REQUEST)()),
      act => expect(act).toEqual(createAction(types.FETCH_META_FAILURE)(res)),
    ];

    const store = mockStore({ meta: {} }, expectedActions, done);
    store.dispatch(actions.fetchMeta());
  });

  // TODO: also testing on reducers
});
