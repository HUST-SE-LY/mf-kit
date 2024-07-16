import App from '../src/App.vue';
import { router } from '../src/router';
import { createBridgeComponent } from '@module-federation/bridge-vue3';

export default createBridgeComponent({
  rootComponent: App,
  appOptions: () => ({
    router,
  }),
});