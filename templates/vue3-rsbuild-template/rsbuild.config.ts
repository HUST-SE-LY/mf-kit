import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { readFileSync } from 'fs'
const mfConfig = JSON.parse(readFileSync('./mf.config.json', 'utf8'));

export default defineConfig({
  server: {
    port: mfConfig.host.port,
  },
  dev: {
    assetPrefix: `http://localhost:${mfConfig.host.port}`,
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      config.output!.uniqueName = 'host';
      appendPlugins([
        new ModuleFederationPlugin({
          name: mfConfig.name,
          dts: {
            generateTypes: {
              compilerInstance: 'vue-tsc',
            },
          },
          remotes: {
            ...mfConfig.host.curRemotes,
          },
          exposes: {
            ...mfConfig.host.exposes,
          },
          shared: ['vue'],
        }),
      ]);
    },
  },
  plugins: [pluginVue()],
});
