<template>
  <div class="container">
    <NSpace vertical style="width: 100%">
      <NButton
        size="large"
        type="primary"
        style="margin-bottom: 2rem"
        @click="createDeck"
      >
        Créer un deck
      </NButton>
      <DeckList />
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const createDeck = () => {
  router.push('/decks/create')
}
</script>
