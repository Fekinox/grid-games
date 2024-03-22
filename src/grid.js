// A 2-dimensional container with a width and a height.
class Grid {
  static allDirections = [
    { x: 1, y: 1, }, // SE
    { x: 1, y: 0, }, // E
    { x: 1, y: -1, }, // NE
    { x: 0, y: -1, }, // N
    { x: -1, y: -1, }, // NW
    { x: -1, y: 0, }, // W
    { x: -1, y: 1, }, // SW
    { x: 0, y: 1, }, // S
  ]

  static forwardDirections = [
    { x: 1, y: 0, }, // E
    { x: 0, y: 1, }, // S
    { x: 1, y: -1, }, // NE
    { x: 1, y: 1, }, // SE
  ]

  // Constructs a new grid given a width and a height.
  // If mapFun is provided, then the (x, y) cell of the grid will be
  // mapFun(x, y).
  constructor(width, height, mapFun = null) {
    this.width = width
    this.height = height
    let f = () => null
    if (mapFun !== null) { 
      f = (v, idx) => {
        return mapFun(idx % this.width, Math.floor(idx / this.width))
      }
    } 
    this.grid = 
      Array.from({ length: this.width * this.height },
      f)
  }

  // Gets the index within the grid array.
  index(x, y) {
    return x + (y * this.width)
  }

  // Returns true if the given coordinates are within the grid bounds.
  inBounds(x, y) {
    return 0 <= x && x < this.width && 0 <= y && y < this.height
  }

  // Retrieve a reference to element (x, y) in the grid. Returns null
  // if the index is out of bounds.
  get(x, y) {
    if (!this.inBounds(x, y)) { return null }
    return this.grid[this.index(x, y)]
  }

  // Set the element at (x, y) to the given value. Will do nothing if
  // the given coordinates are out of bounds.
  set(x, y, v) {
    if (!this.inBounds(x, y)) { return null }
    this.grid[this.index(x, y)] = v
  }

  // Produces a shallow copy of the current grid.
  clone() {
    let clone = new Grid(this.width, this.height)
    clone.grid = [...this.grid]
    return clone
  }

  // Scans the grid in the given direction (dx, dy) and returns the results as
  // an array of objects (x, y, elem).
  lineQuery(x, y, dx, dy) {
    let res = []

    let xx = x
    let yy = y

    while (this.inBounds(xx, yy)) {
      res.push({
        x: xx,
        y: yy,
        elem: this.get(xx, yy)
      })
      xx += dx
      yy += dy
    }

    return res
  }

  // Searches the grid for k consecutive elements equal to `elem` in a row.
  kInARow(x, y, dx, dy, length, elem) {
    const endX = x + dx*(length - 1)
    const endY = y + dy*(length - 1)
    if (!this.inBounds(endX, endY) ||
      !this.inBounds(x, y) ||
      this.get(x, y) !== elem) { return null }

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

  // Replaces the grid with a new grid with dimensions newWidth and newHeight
  // and the entries of the old grid being placed at (originX, originY), with
  // all other values being null.
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
