#!/usr/bin/env node
'use strict'
const pkg = require('./package')
const yargs = require('yargs')
const updateNotifier = require('update-notifier')
const yamlOrJSON = require('yaml-or-json')
const path = require('path')
const shellquote = require('shell-quote').quote
const execCmds = require('exec-cmds')

let args = process.argv.slice(2)

function notify() {
  updateNotifier({
    pkg: pkg,
  }).notify({
    defer: false,
  })
}

// if there are no args or the first arg starts with -
// this is not a command, so use yargs to handle it
if (!args.length || args[0][0] === '-') {
  yargs
    .usage('Usage: zx [options] <command> ...args')
    .help('h')
    .version(pkg.version, 'V')
    .alias('V', 'version')
    .alias('h', 'help')
    .strict()
    .parse(args)

  yargs.showHelp()
  process.exit()
}

// handle commands manually so we can keep args to pass
let cmd = args.shift(1)
let currentDir = path.resolve(process.cwd())
let shortcuts
try {
  shortcuts = yamlOrJSON(currentDir + '/zx');
} catch (e) {
  shortcuts = false
}

if (!shortcuts) {
  console.log('zx config file not found or empty')
  return
}

if (!shortcuts[cmd]) {
  console.log('shortcut not found')
  return
}

function parseShortcut(shortcut) {
  if (typeof shortcut === 'string') {
    return {
      command: [shortcut],
    }
  }

  if (shortcut instanceof Array) {
    return {
      command: shortcut,
    }
  }

  if (typeof shortcut.command === 'string') {
    shortcut.command = [shortcut.command];
  }

  return shortcut
}

let cmdsSeq = parseShortcut(shortcuts[cmd])

// append args to the end of the command, but only if there is only one
if (cmdsSeq.command.length === 1 && args.length) {
  cmdsSeq.command[0] += ' ' + shellquote(args)
}

execCmds(cmdsSeq.command, cmdsSeq)
