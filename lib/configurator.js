// TODO: inject all config to extensible modules

import {configure as cRootComponent } from './components/Root';

let config = {
  masou: {
    component: () => null,
    routes: [],
  },
  // furture config properties follow here
};

// pass config to each extensible module
[
  cRootComponent,
].forEach(c => c(config));

export const initConfig = config;
export default function(_config) { config = _config; }
