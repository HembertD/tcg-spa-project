<template>
  <div class="deck-detail-page max-w-4xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-center">
      {{
        editMode ? 'Modifier le deck' : `Détail du deck: ${deck?.name || ''}`
      }}
    </h1>

    <div
      v-if="deck && !canEdit"
      class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6"
    >
      <p class="text-sm text-yellow-700">
        <span class="text-2xl mr-2">⚠️</span>
        <strong class="font-medium">Attention !</strong> Seul le propriétaire
        peut modifier ce deck.
      </p>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else-if="deck" class="space-y-6">
      <NForm class="max-w-md">
        <NFormItem label="Nom du deck">
          <NInput
            v-model:value="name"
            placeholder="Nom du deck..."
            :disabled="!editMode || !canEdit"
            :status="editMode && !isNameValid ? 'error' : undefined"
          />
        </NFormItem>
      </NForm>

      <div>
        <label class="block text-sm font-medium mb-4">
          {{
            editMode
              ? canEdit
                ? 'Sélectionnez exactement 10 cartes'
                : 'Modification désactivée (propriétaire seulement)'
              : '10 cartes du deck'
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

      <NSpace
        justify="center"
        align="center"
        class="w-full gap-4 p-4"
        item-style="flex:1"
      >
        <NButton
          v-if="!editMode"
          type="success"
          size="large"
          :disabled="!canEdit"
          @click="goToEdit"
        >
          Modifier le deck
        </NButton>
        <NButton
          v-if="editMode"
          type="primary"
          size="large"
          :loading="submitting || pokemonStore.loading"
          :disabled="!isFormValid || !canEdit"
          @click="submit"
        >
          {{ submitting ? 'Mise à jour...' : 'Mettre à jour le deck' }}
        </NButton>
        <NButton v-if="editMode" tertiary size="large" @click="goToView">
          Annuler
        </NButton>
      </NSpace>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, NSpace, useMessage } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/store/auth.store'
import { usePokemonStore } from '@/store/pokemon.store'
import type { Deck, DeckPayload } from '@/types'

const route = useRoute()
const router = useRouter()
const pokemonStore = usePokemonStore()
const authStore = useAuthStore()
const message = useMessage()
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

const canEdit = computed(
  () => authStore.isAuthenticated && authStore.user?.id === deck.value?.userId,
)

const handleUpdate = (value: number[]) => {
  if (editMode.value && canEdit.value) {
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
    const errMsg =
      err instanceof Error ? err.message : 'Erreur lors du chargement du deck'
    error.value = errMsg
    message.error(errMsg)
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
    message.success('Deck mis à jour avec succès !')
    router.push(`/decks/${id}`)
  } catch (err: unknown) {
    const errMsg =
      err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
    error.value = errMsg
    message.error(errMsg)
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
