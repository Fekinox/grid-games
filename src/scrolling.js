class Scroller {
  constructor(frame, content) {
    this.frame = frame
    this.content = content

    this.transform = {
      scale: 1.0,
      x: 0,
      y: 0,
    }
  }
}

let scroller
document.addEventListener('DOMContentLoaded', (event) => {
  scroller = new Scroller(
    document.getElementByID('gamecenter'),
    document.getElementByID('game'),
  )
})
