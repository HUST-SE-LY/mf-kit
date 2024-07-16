import { join } from 'path';
import { writeFileSync } from 'fs';
import { Log } from '../utils/log';
import { MfConfig } from './types';

/**
 * add a remote
 * @param {string} name - eg: 'app1'
 * @param {string} url - eg: 'http://localhost:3001'
 */
export async function addRemote(name: string, url: string) {
  const cwd = process.cwd();
  const mfConfig = JSON.parse(join(cwd, './mf.config.json')) as MfConfig;
  if (mfConfig.modules[name]) {
    Log.error(`remote ${name} has already existed!`);
    return;
  }
  if (Object.values(mfConfig).find((el) => el === url)) {
    Log.error(`remote url ${url} has already existed!`);
    return;
  }
  mfConfig.modules[name] = url;
  mfConfig.host.curRemotes[name] = `${name}@${url}/mf-manifest.json`;
  writeFileSync(
    join(cwd, './mf.config.json'),
    JSON.stringify(mfConfig, null, 2),
  );
  Log.info(`remote ${name} is added successfully! Please restart host app`);
}
