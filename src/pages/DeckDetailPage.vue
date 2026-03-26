<template>
  <div class="deck-detail-page max-w-4xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-center">
      {{
        editMode ? 'Modifier le deck' : `Détail du deck: ${deck?.name || ''}`
      }}
    </h1>

    <div v-if="loading" class="flex justify-center p-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else-if="error" class="text-center p-8">
      <p class="text-red-500 text-lg mb-4">{{ error }}</p>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="fetchDeck"
      >
        Réessayer
      </button>
    </div>

    <div v-else-if="deck" class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">Nom du deck</label>
        <input
          v-model="name"
          type="text"
          placeholder="Nom du deck..."
          :disabled="!editMode"
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          :class="{ 'border-red-500': editMode && !isNameValid }"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-4">
          {{
            editMode ? 'Sélectionnez exactement 10 cartes' : '10 cartes du deck'
          }}
          ({{ editMode ? selectedCards.length : deckSelectedCards.length }}/10)
        </label>
        <CardGrid
          v-if="!pokemonStore.loading"
          :cards="pokemonStore.pokemons"
          :model-value="editMode ? selectedCards : deckSelectedCards"
          :max-selected="10"
          class="max-h-96 overflow-y-auto"
          @update:model-value="handleUpdate"
        />

        <div v-else class="flex justify-center p-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          ></div>
        </div>
        <p v-if="pokemonStore.error" class="mt-2 text-red-500 text-sm">
          {{ pokemonStore.error }}
          <button class="underline ml-2" @click="pokemonStore.clearError">
            Réessayer
          </button>
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <button
          v-if="!editMode"
          class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-all"
          @click="goToEdit"
        >
          Modifier le deck
        </button>
        <button
          v-if="editMode"
          type="button"
          :disabled="!isFormValid || pokemonStore.loading || submitting"
          class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          @click="submit"
        >
          {{ submitting ? 'Mise à jour...' : 'Mettre à jour le deck' }}
        </button>
        <button
          v-if="editMode"
          type="button"
          class="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-all"
          @click="goToView"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { usePokemonStore } from '@/store/pokemon.store'
import type { Deck, DeckPayload } from '@/types'

const route = useRoute()
const router = useRouter()
const pokemonStore = usePokemonStore()
const api = useApi()

const deck = ref<Deck | null>(null)
const name = ref('')
const selectedCards = ref<number[]>([])
const loading = ref(false)
const error = ref('')
const submitting = ref(false)

const editMode = computed(() => route.path.includes('/edit'))

const deckSelectedCards = computed(
  () => deck.value?.cards.map((c): number => c.cardId) ?? [],
)

const isNameValid = computed(() => name.value.trim().length > 0)
const isCardsValid = computed(() => selectedCards.value.length === 10)
const isFormValid = computed(() => isNameValid.value && isCardsValid.value)

const handleUpdate = (value: number[]) => {
  if (editMode.value) {
    selectedCards.value = value
  }
}

const fetchDeck = async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    error.value = 'ID de deck invalide'
    return
  }

  loading.value = true
  error.value = ''
  try {
    deck.value = await api.getDeck(id)
    if (deck.value) {
      name.value = deck.value.name
      selectedCards.value = deck.value.cards.map((c) => c.cardId)
    } else {
      error.value = 'Deck non trouvé'
    }
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : 'Erreur lors du chargement du deck'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!isFormValid.value) return

  const id = Number(route.params.id)
  submitting.value = true
  try {
    const payload: DeckPayload = {
      name: name.value.trim(),
      cards: selectedCards.value,
    }
    await api.updateDeck(id, payload)
    router.push(`/decks/${id}`)
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
  } finally {
    submitting.value = false
  }
}

const goToEdit = () => {
  router.push(`/decks/${route.params.id}/edit`)
}

const goToView = () => {
  router.push(`/decks/${route.params.id}`)
}

onMounted(() => {
  if (!pokemonStore.hasPokemons) {
    pokemonStore.fetchPokemons()
  }
  fetchDeck()
})

watch(
  () => route.path,
  () => {
    fetchDeck()
  },
  { immediate: false },
)
</script>
