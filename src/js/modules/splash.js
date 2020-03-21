import { TweenMax } from 'gsap'
import { pubsub } from '../tools'

export default class Splash {
  constructor () {
    this.DOM = {
      splash: document.querySelector('.splash'),
      action: document.querySelector('.splash__action')
    }
  }

  init () {
    this.bindEvents()
  }

  bindEvents () {
    const { action } = this.DOM

    action.addEventListener('click', () => this.triggerStart())
  }

  triggerStart () {
    const { splash } = this.DOM

    TweenMax.to(splash, 1, {
      autoAlpha: 0,
      ease: 'Expo.easeInOut'
    }).eventCallback('onComplete', () => {
      pubsub.publish('entry:init')
    })
  }
}
