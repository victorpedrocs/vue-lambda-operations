import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import {
  HomeView,
  LoginView,
  OperationView,
  RecordsView,
  SignupView,
} from '@/views';

export const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/operation', component: OperationView },
    { path: '/records', component: RecordsView },
  ],
});

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }
});
