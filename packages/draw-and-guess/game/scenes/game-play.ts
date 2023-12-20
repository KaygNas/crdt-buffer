import type { Application } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { GamePlayHeader } from '../widgets/game-play-header'
import { PlayerAvatarList } from '../widgets/game-play-player-avatar-list'
import { Widget } from '../widgets/widget'
import { GamePlayToolBox, MessageInput } from '../widgets/game-play-toolbox'
import { GamePlayPaintBoard } from '../widgets/game-play-paint-board'
import { Scene } from './scene'
import type { Player } from '~/interfaces'

class GamePlayLayout extends Widget {
  background: Graphics
  header: GamePlayHeader
  paintBoard: GamePlayPaintBoard
  toolBox: GamePlayToolBox
  playerAvatarList: PlayerAvatarList

  constructor (opts: { header: GamePlayHeader, toolBox: GamePlayToolBox, paintBoard: GamePlayPaintBoard, playerAvatarList: PlayerAvatarList }) {
    super()

    this.background = new Graphics()
    this.view.addChild(this.background)

    const { header, paintBoard, toolBox, playerAvatarList } = opts
    this.header = header
    this.paintBoard = paintBoard
    this.toolBox = toolBox
    this.playerAvatarList = playerAvatarList
    this.addChild(header, paintBoard, toolBox, playerAvatarList)
  }

  layout (): void {
    const { header, background, paintBoard, toolBox, playerAvatarList, view } = this

    background.clear()
    background.beginFill(0xAAAAAA).drawRect(0, 0, view.parent.width, view.parent.height)
    playerAvatarList.view.position.set(0, background.height - playerAvatarList.view.height)
    toolBox.view.position.set(0, playerAvatarList.view.position.y - toolBox.view.height)
    paintBoard.view.mask = new Graphics().beginFill(0xFFFFFF)
      .drawRect(
        0,
        header.view.height,
        background.width,
        background.height - header.view.height - toolBox.view.height - playerAvatarList.view.height
      )
  }
}

interface GameRound {
  /** round number */
  round: number
  /** round answers */
  answer: string
  /** round paintist */
  paintist: Player
  /** round paintist teamates */
  teamates: Player[]
  /** round time */
  time: number
}

class GameRoundController {
  /** current round */
  currentRound: GameRound

  constructor (
    /** answers to draw for each round */
    public answers: string[],
    /** players in the game */
    public players: Player[]
  ) {
    this.currentRound = this.newRound(0)
  }

  nextRound (): void {
    this.currentRound = this.newRound(this.currentRound.round + 1)
  }

  private newRound (round: number): GameRound {
    const { answers, players } = this
    return {
      round,
      answer: answers[round],
      paintist: players[round],
      teamates: [],
      time: 60
    }
  }
}

/**
 * The Scene for creating a new room.
 */
export class GamePlay extends Scene {
  static Events = {
    GAME_END: 'game-end'
  }

  private gamePlayLayout: GamePlayLayout
  private gameRoundControler: GameRoundController

  constructor (app: Application) {
    super(app)

    const answers = ['test', 'test2']
    const players: Player[] = [{ id: '1', avatar: '', name: 'A' }, { id: '2', avatar: '', name: 'B' }]
    const gameRoundControler = new GameRoundController(answers, players)
    this.gameRoundControler = gameRoundControler

    const header = new GamePlayHeader()
    const paintBoard = new GamePlayPaintBoard()
    const toolBox = new GamePlayToolBox()
    const playerAvatarList = new PlayerAvatarList()

    const layout = new GamePlayLayout({ header, paintBoard, toolBox, playerAvatarList })
    this.gamePlayLayout = layout

    header.timer.setTimer(gameRoundControler.currentRound.time)
    header.answer.setAnswer(gameRoundControler.currentRound.answer)
    playerAvatarList.setPlayers(gameRoundControler.players)

    this.addChild(layout)
    this.listenEvents()
  }

  private listenEvents (): void {
    const { gamePlayLayout } = this
    gamePlayLayout.toolBox.messageInput.on(MessageInput.Events.SEND_MESSAGE, ({ message }) => {
      console.log('send message', message)
    })
    gamePlayLayout.toolBox.messageInput.on(MessageInput.Events.ASK_FOR_TEAM, () => {
      console.log('ask for team')
    })
  }

  // TODO: Add methods for updating the game state.
}
