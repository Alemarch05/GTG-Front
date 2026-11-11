import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/',
      redirect: '/main',
    },
    {
      path: '/main',
      component: MainLayout,
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
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuthenticated;

  if (to.path === '/') {
    return isAuth ? next('/main') : next('/auth/login');
  }

  if (to.path.startsWith('/main') && !isAuth) {
    return next('/auth/login');
  }

  if (to.path.startsWith('/auth') && isAuth) {
    return next('/main');
  }

  next();
});

export default router
