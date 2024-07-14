import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/Layouts/PublicLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'
import useLoginStore from '@/stores/authStore'
import { storeToRefs } from 'pinia'

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
          path: '/dashboard/create',
          name: 'createSession',
          component: () => import('../views/CreateSession.vue'),
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

// Check if the route requires authentication
// if the user is not authenticated, redirect to the login page
router.beforeEach((to, from, next) => {
  const store = useLoginStore()
  const { isAuthenticated } = storeToRefs(store)

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/')
  } else if (to.path === '/' && isAuthenticated.value) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
