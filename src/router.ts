import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'

import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'

export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.SIGN_UP, component: SignUpPage },
  { path: ROUTES.SIGN_IN, component: SignInPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const AuthStore = useAuthStore()
  if (to.meta.requiresAuth && !AuthStore.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
