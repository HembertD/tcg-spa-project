<template>
  <div class="deck-list">
    <NDataTable
      :columns="columns"
      :data="decks"
      :loading="isLoading"
      :row-key="(row) => row.id"
      empty="Aucun deck créé. Cliquez sur + pour en créer un !"
    />
  </div>
</template>

<script setup lang="ts">
import { NButton, NDataTable, NTag, useMessage } from 'naive-ui'
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const router = useRouter()
const message = useMessage()
const decks = ref<Deck[]>([])
const isLoading = ref(false)

const loadDecks = async () => {
  isLoading.value = true
  try {
    const { getMyDecks } = useApi()
    decks.value = await getMyDecks()
  } catch {
    message.error('Erreur lors du chargement des decks')
  } finally {
    isLoading.value = false
  }
}

const handleView = (id: number) => {
  router.push(`/decks/${id}`)
}

const handleEdit = (id: number) => {
  router.push(`/decks/${id}/edit`)
}

const handleDelete = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce deck ?')) {
    try {
      const { deleteDeck } = useApi()
      await deleteDeck(id)
      message.success('Deck supprimé avec succès !')
      loadDecks()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }
}

const columns = [
  {
    title: 'Nom',
    key: 'name',
  },
  {
    title: 'Nombre de cartes',
    key: 'cardsCount',
    render(row: Deck) {
      return h(NTag, null, {
        default: () => row.cards.length.toString(),
      })
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: Deck) {
      return h(
        'div',
        {
          style: 'white-space: nowrap; display: flex; gap: 4px;',
        },
        [
          h(
            NButton,
            {
              tertiary: true,
              size: 'small',
              onClick: () => handleView(row.id),
            },
            {
              default: () => 'Voir',
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              onClick: () => handleEdit(row.id),
            },
            {
              default: () => 'Modifier',
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              color: '#f56c6c',
              onClick: () => handleDelete(row.id),
            },
            {
              default: () => 'Supprimer',
            },
          ),
        ],
      )
    },
  },
]

onMounted(loadDecks)
</script>

<style scoped>
.deck-list {
  padding: 1rem;
}

@media (max-width: 768px) {
  .deck-list {
    padding: 0.5rem;
  }
}
</style>
