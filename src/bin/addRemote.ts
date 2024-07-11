import { join } from 'path'
import chalk from 'chalk'
type MfConfig = {
  host: {
    port: number;
    curRemotes: Record<string, string>
  },
} & Record<string, string>

export async function addRemote(name: string, url: string) {
  const cwd = process.cwd();
  const mfConfig = JSON.parse(join(cwd, './mf.config.json')) as MfConfig;
  if(mfConfig[name]) {
    chalk.red(`remote ${name} has already existed!`);
    return;
  }
  mfConfig[name] = url;
  mfConfig.host.curRemotes[name] = `${name}@${url}/mf-manifest.json`;
}