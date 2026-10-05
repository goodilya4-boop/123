import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import { routes, setupRouterGuards } from "./router.js";
import "./styles.css";

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});

setupRouterGuards(router);

createApp(App).use(router).mount("#app");
