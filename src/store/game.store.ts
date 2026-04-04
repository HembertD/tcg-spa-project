import { defineStore } from 'pinia'
import io from 'socket.io-client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import type { GameResult, GameState, MyRole, Room } from '@/types'

import { useAuthStore } from './auth.store'

export const useGameStore = defineStore('game', () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const rooms = ref<Room[]>([])
  const myRoomId = ref<string | null>(null)
  const errorMsg = ref('')

  const gameState = ref<GameState | null>(null)
  const isMyTurn = ref(false)
  const myRole = ref<MyRole | null>(null)
  const opponentDisconnected = ref(false)

  let lobbySocket: ReturnType<typeof io> | null = null
  let gameSocket: ReturnType<typeof io> | null = null

  const connectLobby = () => {
    if (!authStore.token) return

    lobbySocket = io('/lobby', {
      auth: { token: authStore.token },
    })

    lobbySocket.on('roomsList', (roomsList: Room[]) => {
      rooms.value = roomsList
    })

    lobbySocket.on('roomsListUpdated', (roomsList: Room[]) => {
      rooms.value = roomsList
    })

    lobbySocket.on('roomCreated', (roomId: string) => {
      myRoomId.value = roomId
    })

    lobbySocket.on('gameStarted', () => {
      router.push('/game')
    })

    lobbySocket.on('error', (msg: string) => {
      errorMsg.value = msg
      setTimeout(() => {
        errorMsg.value = ''
      }, 5000)
    })
  }

  const createRoom = (deckId: string) => {
    if (lobbySocket) {
      lobbySocket.emit('createRoom', deckId)
    }
  }

  const joinRoom = (roomId: string, deckId: string) => {
    if (lobbySocket) {
      lobbySocket.emit('joinRoom', roomId, deckId)
    }
  }

  const connectGame = () => {
    if (!authStore.token) return

    gameSocket = io('/game', {
      auth: { token: authStore.token },
    })

    gameSocket.on(
      'gameStateUpdated',
      (state: GameState, turn: 'player1' | 'player2', role: MyRole) => {
        gameState.value = state
        myRole.value = role
        isMyTurn.value = turn === (role === 'host' ? 'player1' : 'player2')
      },
    )

    gameSocket.on('gameEnded', (_result: GameResult) => {
      return
    })

    gameSocket.on('opponentDisconnected', () => {
      opponentDisconnected.value = true
    })
  }

  const drawCards = () => {
    if (gameSocket) gameSocket.emit('draw')
  }

  const playCard = (cardId: string) => {
    if (gameSocket) gameSocket.emit('playCard', cardId)
  }

  const attack = () => {
    if (gameSocket) gameSocket.emit('attack')
  }

  const endTurn = () => {
    if (gameSocket) gameSocket.emit('endTurn')
  }

  const resetGame = () => {
    gameState.value = null
    isMyTurn.value = false
    myRole.value = null
    opponentDisconnected.value = false
    myRoomId.value = null
    rooms.value = []
    errorMsg.value = ''
    lobbySocket?.disconnect()
    gameSocket?.disconnect()
    lobbySocket = null
    gameSocket = null
  }

  if (authStore.token) {
    connectLobby()
  }

  return {
    rooms,
    myRoomId,
    errorMsg,
    createRoom,
    joinRoom,
    connectLobby,
    gameState,
    isMyTurn,
    myRole,
    opponentDisconnected,
    drawCards,
    playCard,
    attack,
    endTurn,
    connectGame,
    resetGame,
  }
})
