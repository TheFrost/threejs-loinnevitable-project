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
    this.setupElements()
    this.bindEvents()
  }

  bindEvents () {
    const { action } = this.DOM

    action.addEventListener('click', () => this.triggerStart())
  }

  setupElements () {
    const { action } = this.DOM
    TweenMax.set(action, {
      autoAlpha: 0
    })
  }

  start () {
    const { action } = this.DOM
    TweenMax.to(action, 2, {
      autoAlpha: 1,
      ease: 'Expo.easeInOut'
    })
  }

  triggerStart () {
    const { splash } = this.DOM

    TweenMax.to(splash, 2, {
      autoAlpha: 0,
      ease: 'Expo.easeInOut'
    }).eventCallback('onComplete', () => {
      pubsub.publish('entry:init')
    })
  }
}
