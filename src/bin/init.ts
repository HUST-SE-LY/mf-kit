import { input, select } from '@inquirer/prompts';
import { join } from 'path';
import { templatePathMap } from '../constants';
import { copy } from '../utils/copy';

export async function init() {
  const projectName = await input({ message: 'Please enter project name:' });
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
        value: 'vueWithRsbuild'
      },
    ],
  });
  const templatePath = join(
    __dirname + '../../templates/' + templatePathMap[template]
  );
  const targetPath = join(cwd, projectName);
  copy(templatePath, targetPath);
}
