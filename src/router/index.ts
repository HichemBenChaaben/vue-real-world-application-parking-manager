import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/Layouts/PublicLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'
import authMiddleWare from './middlewares/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'login',
          component: LoginView
        }
      ]
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/dashboard/revenue',
          name: 'revenue',
          component: () => import('../views/RevenueView.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/dashboard/analytics',
          name: 'analytics',
          component: () => import('../views/AnalyticsView.vue'),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'notfound',
          component: NotFoundView
        }
      ]
    }
  ]
})

router.beforeEach(authMiddleWare)

export default router
