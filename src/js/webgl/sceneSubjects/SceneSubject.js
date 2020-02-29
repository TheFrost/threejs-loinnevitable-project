import * as THREE from 'three'
import Guify from 'guify'
import { loader } from '../utils/tools'

// shaders
import vertexShader from '../shaders/vertexShader.glsl'
import fragmentShader from '../shaders/fragmentShader.glsl'

export default class SceneSubject {
  constructor (scene, resources) {
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
          value: resources[0]
        },
        texture2: {
          type: 't',
          value: resources[1]
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
