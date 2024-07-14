import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { MfConfig } from './types';
import { Log } from '../utils/log';
import { ensureDirSync } from 'fs-extra';
import { addComponent } from './addExpose/addComponent';

/**
 * expose a module
 * @param {string} remotePath - eg: './button'
 * @param {string} localPath - eg: './src/Button.vue'
 */
export function addExpose(remotePath: string, localPath: string) {
  const cwd = process.cwd();
  ensureDirSync(join(cwd, './mf-exposes'));
  const mfConfig = JSON.parse(
    readFileSync(join(cwd, './mf.config.json'), 'utf-8'),
  ) as MfConfig;
  const frameExt = mfConfig.template;
  let targetPath = localPath;
  if (
    Object.keys(mfConfig.host.exposes).includes(remotePath) ||
    Object.values(mfConfig.host.exposes).includes(targetPath)
  ) {
    Log.error(`${localPath} has been exposed!`);
    return;
  }
  if (localPath.endsWith(`.${frameExt}`)) {
    const componentName = localPath
      .split('/')
      .pop()!
      .replace(`.${frameExt}`, '');
    targetPath = join(cwd, `./mf-exposes/${componentName}.ts`);
    if (Object.values(mfConfig.host.exposes).includes(targetPath)) {
      Log.error(`component ${localPath} has been exposed!`);
      return;
    }
    addComponent(frameExt, localPath, componentName);
  }
  mfConfig.host.exposes[remotePath] = targetPath;
  writeFileSync(
    join(cwd, './mf.config.json'),
    JSON.stringify(mfConfig, null, 2),
  );
}
