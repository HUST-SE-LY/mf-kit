import { join } from 'path';
import { writeFileSync } from 'fs';
import { Log } from '../utils/log';
import { MfConfig } from './types';

export async function addRemote(name: string, url: string) {
  const cwd = process.cwd();
  const mfConfig = JSON.parse(join(cwd, './mf.config.json')) as MfConfig;
  if (mfConfig[name]) {
    Log.error(`remote ${name} has already existed!`);
    return;
  }
  if (Object.values(mfConfig).find((el) => el === url)) {
    Log.error(`remote url ${url} has already existed!`);
    return;
  }
  mfConfig[name] = url;
  mfConfig.host.curRemotes[name] = `${name}@${url}/mf-manifest.json`;
  writeFileSync(
    join(cwd, './mf.config.json'),
    JSON.stringify(mfConfig, null, 2),
  );
  Log.info(`remote ${name} is added successfully! Please restart host app`);
}
