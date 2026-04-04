<template>
  <div class="game-page">
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

    <OpponentZone v-if="gameState" />

    <ActionBar v-if="gameState" />

    <PlayerZone v-if="gameState" />

    <GameModal v-if="showModal" />

    <div v-if="!gameState && myRole">Loading game...</div>
    <div v-if="!authStore.isAuthenticated">Please log in to play.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'
import { useGameStore } from '@/store/game.store'

const router = useRouter()
const gameStore = useGameStore()
const authStore = useAuthStore()

const errorMsg = computed(() => gameStore.errorMsg)
const gameState = computed(() => gameStore.gameState)
const myRole = computed(() => gameStore.myRole)
const showModal = computed(() => {
  const state = gameStore.gameState
  return state && (state.player1.scoreKO >= 3 || state.player2.scoreKO >= 3)
})

onMounted(() => {
  gameStore.connectGame()

  if (!gameStore.myRole) {
    router.push('/')
  }
})
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  gap: 2rem;
}

.error {
  color: red;
  text-align: center;
}
</style>
