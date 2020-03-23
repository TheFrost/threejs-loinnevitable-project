import { pubsub } from '../tools'

export default class Audio {
  constructor () {
    this.DOM = {
      audio: document.querySelector('.audio')
    }
  }

  init () {
    this.bindEvents()
  }

  bindEvents () {
    pubsub.suscribe('entry:init', () => this.play())
  }

  play () {
    const { audio } = this.DOM
    audio.play()
  }
}
