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
      if (pokemons.value.length === 0) {
        pokemons.value = [
          {
            id: 1,
            name: 'Pikachu',
            hp: 60,
            attack: 50,
            type: 'Electric',
            pokedexNumber: 25,
            imgUrl: 'https://via.placeholder.com/200?text=Pikachu',
          },
          {
            id: 2,
            name: 'Dracaufeu',
            hp: 80,
            attack: 100,
            type: 'Fire',
            pokedexNumber: 6,
            imgUrl: 'https://via.placeholder.com/200?text=Charizard',
          },
        ]
      }
    } catch (err: unknown) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des Pokémon'

      pokemons.value = [
        {
          id: 1,
          name: 'Pikachu',
          hp: 60,
          attack: 50,
          type: 'Electric',
          pokedexNumber: 25,
          imgUrl: 'https://via.placeholder.com/200?text=Pikachu',
        },
        {
          id: 2,
          name: 'Dracaufeu',
          hp: 80,
          attack: 100,
          type: 'Fire',
          pokedexNumber: 6,
          imgUrl: 'https://via.placeholder.com/200?text=Charizard',
        },
        {
          id: 3,
          name: 'Tortank',
          hp: 90,
          attack: 80,
          type: 'Water',
          pokedexNumber: 9,
          imgUrl: 'https://via.placeholder.com/200?text=Blastoise',
        },
        {
          id: 4,
          name: 'Mewtwo',
          hp: 106,
          attack: 110,
          type: 'Psychic',
          pokedexNumber: 150,
          imgUrl: 'https://via.placeholder.com/200?text=Mewtwo',
        },
        {
          id: 5,
          name: 'Évoli',
          hp: 55,
          attack: 65,
          type: 'Normal',
          pokedexNumber: 133,
          imgUrl: 'https://via.placeholder.com/200?text=Eevee',
        },
        {
          id: 6,
          name: 'Ronflex',
          hp: 160,
          attack: 110,
          type: 'Normal',
          pokedexNumber: 143,
          imgUrl: 'https://via.placeholder.com/200?text=Snorlax',
        },
        {
          id: 7,
          name: 'Mystherbe',
          hp: 45,
          attack: 30,
          type: 'Grass',
          pokedexNumber: 1,
          imgUrl: 'https://via.placeholder.com/200?text=Bulbasaur',
        },
        {
          id: 8,
          name: 'Carapuce',
          hp: 44,
          attack: 48,
          type: 'Water',
          pokedexNumber: 7,
          imgUrl: 'https://via.placeholder.com/200?text=Squirtle',
        },
        {
          id: 9,
          name: 'Salamèche',
          hp: 39,
          attack: 52,
          type: 'Fire',
          pokedexNumber: 4,
          imgUrl: 'https://via.placeholder.com/200?text=Charmander',
        },
        {
          id: 10,
          name: 'Magicarpe',
          hp: 20,
          attack: 10,
          type: 'Water',
          pokedexNumber: 147,
          imgUrl: 'https://via.placeholder.com/200?text=Magikarp',
        },
        {
          id: 11,
          name: 'Électhor',
          hp: 90,
          attack: 95,
          type: 'Electric',
          pokedexNumber: 145,
          imgUrl: 'https://via.placeholder.com/200?text=Zapdos',
        },
        {
          id: 12,
          name: 'Léviator',
          hp: 95,
          attack: 125,
          type: 'Water',
          pokedexNumber: 130,
          imgUrl: 'https://via.placeholder.com/200?text=Gyarados',
        },
      ]
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
