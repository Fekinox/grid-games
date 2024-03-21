class Viewport {
  constructor(parentElement, gameView) {
    this.translateX = 0
    this.translateY = 0
    this.dragX = 0
    this.dragY = 0

    this.minTranslateDistancePx = 40

    this.dirty = false

    this.scaleFactor = 1.0
    this.trueScaleFactor = 1.0

    // The base size of a game element in pixels. In this case, the base
    // game element size is based around the size of a grid cell.
    this.minElementSize = 32

    this.lastTranslateX = 0
    this.lastTranslateY = 0
    this.lastScale = 1.0

    // Build and obtain corresponding DOM elements
    this.center = elementBuild('div', {
      parent: parentElement,
      id: 'center',
    })

    this.center.dataset.mouseDownX = ''
    this.center.dataset.mouseDownY = ''

    this.gameCenter = elementBuild('div', {
      parent: this.center,
      id: 'gamecenter',
    })

    this.gameView = gameView
    this.gameCenter.appendChild(this.gameView)

    this.update()

    this.center.addEventListener('mousedown', (event) => {
      this.center.dataset.mouseDownX = event.clientX
      this.center.dataset.mouseDownY = event.clientY

      this.dragX = this.translateX
      this.dragY = this.translateY

      this.dirty = false
    })

    this.center.addEventListener('mouseup', (event) => {
      this.center.dataset.mouseDownX = ''
      this.center.dataset.mouseDownY = ''
    })

    this.center.addEventListener('mousemove', (event) => {
      const dX = this.center.dataset.mouseDownX
      const dY = this.center.dataset.mouseDownY

      if (dX === '' || dY === '') { return }

      const deltaX = event.clientX - Number(this.center.dataset.mouseDownX)
      const deltaY = event.clientY - Number(this.center.dataset.mouseDownY)

      let currentTX = this.dragX + deltaX
      let currentTY = this.dragY + deltaY

      currentTX = Math.min(this.xExtents,
        Math.max(-this.xExtents, currentTX))
      currentTY = Math.min(this.yExtents,
        Math.max(-this.yExtents, currentTY))

      if (!this.dirty) {
        const distance = Math.pow(currentTX - this.dragX, 2) +
          Math.pow(currentTY - this.dragY, 2)

        if (Math.sqrt(distance) > this.minTranslateDistancePx) {
          this.dirty = true
        }

      }

      if (this.dirty) {
        this.translateX = currentTX
        this.translateY = currentTY
        this.update()
      }
    })
  }

  update() {
    this.refreshScaleFactor()
    this.setTransform()
    this.refreshExtents()
  }

  refreshScaleFactor() {
    // Get the ratio of the gameCenter container's width&height and the size of
    // the largest dimension of the gameview.

    let xScaling = this.gameCenter.clientWidth/this.gameView.clientWidth
    let yScaling = this.gameCenter.clientHeight/this.gameView.clientHeight

    this.scaleFactor = Math.min(xScaling, yScaling)
  }

  refreshExtents() {
    this.xExtents = this.gameView.clientWidth / 2
    this.yExtents = this.gameView.clientHeight / 2

    // Disable translation in certain axes if it's too small in that dimension
    if (this.gameView.clientWidth * this.lastScale
        - this.gameCenter.clientWidth < 0.01) {
      this.xExtents = 0
    }
    if (this.gameView.clientHeight * this.lastScale
        - this.gameCenter.clientHeight < 0.01) {
      this.yExtents = 0
    }

    // Clip current translate to extents
    this.translateX = Math.min(this.xExtents,
      Math.max(-this.xExtents, this.translateX))
    this.translateY = Math.min(this.yExtents,
      Math.max(-this.yExtents, this.translateY))
  }

  setTransform() {
    // Font size from stylesheet is equal to the viewport's longest dimension,
    // so compute that quantity.
    let viewportMaxDimension =
      Math.max(
        Math.max(document.documentElement.clientWidth || 0,
               window.innerWidth || 0),
        Math.max(document.documentElement.clientHeight || 0,
               window.innerHeight || 0)
      )

    // Obtain the minimum scale factor by getting the ratio between the
    // minimum element size and the viewport's max dimension.
    let minScaleFactor = this.minElementSize / viewportMaxDimension

    // The true scale factor cannot be smaller than the min.
    this.trueScaleFactor = Math.max(this.scaleFactor, minScaleFactor)

    if (Math.abs(this.trueScaleFactor - this.lastScale) > 1e-6) {
      this.gameView.style.scale = `${this.trueScaleFactor * 100}%`
      this.lastScale = this.trueScaleFactor
    }

    if (Math.abs(this.translateX - this.lastTranslateX) > 1e-6 ||
        Math.abs(this.translateY - this.lastTranslateY) > 1e-6) {
      this.gameView.animate(
        { translate: `${this.translateX}px ${this.translateY}px` },
        { duration: 100, fill: 'forwards' }
      )

      this.lastTranslateX = this.translateX
      this.lastTranslateY = this.translateY
    }
    // this.gameView.style.translate = `${this.translateX}px ${this.translateY}px`
  }
}
