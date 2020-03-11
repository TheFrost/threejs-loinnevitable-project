import * as THREE from 'three'
import Stats from 'stats.js'
import OrbitControlsModule from 'three-orbit-controls'
import { loader } from './utils/tools'

// subjects
import SceneSubject from './sceneSubjects/SceneSubject'

const OrbitControls = OrbitControlsModule(THREE)

export default class SceneManager {
  clock = new THREE.Clock()

  buildScene = () => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000')

    return scene
  }

  buildRender = ({ width, height }) => {
    const { canvas } = this

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1
    renderer.setPixelRatio(DPR)
    renderer.setSize(width, height)

    renderer.gammaInput = true
    renderer.gammaOutput = true

    return renderer
  }

  buildCamera = ({ width, height }) => {
    const aspectRatio = width / height
    const fieldOfView = 60
    const nearPlane = 1
    const farPlane = 100
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    )
    camera.position.z = 1

    return camera
  }

  buildStats = () => {
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  buildOrbitControls = (camera) => {
    return new OrbitControls(camera)
  }

  createSceneSubjects = (scene, resources) => {
    const sceneSubjects = [
      new SceneSubject(scene, resources)
    ]

    return sceneSubjects
  }

  preloadResources = async collection => {
    const promises = []

    collection.map(item => {
      const promise = new Promise((resolve, reject) => {
        loader.load(
          item.image, // path
          image => {
            item.image = image
            resolve(item)
          }, // onLoad callback
          undefined, // onProgress callback currently not supported
          xhr => { // onError callback
            reject(new Error(`${xhr} An error occurred loading while loading: ${item}`))
          }
        )
      })

      promises.push(promise)
    })

    const resources = await Promise.all(promises)

    return resources
  }

  init = resources => {
    this.resources = resources
    this.scene = this.buildScene()
    this.renderer = this.buildRender(this.screenDimentions)
    this.camera = this.buildCamera(this.screenDimentions)
    this.sceneSubjects = this.createSceneSubjects(this.scene, this.resources)
    if (this.debugMode) {
      this.buildStats()
      // this.buildOrbitControls(this.camera)
    }

    this.ready = true
  }

  constructor (
    {
      canvas = null,
      resources = []
    },
    debugMode = false
  ) {
    this.ready = false
    this.debugMode = debugMode
    this.canvas = canvas
    this.resources = []
    this.screenDimentions = {
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.preloadResources(resources)
      .then(textures => this.init(textures))
  }

  update () {
    if (!this.ready) return

    if (this.debugMode) this.stats.begin()

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    this.sceneSubjects.map(s => s.update ? s.update(delta, elapsed) : null)

    this.renderer.render(
      this.scene,
      this.camera
    )

    if (this.debugMode) this.stats.end()
  }

  resizeHandler () {
    const { width, height } = this.canvas

    this.screenDimentions = { width, height }

    if (!this.ready) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }
}
