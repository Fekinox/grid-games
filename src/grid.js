class Grid {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.grid = 
      Array.from({ length: this.width * this.height },
      () => null)
  }

  index(x, y) {
    return x + (y * this.width)
  }

  get(x, y) {
    return this.grid[this.index(x, y)]
  }

  set(x, y, v) {
    this.grid[this.index(x, y)] = v
  }

  inBounds(x, y) {
    return 0 <= x && x < this.width && 0 <= y && y < this.height
  }

  // Scans the grid in the given direction (dx, dy) and returns the results as
  // an array of objects (x, y, elem). dx and dy are assumed to have absolute
  // value at most 1.
  // If length is null, it will seek until it hits the edge of the grid.
  // If length is not null, it will seek as far as length, and return null if
  // it cannot go that far.
  lineQuery(x, y, dx, dy, length = null) {
    let curLength = length
    if (length === null) {
      let maxExtentX =
        (dx > 0)
        ? (this.width - x)
        : (x + 1)
      let maxExtentY = 
        (dy > 0)
        ? (this.height - x)
        : (y + 1)
      curLength = Math.min(maxExtentX, maxExtentY)
    }

    const endX = x + dx*(curLength - 1)
    const endY = y + dy*(curLength - 1)
    if (!this.inBounds(endX, endY)) { return null }

    let res = [{
      x: x,
      y: y,
      elem: this.get(x, y)
    }]

    let xx = x + dx
    let yy = y + dy
    let steps = 1

    while (this.inBounds(xx, yy) && steps < curLength) {
      res.push({
        x: xx,
        y: yy,
        elem: this.get(xx, yy)
      })
    }

    return res
  }

  // Searches the grid for k consecutive elements in a row.
  kInARow(x, y, dx, dy, length, elem) {
    const endX = x + dx*(length - 1)
    const endY = y + dy*(length - 1)
    if (!this.inBounds(endX, endY) || this.get(x, y) !== elem) { return null }

    let res = []

    let xx = x
    let yy = y
    let steps = 0

    while (this.inBounds(xx, yy) && steps < length) {
      if (this.get(xx, yy) !== elem) { return null }
      res.push({
        x: xx,
        y: yy,
      })
      xx += dx
      yy += dy
      steps += 1
    }

    return res
  }

  // Finds all k-in-a-rows of length `length` with elem `elem`
  allKInARows(length, elem) {
    let results = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        [
          this.kInARow(x, y, 1, 0, length, elem),
          this.kInARow(x, y, 0, 1, length, elem),
          this.kInARow(x, y, 1, 1, length, elem),
          this.kInARow(x, y, 1, -1, length, elem),
        ].forEach((res) => {
          if (res !== null) { results.push(res) }
        })
      }
    }

    return results
  }

  resize(newWidth, newHeight, originX, originY) {
    let g = this
    let newGrid =
      Array.from(
        { length: newWidth * newHeight },
        (v, idx) => {
          const curX = idx % newWidth
          const curY = Math.floor(idx / newWidth)

          const offsetX = curX - originX
          const offsetY = curY - originY

          if (g.inBounds(offsetX, offsetY)) {
            return g.get(offsetX, offsetY)
          } else {
            return null
          }
        }
      )
    this.width = newWidth
    this.height = newHeight
    this.grid = newGrid
  }
}
