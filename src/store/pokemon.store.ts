import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const api = useApi()

  const hasPokemons = computed((): boolean => pokemons.value.length > 0)

  const clearError = () => {
    error.value = null
  }

  const fetchPokemons = async () => {
    loading.value = true
    clearError()
    try {
      pokemons.value = await api.getCards()
    } catch (err: unknown) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des Pokémon'
    } finally {
      loading.value = false
    }
  }

  return {
    pokemons,
    loading,
    error,
    hasPokemons,
    fetchPokemons,
    clearError,
  }
})
