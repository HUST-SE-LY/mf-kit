#!/usr/bin/env node

import { program } from 'commander';
import { init } from './bin/init';
import { addRemote } from './bin/addRemote';
import { addExpose } from './bin/addExpose';
import { initRemote } from './bin/initRemote';
program
  .version('1.0.0')
  .name('mf-kit')
  .description('cli to create micro-apps with module federation 2.0');
program.command('init').action(() => {
  init();
});

program.command('add-remote <name> <url>').action((name, url) => {
  addRemote(name, url);
});

program
  .command('expose <remotePath> <localPath>')
  .action((remotePath, localPath) => {
    addExpose(remotePath, localPath);
  });

program.command('init-micro-app').action(() => {
  initRemote();
});
program.parse();
