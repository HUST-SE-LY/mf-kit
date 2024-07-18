import { extFrameMap } from './addExpose/addComponent';

export type MfConfig = {
  template: keyof typeof extFrameMap;
  name: string;
  host: {
    port: number;
    curRemotes: Record<string, string>;
    exposes: Record<string, string>;
  };
  modules: Record<string, string>;
};
