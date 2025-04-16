#!/usr/bin/env node
import { Option, program } from 'commander';
import { deleteAllRepos } from '../cli/deleteAllRepos.js';
import { deployAllRepos } from '../cli/deployAllRepos.js';
import { gitAcpAllRepos } from '../cli/gitAcpAllRepos.js';
import { gitPushAllRepos } from '../cli/gitPushAllRepos.js';
import { transfer2Shared } from '../cli/transfer2Shared.js';
import { initConfig } from '../cli/initConfig.js';

import packageJson from '../../package.json' with { type: "json" };

program
  .name('pbk')
  .version(packageJson.version)
  .description('PrimeXOP Backend Kit - CLI Tool');

program
  .command('init')
  .description('Initialize an empty pbk.config.json file in the project root')
  .action(async () => {
    await initConfig();
  });

program
  .command('delete-all-repos')
  .description('Delete b2fPortal directory in all repositories')
  .action(async () => {
    await deleteAllRepos();
  });

program
  .command('deploy-all-repos')
  .description('Deploy all repositories')
  .action(async () => {
    await deployAllRepos();
  });

program
  .command('git-acp-all-repos')
  .description('Add, commit, and push changes in all repositories')
  .action(async () => {
    await gitAcpAllRepos();
  });

program
  .command('git-push-all-repos')
  .description('Push b2fPortal changes in all repositories')
  .action(async () => {
    await gitPushAllRepos();
  });

program
  .command('transfer-2-shared')
  .description('Transfer project files to shared backend repositories')
  .action(async () => {
    await transfer2Shared();
  });

program.parseAsync(process.argv);