// require all `test/spec/*.js`
const testsContext = require.context('./spec/', true, /\.js$/);

testsContext.keys().forEach(testsContext);

// require `lib/restia.js`
const libContext = require.context('../lib/', true, /restia\.js$/);

libContext.keys().forEach(libContext);
