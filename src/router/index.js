// https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/home.vue";
import Explore from "../pages/explore.vue";
import Freeplay from "../pages/freeplay.vue";
import NotFound from "../pages/not-found.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
  },
  {
    path: "/freeplay",
    name: "Freeplay",
    component: Freeplay,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
