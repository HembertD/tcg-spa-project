<template>
  <div class="deck-create-page w-screen p-6 space-y-6">
    <div class="flex items-center justify-center gap-6 mb-8 relative">
      <NButton
        type="default"
        size="large"
        class="flex items-center gap-2 border-2 border-gray-400 rounded-xl px-4 py-2 text-gray-800 shadow-sm hover:bg-gray-100 hover:shadow-md transition"
        @click="goBack"
      >
        <span class="font-semibold">&lt;- Retour</span>
      </NButton>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Créer un deck
      </h1>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <NFormItem
        label="Nom du deck"
        label-style="font-size: 18px; font-weight: 600; color: #1f2937;"
      >
        <NInput
          v-model:value="name"
          placeholder="Entrez le nom de votre deck..."
          :status="!isNameValid ? 'error' : undefined"
          size="large"
        />
      </NFormItem>
      <div>
        <label class="block text-md font-semibold text-blue-600 mb-4">
          Sélectionnez exactement {{ selectedCards.length }}/10 cartes
        </label>
        <div class="w-full">
          <button
            type="submit"
            :disabled="!isFormValid || pokemonStore.loading || submitting"
            style="
              background: lightgreen;
              padding: 0.75rem;
              border: 1px solid #0ea5e9;
              border-radius: 0.5rem;
              font-weight: bold;
              margin-bottom: 1rem;
              color: white;
              text-align: center;
              width: 100%;
              box-sizing: border-box;
            "
            class="w-full"
          >
            {{ submitting ? 'Création...' : 'Créer le deck' }}
          </button>
        </div>

        <CardGrid
          v-if="!pokemonStore.loading"
          v-model="selectedCards"
          :cards="pokemonStore.pokemons"
          :max-selected="10"
          class="max-h-96 overflow-y-auto grid grid-cols-6 gap-4 p-4"
        />
        <div v-else class="flex justify-center p-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          ></div>
        </div>
        <div
          v-if="pokemonStore.error"
          class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-800 font-medium mb-2">{{ pokemonStore.error }}</p>
          <NButton
            type="error"
            size="small"
            @click="pokemonStore.fetchPokemons"
          >
            🔄 Recharger les cartes
          </NButton>
          <p
            v-if="pokemonStore.pokemons.length > 0"
            class="text-sm text-gray-600 mt-2"
          >
            (Mode fallback - sélectionnez 10 cartes pour tester)
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { NButton, NFormItem, NInput } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '@/components/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { usePokemonStore } from '@/store/pokemon.store'
import type { DeckPayload } from '@/types'

const router = useRouter()
const pokemonStore = usePokemonStore()
const api = useApi()

const name = ref('')
const selectedCards = ref<number[]>([])
const submitting = ref(false)

const isNameValid = computed(() => name.value.trim().length > 0)
const isCardsValid = computed(() => selectedCards.value.length === 10)
const isFormValid = computed(() => isNameValid.value && isCardsValid.value)

const goBack = () => router.push(ROUTES.HOME)

const submit = async () => {
  if (!isFormValid.value) return

  submitting.value = true
  try {
    const payload: DeckPayload = {
      name: name.value.trim(),
      cards: selectedCards.value,
    }
    await api.createDeck(payload)
    router.push(ROUTES.HOME)
  } catch {
    pokemonStore.clearError()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  pokemonStore.fetchPokemons()
})
</script>

<style scoped></style>
