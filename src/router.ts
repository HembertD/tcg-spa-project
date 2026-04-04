import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'

import DeckCreatePage from './pages/DeckCreatePage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'

export const ROUTES = {
  HOME: '/',
  DECK_CREATE: '/decks/create',
  DECK_DETAIL: '/decks/:id',
  DECK_EDIT: '/decks/:id/edit',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  TEST: '/test',
  GAME: '/game',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_DETAIL,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_EDIT,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  { path: ROUTES.SIGN_UP, component: SignUpPage },
  { path: ROUTES.SIGN_IN, component: SignInPage },
  { path: ROUTES.GAME, component: GamePage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const AuthStore = useAuthStore()
  if (to.meta.requiresAuth && !AuthStore.isAuthenticated) {
    return ROUTES.SIGN_IN
  }
  if (
    (to.path === ROUTES.SIGN_IN || to.path === ROUTES.SIGN_UP) &&
    AuthStore.isAuthenticated
  ) {
    return ROUTES.HOME
  }

  return true
})

export default router
