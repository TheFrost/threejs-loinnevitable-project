import * as THREE from 'three'
import Guify from 'guify'
import { textureLoader } from '../utils/tools'

// shaders
import vertexShader from '../shaders/vertexShader.glsl'
import fragmentShader from '../shaders/fragmentShader.glsl'

export default class SceneSubject {
  constructor (scene) {
    const dinamicUniforms = {
      degrade: 0
    }

    const geometry = new THREE.PlaneBufferGeometry(5, 7)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        degrade: {
          type: 'f',
          value: dinamicUniforms.degrade
        },
        texture1: {
          type: 't',
          value: textureLoader.load('https://images.unsplash.com/photo-1517462964-21fdcec3f25b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80')
        },
        texture2: {
          type: 't',
          value: textureLoader.load('https://images.unsplash.com/photo-1542080681-b52d382432af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80')
        }
      }
    })

    this.mesh = new THREE.Mesh(geometry, material)

    scene.add(this.mesh)

    this.buildGuiControls(dinamicUniforms)
  }

  update (delta, time) {}

  buildGuiControls (object) {
    const gui = new Guify({
      root: document.body,
      align: 'right',
      open: true
    })

    gui.Register({
      type: 'range',
      label: 'Level Degrade',
      min: 0,
      max: 1,
      object,
      property: 'degrade',
      onChange: () => {
        this.mesh.material.uniforms.degrade.value = object.degrade
      }
    })
  }
}
