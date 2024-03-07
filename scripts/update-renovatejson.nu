#!/usr/bin/env nu
open renovate.json.yml | to json | save --force renovate.json
yarn exec prettier -w renovate.json