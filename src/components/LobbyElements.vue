<template>
  <div class="lobby">
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

    <div class="rooms-section">
      <h2>Rooms disponibles</h2>
      <div v-if="rooms.length === 0" class="empty">Aucune room disponible</div>
      <div v-else class="rooms-list">
        <div v-for="room in rooms" :key="room.id" class="room-card">
          <div>Room {{ room.id }}</div>
          <div>{{ room.players.length }}/2 joueurs</div>
          <div v-if="room.status === 'waiting'" class="status waiting">
            En attente
          </div>
          <div v-else class="status playing">En cours</div>
          <NButton
            v-if="room.status === 'waiting'"
            size="small"
            @click="joinRoom(room.id)"
          >
            Rejoindre (choisir deck)
          </NButton>
        </div>
      </div>
    </div>

    <div class="create-section">
      <h2>Créer une room</h2>
      <NSelect
        v-model:value="selectedDeckId"
        placeholder="Choisir un deck"
        :options="deckOptions"
      />
      <NButton type="primary" :disabled="!selectedDeckId" @click="createRoom">
        Créer room
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useGameStore } from '@/store/game.store'
import { usePokemonStore } from '@/store/pokemon.store'

const gameStore = useGameStore()
const pokemonStore = usePokemonStore()

const rooms = computed(() => gameStore.rooms)
const errorMsg = computed(() => gameStore.errorMsg)
const selectedDeckId = ref('')

const deckOptions = computed(() =>
  pokemonStore.pokemons.map((pokemon) => ({
    label: pokemon.name,
    value: pokemon.id.toString(),
  })),
)

onMounted(() => {
  gameStore.connectLobby()
})

const createRoom = () => {
  if (selectedDeckId.value) {
    gameStore.createRoom(selectedDeckId.value)
    selectedDeckId.value = ''
  }
}

const joinRoom = (roomId: string) => {
  const deckId = selectedDeckId.value || deckOptions.value[0]?.value
  if (deckId) {
    gameStore.joinRoom(roomId, deckId)
    selectedDeckId.value = ''
  }
}
</script>

<style scoped>
.lobby {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.error {
  color: red;
  text-align: center;
  padding: 1rem;
  background: #fee;
  border-radius: 8px;
}

.rooms-section,
.create-section {
  padding: 1.5rem;
  background: var(--n-color);
  border-radius: 12px;
  box-shadow: var(--n-shadow);
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.room-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status.waiting {
  background: #d4edda;
  color: #155724;
}

.status.playing {
  background: #f8d7da;
  color: #721c24;
}
</style>
