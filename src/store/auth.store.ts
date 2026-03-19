import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { SignUpPayload, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const { get, set } = useStorage()

  const token = ref(get<string>('token')) || ''
  const user = ref(get<User>('user'))

  const isAuthenticated = computed((): boolean => {
    return token.value && user.value ? true : false
  })

  const useAPI = useApi()
  const signUp = async (payload: SignUpPayload) => {
    const { username, email, password } = payload
    const response = await useAPI.signUp({
      username: username,
      email: email,
      password: password,
    })
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
  }

  return { token, user, signUp, isAuthenticated }
})
