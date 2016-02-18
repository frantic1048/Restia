// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createAction } from 'redux-actions';
import Immutable from 'immutable';

import types from '../../lib/constants/ActionTypes';
import actions from '../../lib/actions';
import reducer from '../../lib/reducers';

import testMeta from '../asserts/restia_meta';
import testIndex from '../asserts/restia_index';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const blankState = Immutable.fromJS({
  meta: undefined,
  posts: undefined,
});

describe('Site metadata', () => {
  const siteMetaURL = '/restia_meta.json';

  const initialMetaState = Immutable.fromJS({
    isFetching: false,
    fetchingError: null,
    siteName: '',
    authorName: '',
    URL: '',
    links: {},
    articleBase: './',
  });

  const actRequest = createAction(types.FETCH_META_REQUEST)();

  it('should have initial meta state', () => {
    expect(reducer(blankState, {}).get('meta'))
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

      const store = mockStore(blankState, expectedActions, done);
      store.dispatch(actions.fetchMeta());
    });

    it('should return fetching state', () => {
      expect(reducer(blankState, actRequest).get('meta'))
        .toEqual(
          initialMetaState.merge(
            Immutable.Map({
              isFetching: true,
              fetchingError: null,
            })
        ));
    });

    it('should return state with meta', () => {
      expect(reducer(blankState, actSuccess).get('meta'))
        .toEqual(
          initialMetaState.merge(
            Immutable.Map({
              ...testMeta,
              isFetching: false,
              fetchingError: null,
            }))
        );
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

      const store = mockStore(blankState, expectedActions, done);
      store.dispatch(actions.fetchMeta());
    });

    it('should return state with errored response', () => {
      expect(reducer(blankState, actFailure).get('meta'))
        .toEqual(
          initialMetaState.merge(
            Immutable.fromJS({
              isFetching: false,
              fetchingError: res,
            }))
        );
    });
  });
});


describe('Posts', () => {
  const postsIndexURL = '/restia_index.json';

  const initialPostsIndexState = Immutable.fromJS({
    isFetching: false,
    fetchingError: null,
    release: null,
    entries: {},
  });

  const actPostsIndexRequest = createAction(types.FETCH_POSTS_INDEX_REQUEST)();

  it('should have initial posts index state', () => {
    expect(reducer(blankState, {}).get('posts'))
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

      const store = mockStore(blankState, expectedActions, done);
      store.dispatch(actions.fetchPostsIndex());
    });

    it('should return fetching state', () => {
      expect(reducer(blankState, actPostsIndexRequest).get('posts'))
        .toEqual(initialPostsIndexState.merge(
          Immutable.Map({
            isFetching: true,
            fetchingError: null,
          })
        ));
    });

    it('should return state with posts index', () => {
      expect(reducer(blankState, actPostsIndexSuccess).get('posts'))
        .toEqual(initialPostsIndexState.mergeDeep(
          Immutable.fromJS({
            ...testIndex,
            isFetching: false,
            fetchingError: null,
          })
      ));
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

      const store = mockStore(blankState, expectedActions, done);
      store.dispatch(actions.fetchPostsIndex());
    });

    it('should return state with errored response', () => {
      expect(reducer(blankState, actPostsIndexFailure).get('posts'))
        .toEqual(initialPostsIndexState.merge(
          Immutable.Map({
            isFetching: false,
            fetchingError: res,
          })
      ));
    });
  });

  const testPostRequest = { entry: 'Angel Beats!', version: 'default' };
  const actPostRequest = createAction(types.FETCH_POST_REQUEST)(testPostRequest);
  const postSourceURL =
    testMeta.postsSourceURL +
    testIndex.entries[testPostRequest.entry][testPostRequest.version].file;
  const blankPostFreeState = blankState.mergeDeep(
    Immutable.fromJS({
      meta: {
        ...testMeta,
      },
      posts: {
        ...initialPostsIndexState.toJS(),
        ...testIndex,
      },
    })
  );
  const testRawPost = 'post headers\n\npost body!';
  const testPostContent = 'post body!';

  describe('Fetching post success', () => {
    const res = new window.Response(testRawPost, {
      status: 200,
      headers: {
        'Content-type': 'text/plain',
      },
    });
    const actPostSuccess = createAction(types.FETCH_POST_SUCCESS)({...testPostRequest, content: testPostContent});

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

      const store = mockStore(blankPostFreeState, expectedActions, done);
      store.dispatch(actions.fetchPost(testPostRequest));
    });

    it('should return post fetching state', () => {
      const expectedState = blankPostFreeState.mergeDeep(
        Immutable.fromJS({
          posts: {
            entries: {
              [testPostRequest.entry]: {
                [testPostRequest.version]: {
                  isFetching: true,
                  fetchError: null,
                },
              },
            },
          },
        })
      );
      expect(reducer(blankPostFreeState, actPostRequest))
        .toEqual(expectedState);
    });

    it('should return state with post content', () => {
      const expectedState = blankPostFreeState.mergeDeep(
        Immutable.fromJS({
          posts: {
            entries: {
              [testPostRequest.entry]: {
                [testPostRequest.version]: {
                  isFetching: false,
                  fetchError: null,
                  content: testPostContent,
                },
              },
            },
          },
        })
      );
      expect(reducer(blankPostFreeState, actPostSuccess))
        .toEqual(expectedState);
    });

    it('should not fetch when valid post exists', (done) => {
      const expectedActions = [
        act => expect(act).toEqual(jasmine.any(Object)),
      ];

      // prepare a state already have a valid post content
      const testState = blankPostFreeState.mergeDeep(
        Immutable.fromJS({
          posts: {
            entries: {
              [testPostRequest.entry]: {
                [testPostRequest.version]: {
                  isInvalid: false,
                  content: testPostContent,
                },
              },
            },
          },
        })
      );

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
    const actPostFailure = createAction(types.FETCH_POST_FAILURE)({...testPostRequest, ex: res});

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

      const store = mockStore(blankPostFreeState, expectedActions, done);
      store.dispatch(actions.fetchPost(testPostRequest));
    });

    it('should return post state with errored response', () => {
      const expectedState = blankPostFreeState.mergeDeep(
        Immutable.fromJS({
          posts: {
            entries: {
              [testPostRequest.entry]: {
                [testPostRequest.version]: {
                  isFetching: false,
                  fetchError: res,
                },
              },
            },
          },
        })
      );

      expect(reducer(blankPostFreeState, actPostFailure))
        .toEqual(expectedState);
    });
  });
});
