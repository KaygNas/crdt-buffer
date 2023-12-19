import { Graphics, Text } from 'pixi.js'
import { Widget } from './widget'

class Timer extends Widget {
  static Events = {
    TIMEOUT: 'timeout'
  }

  time = 0

  timeText: Text
  timeIcon: Graphics

  constructor () {
    super()

    const timeText = new Text(this.time, { fontSize: 18 })
    this.timeText = timeText

    const ICON_SIZE = 24
    const timeIcon = new Graphics()
      .beginFill(0x000000)
      .drawCircle(ICON_SIZE / 2, ICON_SIZE / 2, ICON_SIZE / 2)
    this.timeIcon = timeIcon

    this.view.addChild(timeText, timeIcon)
  }

  layout (): void {
    const { timeText, timeIcon } = this

    timeText.position.set(timeIcon.getLocalBounds().right + 4, 0)
  }

  /**
   * update remaining time
   * @param time remaining time in seconds
   */
  setTimer (time: number): void {
    this.time = time
  }

  /**
   * start the timer, will emit timeout event at the end
   */
  start (): void {
    // TODO
  }
}

class Answer extends Widget {
  answer = ''

  private _displayAnswer = ''

  get displayAnswer (): string {
    return this._displayAnswer
  }

  set displayAnswer (displayAnswer: string) {
    this._displayAnswer = displayAnswer
    this.displayAnswerText.text = displayAnswer
  }

  displayAnswerText: Text

  constructor () {
    super()

    this.displayAnswerText = new Text(this.displayAnswer, { fontSize: 18 })
    this.view.addChild(this.displayAnswerText)
  }

  layout (): void {

  }

  /**
   * set the answer string
   * @param answer answer string
   */
  setAnswer (answer: string): void {
    this.answer = answer
    this.guess('')
  }

  /**
   * guess the answer, characters in the answer string will be shown
   * @param guessing user input
   * @returns return true if the answer is correct
   */
  guess (guessing: string): boolean {
    const displayAnswer = this.getDisplayAnswerFromGuessing(guessing)
    this.displayAnswer = displayAnswer
    return this.answer === guessing
  }

  /**
   * reveal the answer, all characters in the answer string will be shown
   */
  reveal (): void {
    this.displayAnswer = this.appendSpace(this.answer)
  }

  /**
   * set the display answer string by guessing
   */
  private getDisplayAnswerFromGuessing (guessing: string): string {
    const { answer } = this
    const displayAnswer = answer.split('').reduce((result, char, index) => {
      const nextChar = guessing[index] === char ? char : '_'
      return result + nextChar
    }, '')
    return this.appendSpace(displayAnswer)
  }

  private appendSpace (str: string): string {
    return str.split('').join(' ')
  }
}

export class GamePlayHeader extends Widget {
  timer: Timer
  answer: Answer
  background: Graphics

  constructor () {
    super()

    this.background = new Graphics()
    this.view.addChild(this.background)

    this.timer = new Timer()
    this.answer = new Answer()
    this.addChild(this.timer, this.answer)
  }

  layout (): void {
    const { background, view, timer, answer } = this

    background.clear()
    background.beginFill(0xEEEEEE).drawRect(0, 0, view.parent.width, 44)
    timer.view.position.set(
      12,
      (background.height - timer.view.height) / 2
    )
    answer.view.position.set(
      (background.width - answer.view.width) / 2,
      (background.height - answer.view.height) / 2
    )
  }
}
