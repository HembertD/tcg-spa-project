export interface Room {
  id: string
  players: {
    id: string
    name: string
    deckId: string
  }[]
  status: 'waiting' | 'playing' | 'finished'
}

export interface PlayerState {
  boardCard: string | null
  hpCurrent: number
  hand: string[]
  deckCount: number
  scoreKO: number
  turn: boolean
}

export interface GameState {
  player1: PlayerState
  player2: PlayerState
  currentTurn: 'player1' | 'player2'
}

export type MyRole = 'host' | 'guest'

export type GameResult = 'win' | 'loss' | 'draw'
