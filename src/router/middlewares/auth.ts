import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import useLoginStore from '@/stores/authStore'

/**
 * router middleware that checks router metadata and redirects
 * to login if the user is not authenticated
 * @param to {RouteLocationNormalized}
 * @param from  {RouterLocationNormalized}
 * @param next {NavigationGuardNext}
 */
const authMiddleWare = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useLoginStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
}

export default authMiddleWare
