import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/loginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    }
  ],
})

export default router
