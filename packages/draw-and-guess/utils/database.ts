import type { PlayingRoomPlayer, Player, WaitingRoom, PlayingRoom, PrizeGivingRoom, WaitingRoomPlayer, GameRound, PrizeGivingRoomPlayer } from '~/interfaces'
import { generateRandom } from '~/utils'

type Room = WaitingRoom | PlayingRoom | PrizeGivingRoom

// TODO: better implmentation to store and manipulate room data

class RoomHelper {
  room: Room
  constructor (room: Room) {
    this.room = room
  }

  getPlayer (playerId: string) {
    return this.room.players.find(player => player.id === playerId)
  }

  addPlayer (player: Player) {
    const _player: WaitingRoomPlayer = {
      ...player,
      isHost: false,
      isReady: false
    }
    this.room.players.push(_player as any)
  }

  removePlayer (playerId: string) {
    this.room.players = this.room.players.filter(player => player.id !== playerId) as any
  }

  setNextState (state: Room['state']) {
    if (this.room.state === state) {
      return
    }

    switch (state) {
      case 'playing':
        this.setPlaying()
        break
      case 'prizing':
        this.setPrizing()
        break
      default:
        throw new Error(`Invalid state ${state}`)
    }
  }

  setPlaying () {
    const room = this.room as WaitingRoom
    const currentGameRound: GameRound = {
      answer: room.answerTheme.answers[0].text,
      paintist: room.players.find(player => player.isHost)!.id,
      guessers: room.players.filter(player => !player.isHost).map(player => player.id),
      assistants: [],
      correctGuessers: [],
      round: 0,
      totalTime: 60
    }
    const players = room.players.map<PlayingRoomPlayer>(player => ({
      id: player.id,
      avatar: player.avatar,
      name: player.name,
      score: 0
    }))
    const _room: PlayingRoom = {
      players,
      currentGameRound,
      state: 'playing',
      id: room.id,
      name: room.name,
      answerTheme: room.answerTheme
    }
    this.room = _room
    roomDatabase.setRoom(_room.id, _room)
  }

  setPrizing () {
    const room = this.room as PlayingRoom
    const players = [...room.players].sort((a, b) => b.score - a.score)
    const _players = players.map<PrizeGivingRoomPlayer>(player => ({
      id: player.id,
      avatar: player.avatar,
      name: player.name,
      score: player.score,
      rank: 0
    }))
    const _room: PrizeGivingRoom = {
      players: _players,
      state: 'prizing',
      id: room.id,
      name: room.name
    }
    this.room = _room
    roomDatabase.setRoom(_room.id, _room)
  }

  setNextRound () {
    const room = this.room as PlayingRoom
    const { currentGameRound, players, answerTheme } = room
    const nextPaintistIndex = players.findIndex(player => player.id === currentGameRound.paintist) + 1
    const nextAnswerIndex = answerTheme.answers.findIndex(answer => answer.text === currentGameRound.answer) + 1
    const nextGameRound: GameRound = {
      answer: answerTheme.answers[nextAnswerIndex]!.text,
      paintist: players[nextPaintistIndex].id,
      guessers: room.players.filter((_, index) => index !== nextPaintistIndex).map(player => player.id),
      assistants: [],
      correctGuessers: [],
      round: 0,
      totalTime: 60
    }
    room.currentGameRound = nextGameRound
    roomDatabase.setRoom(room.id, room)
  }
}

const createRoomHelper = (room?: Room) => {
  return room ? new RoomHelper(room) : undefined
}

class RoomDatabase {
  private rooms: Room[] = []

  createRoom (player: Player, theme: string) {
    const room: WaitingRoom = {
      id: generateRandom(8),
      name: `${player.name}的房间`,
      state: 'waiting',
      players: [{ ...player, isHost: true, isReady: true }],
      answerTheme: {
        theme,
        // TODO: pick answers from database
        answers: [{ text: 'test1' }, { text: 'test2' }]
      }
    }
    this.rooms.push(room)
    return createRoomHelper(room)!
  }

  getRoom (roomId: string) {
    const room = this.rooms.find(room => room.id === roomId)
    return createRoomHelper(room)
  }

  setRoom (roomId: string, room: Room) {
    const index = this.rooms.findIndex(room => room.id === roomId)
    this.rooms[index] = room
  }

  removeRoom (roomId: string) {
    const room = this.getRoom(roomId)
    if (!room) {
      return
    }
    this.rooms = this.rooms.filter(room => room.id !== roomId)
  }
}

export const roomDatabase = new RoomDatabase()
