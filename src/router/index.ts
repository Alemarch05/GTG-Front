import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MyContributionsView from '../views/contributions/MyContributionsView.vue';
import CampaignsListView from '../views/Campaigns/CampaignsListView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      redirect: '/auth/login',
    },

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

export default router
