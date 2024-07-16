import { input, select } from '@inquirer/prompts';
import { ensureDirSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import {
  localResourceUrl,
  templateBridgeMap,
  templatePathMap,
} from '../constants';
import { MfConfig } from './types';
import { Log } from '../utils/log';
import { copy } from '../utils/copy';

export async function initRemote() {
  const microAppName = await input({ message: 'please enter module name:' });
  let shouldAddToHost: string;
  do {
    shouldAddToHost = await input({
      message: `add ${microAppName} to main app's remote? [y/n]`,
    });
  } while (shouldAddToHost !== 'y' && shouldAddToHost !== 'n');

  const cwd = process.cwd();
  const template = await select({
    message: 'Please select a template',
    choices: [
      {
        name: 'vue3 + webpack',
        value: 'vueWithWebpack',
      },
      {
        name: 'vue3 + rsbuild',
        value: 'vueWithRsbuild',
      },
    ],
  });
  const curMfConfig = JSON.parse(
    readFileSync(join(cwd, `./mf.config.json`), 'utf-8'),
  ) as MfConfig;

  if (curMfConfig.modules[microAppName]) {
    Log.error(`module ${microAppName} has existed!`);
    return;
  }
  ensureDirSync(join(cwd, './modules'));

  const maxPort = Object.values(curMfConfig.modules)
    .filter((el) => localResourceUrl.find((url) => el.startsWith(url)))
    .map((el) => Number(el.split(':').pop()))
    .sort((a, b) => a - b)
    .pop();
  const autoGeneratedPort = (maxPort ? maxPort : curMfConfig.host.port) + 1;

  curMfConfig.modules[microAppName] =
    `${microAppName}@http://127.0.0.1:${autoGeneratedPort}/mf-manifest.json`;
  shouldAddToHost === 'y' &&
    (curMfConfig.host.curRemotes[microAppName] =
      `${microAppName}@http://127.0.0.1:${autoGeneratedPort}/mf-manifest.json`);
  const templatePath = join(
    __dirname,
    '../templates/',
    templatePathMap[template],
  );
  // micro app will export itself with router by default
  const targetPath = join(cwd, './modules', microAppName);
  copy(templatePath, targetPath);

  const packageJson = JSON.parse(
    readFileSync(
      join(cwd, `./modules/${microAppName}`, '/package.json'),
      'utf-8',
    ),
  );
  packageJson.name = microAppName;
  writeFileSync(
    join(cwd, `./modules/${microAppName}`, '/package.json'),
    JSON.stringify(packageJson, null, 2),
  );
  const remoteMfConfig = JSON.parse(
    readFileSync(
      join(cwd, `./modules/${microAppName}/mf.config.json`),
      'utf-8',
    ),
  ) as MfConfig;
  const exportAppTemplatePath = join(
    __dirname,
    '../templates/expose-router',
    remoteMfConfig.template,
  );
  ensureDirSync(join(cwd, `./modules/${microAppName}/mf-exposes`));
  copy(
    exportAppTemplatePath,
    join(cwd, `./modules/${microAppName}/mf-exposes`),
  );
  remoteMfConfig.host.exposes['./export-app'] = './mf-exposes/export-app.ts';
  remoteMfConfig.host.port = autoGeneratedPort;
  if (shouldAddToHost === 'y') {
    const remoteRouterFile = readFileSync(
      join(cwd, './src/router/remoteAppRouter.ts'),
      'utf-8',
    );
    const newRemoteRouterContent = remoteRouterFile
      .replace(
        `import * as reactBridge from '@module-federation/bridge-react';`,
        `import * as reactBridge from '@module-federation/bridge-react';
const ${microAppName} = ${templateBridgeMap[remoteMfConfig.template]}.createRemoteComponent(() =>
  loadRemote('${microAppName}/export-app'),
);`,
      )
      .replace(
        'remoteAppRoutes = [',
        `remoteAppRoutes = [
  {
    path: '/${microAppName}/:pathMatch(.*)*',
    component: ${microAppName},
  },`,
      );
    writeFileSync(
      join(cwd, './src/router/remoteAppRouter.ts'),
      newRemoteRouterContent,
    );
  }

  writeFileSync(
    join(cwd, `./mf.config.json`),
    JSON.stringify(curMfConfig, null, 2),
  );
  writeFileSync(
    join(cwd, './modules/', microAppName, './mf.config.json'),
    JSON.stringify(remoteMfConfig, null, 2),
  );
}
