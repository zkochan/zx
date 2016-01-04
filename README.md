# zx

A CLI tool for running command shortcuts.

[![Dependency Status](https://david-dm.org/zkochan/zx/status.svg?style=flat)](https://david-dm.org/zkochan/zx)
[![Build Status](http://img.shields.io/travis/zkochan/zx.svg?style=flat)](https://travis-ci.org/zkochan/zx)
[![npm version](https://badge.fury.io/js/zx.svg)](http://badge.fury.io/js/zx)


## Installation

```js
npm install -g zx
```


## Usage

Create a file called `zx.yaml` containing the shortcuts. E.g.:

```yaml
minify: gulp minify
clear: rm -rf dist
run: node server
reminify:
  - rm -rf dist
  - gulp minify

# You can also optionally specify the working directory of the command
minify:
  cwd: ./my-project
  command: gulp minify

# or set some environment variables for the child process
minify:
  env:
    NODE_ENV: production
  command: gulp minify
```

Execute the shortcuts by running `zx` and the name of the shortcut in the console. E.g.: `zx minify`.


## License

The MIT License (MIT)
