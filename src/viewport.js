class Viewport {
  constructor(parentElement, gameView) {
    this.translateX = 0
    this.translateY = 0
    this.dragX = 0
    this.dragY = 0

    this.dirty = false

    this.scaleFactor = 1.0

    // The viewport will attempt to scale the game view to a size of at most
    // minScaleFactor and keep it centered. 
    // If it has to scale the game view any smaller, it will not do so, and it
    // can then be translated.
    this.minScaleFactor = 1.0

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

    this.setTransform()

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

      this.translateX = this.dragX + deltaX
      this.translateY = this.dragY + deltaY

      this.translateX = Math.min(this.xExtents,
        Math.max(-this.xExtents, this.translateX))
      this.translateY = Math.min(this.yExtents,
        Math.max(-this.yExtents, this.translateY))

      if (!this.dirty) {
        const distance = Math.abs(this.translateX - this.dragX) +
          Math.abs(this.translateY - this.dragY)

        if (distance > 0.01) {
          this.dirty = true
        }
      }

      this.update()
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
    if (this.gameView.clientWidth - this.gameCenter.clientWidth < 0.01) {
      this.xExtents = 0
    }
    if (this.gameView.clientHeight - this.gameCenter.clientHeight < 0.01) {
      this.yExtents = 0
    }

    // Clip current translate to extents
    this.translateX = Math.min(this.xExtents,
      Math.max(-this.xExtents, this.translateX))
    this.translateY = Math.min(this.yExtents,
      Math.max(-this.yExtents, this.translateY))
  }

  setTransform() {
    let trueScaleFactor = Math.max(this.scaleFactor, this.minScaleFactor)
    this.gameView.style.scale = `${trueScaleFactor * 100}%`

    this.gameView.animate(
      { translate: `${this.translateX}px ${this.translateY}px` },
      { duration: 100, fill: 'forwards' }
    )
  }
}
