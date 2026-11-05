import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MyContributionsView from '../views/contributions/MyContributionsView.vue';
import CampaignsListView from '../views/Campaigns/CampaignsListView.vue';
import { useAuthStore } from '../stores/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: 'login', 
          name: 'login',
          component: LoginView,
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView,
        },
      ],
    },
    {
      path: '/login',
      redirect: '/auth/login',
    },
    {
      path: '/main',
      component: MainLayout,
      redirect: '/main/campaigns',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'campaigns', 
          name: 'campaigns-list',
          component: CampaignsListView, 
        },
        {
          path: 'campaigns/create', 
          name: 'campaign-create',
          component: () => import('../views/Campaigns/CreateCampaignView.vue'),
        },
        {
          path: 'campaigns/:id', 
          name: 'campaign-detail',
          component: () => import('../views/Campaigns/CampaignDetailView.vue'),
        },
        {
          path: 'campaigns/:id/edit', 
          name: 'campaign-edit',
          component: () => import('../views/Campaigns/EditCampaignView.vue'),
        },
        {
          path: 'my-contributions', 
          name: 'my-contributions',
          component: MyContributionsView,
        }
      ]
    },
    {
      path: '/',
      redirect: '/main/campaigns',
    }
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // Verifica si alguna de las rutas hijas o padres requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // Verifica si la ruta es exclusiva para usuarios no autenticados (Login/Register)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Si intenta ingresar a una ruta protegida sin token/sesión -> Redirige al Login
    next({ name: 'login' });
  } else if (requiresGuest && authStore.isAuthenticated) {
    // Si el usuario ya está logueado e intenta ir a /auth/login -> Redirige a /main
    next({ name: 'campaigns-list' });
  } else {
    // Permite la navegación normalmente
    next();
  }
});

export default router;