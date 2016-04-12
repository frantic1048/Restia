/**
 * emulate a full ES6 environment
 * http://babeljs.io/docs/usage/polyfill/
 */
import 'babel-polyfill';

// require all `test/spec/*.js`
const testsContext = require.context('./spec/', true, /\.js$/);
testsContext.keys().forEach(testsContext);
