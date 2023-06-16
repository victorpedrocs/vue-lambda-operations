import { defineStore } from 'pinia';

import { fetchWrapper, router } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/v1/auth`;
export type UserState = {
  user: null | {
    token: string;
    username: string;
    [k: string]: any;
  };
  returnUrl: string | null;
};

export const useAuthStore = defineStore({
  id: 'auth',
  state(): UserState {
    const user = localStorage.getItem('user');
    return {
      user: user ? JSON.parse(user) : null,
      returnUrl: null,
    };
  },
  actions: {
    async login(username: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/login`, {
        username,
        password,
      });

      this.user = user;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/');
    },
    async signup(username: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/signup`, {
        username,
        password,
      });

      this.user = user;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    },
  },
});
