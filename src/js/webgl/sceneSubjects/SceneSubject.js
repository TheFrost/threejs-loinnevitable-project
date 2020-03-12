import * as THREE from 'three'
import { TimelineMax } from 'gsap'

// shaders
import vertexShader from '../shaders/vertexShader.glsl'
import fragmentShader from '../shaders/fragmentShader.glsl'

export default class SceneSubject {
  planes = []
  limitPlanes = 2
  frameCount = 0
  secondsCount = 0
  secondsLimit = 5
  currentIndex = null
  geometry = null
  material = null
  resources = null
  scene = null
  boolControl = false
  timerSlideActive = true

  constructor (scene, resources) {
    this.resources = resources
    this.currentIndex = resources.length > 0 ? 1 : 0
    this.scene = scene
    this.buildBaseSource()
    this.setupShapes()
  }

  buildBaseSource () {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1)
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uAlpha: {
          type: 'f',
          value: 1
        },
        uDegrade: {
          type: 'f',
          value: 0
        },
        uSeed: {
          type: 'f',
          value: 0
        },
        uTexture: {
          type: 't',
          value: null
        }
      }
    })
  }

  setupShapes () {
    for (let i = 0; i < this.limitPlanes; i++) {
      const materialClone = this.material.clone()

      materialClone.uniforms.uAlpha.value = 1 - i
      materialClone.uniforms.uTexture.value = this.resources[i].image

      const plane = new THREE.Mesh(
        this.geometry,
        materialClone
      )
      plane.position.z = -0.1 * i

      this.scene.add(plane)
      this.planes.push(plane)
    }
  }

  triggerChangeTimeline () {
    const planeFront = this.planes[+this.boolControl]
    const planeBack = this.planes[+!this.boolControl]
    const timeline = new TimelineMax()
    const baseTime = 2

    timeline
      .to(planeFront.material.uniforms.uAlpha, baseTime, {
        value: 0,
        ease: 'Expo.easeInOut'
      })
      .to(planeFront.position, baseTime, {
        z: -0.1,
        ease: 'Expo.easeInOut'
      }, `-=${baseTime}`)
      .to(planeBack.material.uniforms.uAlpha, baseTime, {
        value: 1,
        ease: 'Expo.easeInOut'
      }, `-=${baseTime}`)
      .to(planeBack.position, baseTime, {
        z: 0,
        ease: 'Expo.easeInOut'
      }, `-=${baseTime}`)
      .to(planeBack.material.uniforms.uDegrade, 2, {
        value: this.resources[this.currentIndex].degrade,
        ease: 'Circ.easeInOut'
      }, `-=${baseTime * 0.5}`)
      .eventCallback('onComplete', () => {
        planeFront.material.uniforms.uDegrade.value = 0
        this.nextSlideTexture(planeFront)
        this.timerSlideActive = true
        this.boolControl = !this.boolControl
      })
  }

  validateTimer () {
    if (this.secondsCount % this.secondsLimit === 0) {
      this.timerSlideActive = false
      this.frameCount = 0
      this.secondsCount = 0
      this.triggerChangeTimeline()
    }
  }

  nextSlideTexture (plane) {
    this.currentIndex++
    this.currentIndex = this.currentIndex === this.resources.length
      ? 0
      : this.currentIndex
    plane.material.uniforms.uTexture.value = this.resources[this.currentIndex].image
    plane.material.uniforms.uSeed.value = this.resources[this.currentIndex].seed
  }

  update () {
    this.frameCount++
    if (this.timerSlideActive && this.frameCount % 60 === 0) {
      this.secondsCount++
      this.validateTimer()
    }
  }
}
