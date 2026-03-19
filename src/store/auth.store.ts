import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { SignInPayload, SignUpPayload, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const { get, set, remove } = useStorage()

  const token = ref(get<string>('token') || '')
  const user = ref<User | null>(get<User>('user') || null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed((): boolean => !!(token.value && user.value))

  const api = useApi()

  const clearError = () => {
    error.value = null
  }

  const signUp = async (payload: SignUpPayload) => {
    loading.value = true
    clearError()
    try {
      const response = await api.signUp(payload)
      token.value = response.token
      user.value = response.user
      set('token', response.token)
      set('user', response.user)
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
    } finally {
      loading.value = false
    }
  }

  const signIn = async (payload: SignInPayload) => {
    loading.value = true
    clearError()
    try {
      const response = await api.signIn(payload)
      token.value = response.token
      user.value = response.user
      set('token', response.token)
      set('user', response.user)
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Identifiants incorrects'
    } finally {
      loading.value = false
    }
  }

  const signOut = () => {
    token.value = ''
    user.value = null
    clearError()
    remove('token')
    remove('user')
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    clearError,
  }
})
