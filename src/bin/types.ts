import { extFrameMap } from './addExpose/addComponent';

export type MfConfig = {
  template: keyof typeof extFrameMap;
  host: {
    port: number;
    curRemotes: Record<string, string>;
    exposes: Record<string, string>;
  };
} & Record<string, string>;
