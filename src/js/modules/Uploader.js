import Cropper from 'cropperjs'
import { modal } from '../tools'

export default class Uploader {
  cropper = null

  constructor () {
    this.DOM = {
      file: document.querySelector('.uploader__file'),
      image: document.querySelector('.uploader__image'),
      cropperUI: document.querySelector('.uploader__cropper-ui'),
      fileName: document.getElementById('name')
    }
  }

  init () {
    this.setupCropper()
    this.bindEvents()
  }

  bindEvents () {
    const { file } = this.DOM

    file.addEventListener('change', ({ target }) => this.readFile(target))
  }

  readFile ({ files = [] }) {
    if (files.length === 0) return

    const reader = new window.FileReader()
    reader.onload = ({ target }) => this.readFileHandler(target.result)
    reader.readAsDataURL(files[0])
    this.setupFileInfo(files[0])
  }

  readFileHandler (file) {
    this.cropper.replace(file)
    modal.trigger('uploader')
  }

  setupFileInfo ({ name }) {
    const { fileName } = this.DOM
    fileName.value = name
  }

  setupCropper () {
    const { image, cropperUI } = this.DOM
    this.cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      dragMode: 'move',
      cropBoxResizable: false,
      minCropBoxWidth: cropperUI.offsetWidth
    })
  }

  resizeHandler () {
    const { cropperUI } = this.DOM

    this.cropper.setCropBoxData({
      width: cropperUI.offsetWidth
    })
  }
}
