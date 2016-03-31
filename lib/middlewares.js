import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

const reduxRouterMiddleware = routerMiddleware(hashHistory);

export default [thunk, reduxRouterMiddleware];
