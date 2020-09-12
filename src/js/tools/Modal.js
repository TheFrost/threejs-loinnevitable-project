import gsap from 'gsap'

export default class Modal {
  constructor () {
    this.DOM = {
      closeControls: [...document.querySelectorAll('.modal__close')]
    }

    this.init()
  }

  init () {
    this.bindEvents()
  }

  bindEvents () {
    const { closeControls } = this.DOM

    closeControls.forEach((control) => {
      control.addEventListener('click', ({ currentTarget }) => {
        this.trigger(currentTarget.dataset.closeRef, 'close')
      })
    })
  }

  trigger (id, action = 'open') {
    const instance = document.getElementById(id)
    const timeline = gsap.timeline()
    timeline
      .to(instance, {
        autoAlpha: +(action === 'open'),
        duration: 1,
        ease: 'Expo.easeOut'
      })
  }
}
