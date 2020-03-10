---
title: 测试 Redux 应用中使用 window.fetch 的 API 请求
date: 2016-02-16
tags: [Javascript, window.fetch, redux]
category: Web
---

近来写博客程序的时候需做到请求文章的功能，用的是新的 [Fetch API][] 做的请求，用了好几个工具要么不能用要么尚只支持 `XMLHttpRequest` （´＿｀），如果你还不知道 Fetch API，可以通过这篇 [Introduction to fetch()][intro fetch()] 品尝一下 (っ╹ ◡ ╹ )っ

测试环境是 Karma/Jasmine 的组合，尝试了如下几种工具/方法：

- [jasmine-ajax][]：对 Jasmine 来说是最原生的工具了，写起来略繁，且[尚未支持 fetch][support_window.fetch_jasmine-ajax]。
- [sinon][sinonjs].fakeServer：写起来很简洁，然而[尚未支持 fetch][fakeFetch_sinonjs]。
- [fakeserver][]：依赖的 sinon 导致 Karma 的 webpack 预处理器爆炸。
- [fake-fetch][]：太久没更新依赖，挂了……﻿

当然，不能因为这点问题就放弃治疗 ~(>\_<~)，后来翻到 RJ Zaworski 的[Testing API requests from window.fetch][test fetch with sinon.stub] 这篇文章，直接用 sinon.stub 来吃掉 window.fetch，还是蛮好用的。RJ Zaworski 已经介绍了最小化的测试写法，下面就搭着 Redux 一起上啦。

首先，就着 Redux 文档对[异步 Action][AsyncActions] 的介绍写获取文章的异步 Action Creator：

**actions.js**

```javascript
// 引入 Fetch API 的 polyfill，
// 确保在遇到不支持的浏览器上一切正常运行。
// https://github.com/matthew-andrews/isomorphic-fetch/
import 'isomorphic-fetch';

export const types = {
  FETCH_POST_REQUEST: 'FETCH_POST_REQUEST',
  FETCH_POST_SUCCESS: 'FETCH_POST_SUCCESS',
  FETCH_POST_FAILURE: 'FETCH_POST_FAILURE',
};

// 发起文章请求的 action，
// 包含一个 postId 标识准备请求哪篇文章，
// 可用于在 store 中标识拉取状态。
const fetchPostRequest = (postId) => ({
  type: types.FETCH_POST_REQUEST,
  payload: postId,
});

// 成功接收文章的 action，
// 包含一个 post 属性，里面存储了接收的文章内容以及 postId。
const fetchPostSuccess = ({id, content}) => ({
  type: types.FETCH_POST_SUCCESS,
  payload: {id, content},
});

const fetchPostFailure = ({id, failedResponse}) => ({
  type: types.FETCH_POST_FAILURE,
  payload: {id, failedResponse},
});

// 用来发请求的 action creator 返回一个函数，
// 称之为 thunk action，会被 Redux Thunk 中间件接手
// 使用的时候和普通 action 一样：
// store.dispatch(fetchPost(postId))
export const fetchPost = (postId) => (dispatch) => {

  // 这个返回的函数会被 Redux Thunk 中间件执行，
  // 同时会在第一个参数接收到 redux store 的 `dispatch` 方法，
  // 从而可以在这里面自己触发 action。

  // 先触发一个准备发请求的 action，
  dispatch(fetchPostRequest(postId));

  return fetch(`/posts/${postId}.md`)
    .then(response => response.text())
    .then(content => fetchPostSuccess({id: postId, content}))
    .catch(failedResponse => fetchPostFailure({id: postId, failedResponse}));
}
```

Action Creator 有了之后，就可以来写 Jasmine 中的测试了：

**actionTest.js**

```javascript
// 用 redux-mock-store 来模拟一个 store 并检查是否触发了预期的 action
// https://github.com/arnaudbenard/redux-mock-store
import configureMockStore from 'redux-mock-store';

// 用来处理我们的 thunk action 的中间件
// https://github.com/gaearon/redux-thunk
import thunk from 'redux-thunk';

// 用 sinon 来伪造 fetch API。
// 如果在 Karma 配置中设定了 frameworks: [... ,'sinon']，
// 则不需要再写这句 import 了。
// http://sinonjs.org/
import sinon from 'sinon';

// 上面写的 actions.js
import {types, fetchPost} from '../actions';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Post fetching', () => {
  // 用作测试的文章 id 及其内容
  const testPostId = 223;
  const testPostContent = 'Gochuumon wa usagi desu ka ???';

  describe('succeed', () => {
    // 创建一个包含文章内容的成功响应
    const res = new window.Response(testPostContent, {
      status: 200,
      headers: { 'Content-type': 'text/plain' },
    });

    beforeAll(() => {
      // 把原来的 fetch 包成 stub，
      // 这样做原来的 window.fetch 就不会被调用了
      sinon.stub(window, 'fetch');

      // 这里调用的 window.fetch 已经是 sinon 的 stub function 了，
      // 可以通过 withArgs 与 returns 方法
      // 来指定函数在接受到什么参数的时候返回什么。
      // 这里指定请求正确的文章 URL 的时候
      // 返回对应的请求成功的响应
      window.fetch
        .withArgs(`/posts/${testPostId}.md`)
        .returns(Promise.resolve(res));
    })

    afterAll(() => {
      // 执行完这组用例后恢复原来的 window.fetch 函数。
      window.fetch.restore();
    })

    it('should FETCH_POST_SUCCESS with post content', (done) => {
      // 期望的发起请求的 action
      const actRequest = {
        type: types.FETCH_POST_REQUEST,
        payload: testPostId,
      };

      // 期望的请求成功的 action
      const actSuccess = {
        type: types.FETCH_POST_SUCCESS,
        payload: {id: testPostId, content: testPostContent},
      };

      const expectedActions = [
        actRequest,
        actSuccess,
      ];

      // store 的初始状态
      const initialState = {};

      // 如果触发了期望的 action 的话，
      // done 会被调用，表明这个测试用例通过了。
      const store = mockStore(initialState);

      // 准备好模拟的 store 后，
      // 触发请求文章的 action ～
      store.dispatch(fetchPost(testPostId))
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
    });
  });

  describe('failed', () => {
    // 和请求成功的情况类似，先创建一个失败的响应比如 404。
    const res = new window.Response('', { status: 404 });

    beforeAll(() => {
      sinon.stub(window, 'fetch');
      window.fetch
        .withArgs(`/posts/${testPostId}.md`)
        .returns(Promise.reject(res)); // 失败的请求应该用 Promise.reject()
    });

    afterAll(() => {
      window.fetch.restore();
    });

    it('should FETCH_POST_FAILURE with errored response', (done) => {
      const actRequest = {
        type: types.FETCH_POST_REQUEST,
        payload: testPostId,
      };

      const actFailure = {
        type: types.FETCH_POST_FAILURE,
        payload: {id: testPostId, failedResponse: res},
      };

      const expectedActions = [
        actRequest,
        actFailure,
      ];

      const store = mockStore({});
      store.dispatch(fetchPost(testPostId))
        .then(() => {
          expect(store.getActions())
            .toEqual(expectedActions);
        })
        .then(done)
        .catch(done.fail);
    });
  });
});
```

就酱 ~(>\_<~)

[AsyncActions]: http://redux.js.org/docs/advanced/AsyncActions.html "Async Actions | Redux"
[intro fetch()]: https://developers.google.com/web/updates/2015/03/introduction-to-fetch "Introduction to fetch() | Web Updates - Google Developers"
[fake-fetch]: https://github.com/msn0/fake-fetch
[fakeserver]: https://github.com/faassen/fakeserver/
[sinonjs]: http://sinonjs.org/
[fakeFetch_sinonjs]: https://github.com/sinonjs/sinon/issues/720
[nock]: https://github.com/pgte/nock/
[browser: support fetch| nock]: https://github.com/pgte/nock/issues/409
[support_window.fetch_jasmine-ajax]: https://github.com/jasmine/jasmine-ajax/issues/134
[jasmine-ajax]: https://github.com/jasmine/jasmine-ajax/
[Fetch API]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API "Fetch API - Web APIs | MDN"
[test fetch with sinon.stub]: http://rjzaworski.com/2015/06/testing-api-requests-from-window-fetch "Testing API requests from window.fetch | rj zaworski"
