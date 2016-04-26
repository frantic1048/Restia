import {configure as cRootComponent } from './components/Root';

let config = {
  masou: null,
  // furture config properties follow here
};

// pass config to each extensible module
[
  cRootComponent,
].forEach(c => c(config));

export default function(_config) { config = _config; }
