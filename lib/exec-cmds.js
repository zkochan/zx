'use strict';

const chalk = require('chalk');
const npmRun = require('npm-run');
const parse = require('parse-spawn-args').parse;

function executeCommand(cmd, args, opts) {
  console.log(chalk.yellow('Executing: ') + cmd + ' ' + args.join(' '));

  return npmRun.spawnSync(cmd, args, {
    cwd: opts.cwd,
    env: opts.env || process.env,
    stdio: 'inherit',
  });
}

/**
 * @param {Array<string>} cmds - An array of commands.
 * @param {Object} [opts]
 * @param {String} [opts.cwd] - The directory in which the commands
 *   will be executed.
 * @param {String} [opts.env=process.env] - Object Environment key-value pairs.
 * @example
 * var cwd =  path.resolve(process.cwd());
 * exec(['mkdir foo', 'rm -rf foo'], {
 *   cwd: cwd
 * });
 */
function exec(cmds, opts) {
  opts = opts || {};

  if (!cmds || !cmds.length) {
    console.log(chalk.cyan('Finished executing the commands'));
    return;
  }

  var cmd = cmds.shift();
  if (!cmd.length) {
    return;
  }

  let parts = parse(cmd);
  let spawned = executeCommand(parts[0], parts.splice(1), opts);
  if (spawned.error) {
    console.log(chalk.red('Error happened during executing: ') + cmd);
    console.log(chalk.red('Stopping execution.'));
    return spawned;
  }

  console.log(chalk.yellow('Finished: ') + cmd);
  return exec(cmds, opts) || spawned;
}

module.exports = exec;
