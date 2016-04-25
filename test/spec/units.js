// disable new-cap since Immutable.js doesn't need `new`
/* eslint-disable new-cap */

// make jasmine pretty print
// http://stackoverflow.com/a/26324116/2488867
jasmine.pp = (obj) => {
  return JSON.stringify(obj, undefined, 2);
};

// Common dependencies
import React from 'react';
import { createAction } from 'redux-actions';
import Immutable from 'immutable';
import { hashHistory } from 'react-router';
import { LOCATION_CHANGE, syncHistoryWithStore } from 'react-router-redux';

// Test utils
import ReactTestUtils from 'react-addons-test-utils';
import configureMockStore from 'redux-mock-store';

// Test assertion data
import testMeta from '../asserts/restia_meta';
import testIndex from '../asserts/restia_index';
import testConfig from '../asserts/restia.config';


// Local modules
import types from '../../lib/constants/ActionTypes';
import actions from '../../lib/actions';
import reducer from '../../lib/reducers';
import middlewares from '../../lib/middlewares';
import RootComponent, {configure as cRootComponent} from '../../lib/components/Root.jsx';
import VoidComponent from '../../lib/components/Void.jsx';

// pass testConfig to each extensible module
[
  cRootComponent,
].forEach(c => c(testConfig));

const mockStore = configureMockStore(middlewares);
const blankState = Immutable.fromJS({
  meta: undefined,
  posts: undefined,
  routing: {
    locationBeforeTransitions: undefined,
  },
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
        actRequest,
        actSuccess,
      ];

      const store = mockStore(blankState);
      store.dispatch(actions.fetchMeta())
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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
        actRequest,
        actFailure,
      ];

      const store = mockStore(blankState);
      store.dispatch(actions.fetchMeta())
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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
        actPostsIndexRequest,
        actPostsIndexSuccess,
      ];

      const store = mockStore(blankState);
      store.dispatch(actions.fetchPostsIndex())
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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
        actPostsIndexRequest,
        actPostsIndexFailure,
      ];

      const store = mockStore(blankState);
      store.dispatch(actions.fetchPostsIndex())
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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
        actPostRequest,
        actPostSuccess,
      ];

      const store = mockStore(blankPostFreeState);
      store.dispatch(actions.fetchPost(testPostRequest))
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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
      // there should be no actions dispatched
      const expectedActions = [];

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

      const store = mockStore(testState);

      store.dispatch(actions.fetchPost(testPostRequest))
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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
        actPostRequest,
        actPostFailure,
      ];

      const store = mockStore(blankPostFreeState);
      store.dispatch(actions.fetchPost(testPostRequest))
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
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

describe('Routing', () => {
  it('should LOCATION_CHANGE and update routing state on initial', () => {
    const store = mockStore(blankState);
    const expectedActions = [
      {
        type: LOCATION_CHANGE,
        payload: jasmine.objectContaining({
          pathname: '/',
          hash: '',
        }),
      },
    ];

    const expectedRoutingState = Immutable.Map({
      locationBeforeTransitions: jasmine.objectContaining({
        pathname: '/',
        hash: '',
      }),
    });

    syncHistoryWithStore(hashHistory, store, {
      selectLocationState: (state) => state.get('routing').toJS(),
    });

    expect(store.getActions())
      .toEqual(expectedActions);

    expect(reducer(blankState, store.getActions()[0]).get('routing'))
      .toEqual(expectedRoutingState);
  });
});

describe('Component', () => {
  it('<Root />', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      <RootComponent />
    );
    const result = renderer.getRenderOutput();

    expect(
      result            // Provider
        .props.children // Router
        .props.children // Route
        .props.component
        )
      .toEqual(testConfig.masou.component);
  });

  it('<Void />', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      <VoidComponent />
    );

    const result = renderer.getRenderOutput();

    expect(result)
      .toBe(null);
  });
});
