import 'regenerator-runtime/runtime'
import SceneManager from './webgl/SceneManager'
import Splash from './modules/splash'
import Audio from './modules/Audio'
import Uploader from './modules/Uploader'

const resources = [
  {
    image: 'https://images.unsplash.com/photo-1533661537256-701c0084511d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&h=1024',
    degrade: Math.random(),
    seed: Math.random()
  },
  {
    image: 'https://images.unsplash.com/photo-1557939403-1760a0e47505?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&h=1024',
    degrade: Math.random(),
    seed: Math.random()
  },
  {
    image: 'https://images.unsplash.com/photo-1564086539698-2c4d0e640d7a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&h=1024',
    degrade: Math.random(),
    seed: Math.random()
  },
  {
    image: 'https://images.unsplash.com/photo-1564022228519-2f6975e40da8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&h=1024',
    degrade: Math.random(),
    seed: Math.random()
  }
]

// selectors
const canvas = document.getElementById('canvas')

// modules
const sceneManager = new SceneManager({
  canvas,
  resources
}, true)

const splash = new Splash()
splash.init()

const audio = new Audio()
audio.init()

const uploader = new Uploader()
uploader.init()

// logic
const resizeCanvas = () => {
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  sceneManager.resizeHandler()
}

const bindEvents = () => {
  window.onresize = resizeCanvas
  resizeCanvas()
}

const render = () => {
  window.requestAnimationFrame(render)
  sceneManager.update()
}

// init
window.addEventListener('load', () => {
  bindEvents()
  render()
  splash.start()
})
