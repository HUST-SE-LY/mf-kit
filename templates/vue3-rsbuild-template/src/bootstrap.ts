import App from './App.vue';
import './index.css';
import {createApp} from 'vue'
import { router } from './router';
const app = createApp(App);
app.use(router);
app.mount('#root');