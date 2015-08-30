#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package');
var updateNotifier = require('update-notifier');
var yamlOrJSON = require('yaml-or-json');
var path = require('path');
var execCmds = require('exec-cmds');

function notify() {
  updateNotifier({
    pkg: pkg
  }).notify({
    defer: false
  });
}

program
  .version(pkg.version);

program
  .command('*')
  .action(function(cmd) {
    var currentDir = path.resolve(process.cwd());
    var shortcuts = yamlOrJSON(currentDir + '/zx');

    if (!shortcuts) {
      console.log('zx config file not found or empty');
      return;
    }

    if (!shortcuts[cmd]) {
      console.log('shortcut not found');
      return;
    }

    var cmds = typeof shortcuts[cmd] === 'string' ?
      [shortcuts[cmd]] : shortcuts[cmd];

    execCmds(cmds);
  });

program.parse(process.argv);
