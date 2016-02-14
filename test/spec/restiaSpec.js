import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createAction } from 'redux-actions';

import types from '../../lib/constants/ActionTypes';
import actions from '../../lib/actions';
import reducer from '../../lib/reducers';

import testMeta from '../asserts/restia_meta';
import testIndex from '../asserts/restia_index';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Site metadata', () => {
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

  describe('Fetching success', () => {
    const res = new window.Response(JSON.stringify(testMeta), {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    const actSuccess = createAction(types.FETCH_META_SUCCESS)(testMeta);

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
          ...testMeta,
          isFetching: false,
          fetchingError: null,
        });
    });
  });

  describe('Fecthing failure', () => {
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

    it('should return state with errored response', () => {
      expect(reducer(undefined, actFailure).meta)
        .toEqual({
          ...initialMetaState,
          isFetching: false,
          fetchingError: res,
        });
    });
  });
});


describe('Posts', () => {
  const postsIndexURL = '/restia_index.json';

  const initialPostsIndexState = {
    isFetching: false,
    fetchingError: null,
    release: null,
    entries: null,
  };

  const actPostsIndexRequest = createAction(types.FETCH_POSTS_INDEX_REQUEST)();

  it('should have initial posts index state', () => {
    expect(reducer(undefined, {}).posts)
      .toEqual(initialPostsIndexState);
  });

  describe('Fetching posts index success', () => {
    const res = new window.Response(JSON.stringify(testIndex), {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    const actPostsIndexSuccess = createAction(types.FETCH_POSTS_INDEX_SUCCESS)(testIndex);

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch.withArgs(postsIndexURL).returns(Promise.resolve(res));
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_POSTS_INDEX_SUCCESS', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(actPostsIndexRequest),
        act => expect(act).toEqual(actPostsIndexSuccess),
      ];

      const store = mockStore({posts: {}}, expectedActions, done);
      store.dispatch(actions.fetchPostsIndex());
    });

    it('should return fetching state', () => {
      expect(reducer(undefined, actPostsIndexRequest).posts)
        .toEqual({
          ...initialPostsIndexState,
          isFetching: true,
          fetchingError: null,
        });
    });

    it('should return state with posts index', () => {
      expect(reducer(undefined, actPostsIndexSuccess).posts)
        .toEqual({
          ...initialPostsIndexState,
          ...testIndex,
          isFetching: false,
          fetchingError: null,
        });
    });
  });

  describe('Fetching posts index failure', () => {
    const res = new window.Response('', {
      status: 404,
    });
    const actPostsIndexFailure = createAction(types.FETCH_POSTS_INDEX_FAILURE)(res);

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch.withArgs(postsIndexURL).returns(Promise.reject(res));
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_POSTS_INDEX_FAILURE', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(actPostsIndexRequest),
        act => expect(act).toEqual(actPostsIndexFailure),
      ];

      const store = mockStore({posts: {}}, expectedActions, done);
      store.dispatch(actions.fetchPostsIndex());
    });

    it('should return state with errored response', () => {
      expect(reducer(undefined, actPostsIndexFailure).posts)
        .toEqual({
          ...initialPostsIndexState,
          isFetching: false,
          fetchingError: res,
        });
    });
  });

  const testPostRequest = { entry: 'Angel Beats!', version: 'default' };
  const actPostRequest = createAction(types.FETCH_POST_REQUEST)(testPostRequest);
  const postSourceURL =
    testMeta.postsSourceURL +
    testIndex.entries[testPostRequest.entry][testPostRequest.version].file;
  const testPost = 'post headers\n\npost body!';
  describe('Fetching post success', () => {
    const res = new window.Response(testPost, {
      status: 200,
      headers: {
        'Content-type': 'text/plain',
      },
    });
    const actPostSuccess = createAction(types.FETCH_POST_SUCCESS)({...testPostRequest, content: testPost});

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch.withArgs(postSourceURL).returns(Promise.resolve(res));
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_POST_SUCCESS', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(actPostRequest),
        act => expect(act).toEqual(actPostSuccess),
      ];

      const store = mockStore({
        meta: {
          ...testMeta,
        },
        posts: {
          ...initialPostsIndexState,
          ...testIndex,
        },
      }, expectedActions, done);
      store.dispatch(actions.fetchPost(testPostRequest));
    });

    xit('should return post fetching state', () => {});
    xit('should return state with post content', () => {});
    it('should not fetch when valid post exists', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(jasmine.any(Object)),
      ];

      // may need a deep merge util...
      const testState = {
        meta: {
          ...testMeta,
        },
        posts: {
          ...initialPostsIndexState,
          ...testIndex,
          entries: {
            [testPostRequest.entry]: {
              [testPostRequest.version]: {
                content: testPost,
              },
            },
          },
        },
      };

      // if any action dispatched, fail this case.
      const store = mockStore(testState, expectedActions, done.fail);
      store.dispatch(actions.fetchPost(testPostRequest));

      // no action dispatched is ok.
      setTimeout(() => done(), 100);
    });
  });
  describe('Fetching post failure', () => {
    const res = new window.Response('', {
      status: 404,
    });
    const actPostFailure = createAction(types.FETCH_POST_FAILURE)(res);

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch.withArgs(postSourceURL).returns(Promise.reject(res));
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_POST_FAILURE', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(actPostRequest),
        act => expect(act).toEqual(actPostFailure),
      ];

      const store = mockStore({
        meta: {
          ...testMeta,
        },
        posts: {
          ...initialPostsIndexState,
          ...testIndex,
        },
      }, expectedActions, done);
      store.dispatch(actions.fetchPost(testPostRequest));
    });
    xit('should return post state with errored response', () => {});
  });
});
