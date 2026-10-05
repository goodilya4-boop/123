import LoginView from "./views/LoginView.vue";
import RegisterView from "./views/RegisterView.vue";
import DashboardView from "./views/DashboardView.vue";
import ProfileView from "./views/ProfileView.vue";
import UsersView from "./views/UsersView.vue";
import { auth } from "./services/auth.js";

export const routes = [
  {
    path: "/",
    redirect: () => (auth.isAuthenticated() ? "/dashboard" : "/login")
  },
  {
    path: "/login",
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: "/register",
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: "/users",
    component: UsersView,
    meta: { requiresAuth: true, adminOnly: true }
  }
];

export function setupRouterGuards(router) {
  router.beforeEach((to) => {
    const authenticated = auth.isAuthenticated();

    if (to.meta.requiresAuth && !authenticated) {
      return { path: "/login", query: { redirect: to.fullPath } };
    }

    if (to.meta.guestOnly && authenticated) {
      return "/dashboard";
    }

    if (to.meta.adminOnly && auth.user.value?.role !== "администратор") {
      return "/dashboard";
    }

    return true;
  });
}
