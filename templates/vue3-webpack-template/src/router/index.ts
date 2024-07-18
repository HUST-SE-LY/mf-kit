import { createRouter, createWebHistory } from "vue-router"
import Home from '../pages/Home.vue'
import { remoteAppRoutes } from "./remoteAppRouter"
const routes = [
  {
    path: '/',
    component: Home,
  },
  ...remoteAppRoutes
]

export const router = createRouter({
  history: createWebHistory(''),
  routes,
})