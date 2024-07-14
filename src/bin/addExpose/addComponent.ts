import { writeFileSync } from 'fs';
import { ensureFileSync } from 'fs-extra';
import { join, relative } from 'path';

const addVueComponent = (path: string, componentName: string) => {
  const cwd = process.cwd();
  const componentPath = relative(join(cwd, './mf-exposes'), join(cwd, path));
  const fileContent = `import ${componentName} from '${componentPath}'
import { createBridgeComponent } from '@module-federation/bridge-vue3';
export default createBridgeComponent({
  rootComponent: ${componentName},
});
`;
  const targetPath = join(cwd, `./mf-exposes/${componentName}.ts`);
  ensureFileSync(targetPath);
  writeFileSync(targetPath, fileContent);
};

export const extFrameMap = {
  vue: addVueComponent,
} as const;

export const addComponent = (
  ext: keyof typeof extFrameMap,
  path: string,
  componentName: string,
) => {
  return extFrameMap[ext](path, componentName);
};
