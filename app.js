class GameState {
  constructor(width = 3, height = 3, toWin = 3) {
    // Dimensions of the game board.
    this.width = width
    this.height = height
    // Number of tiles in a row needed to win. Assumed to be at least 1.
    this.toWin = toWin

    this.gridItem = null
    this.renderableGrid = [];
    this.status = null

    this.reset()
  }
  
  // Resets all game parameters.
  reset() {
    this.grid =
      Array.from({ length: this.width * this.height},
      () => null)
    this.turn = 1
    this.outcome = null
  }

  // Rebuilds the cached renderables.
  rebuildCachedItems() {
    this.gridItem = document.querySelector('#tttgrid')
    this.gridItem.innerHTML = '';
    this.gridItem.addEventListener('click', (evt) => {
      const target = evt.target
      if (!target.classList.contains('tttcell')) { return }
      const coordinates = target.id.split(' ').map((s) => Number(s))
      if (coordinates.length < 2 ||
        coordinates.some((c) => 
          c === undefined || c === NaN
        )
      ) {
        console.log('Invalid cell ID')
        return
      }

      this.makeMove(coordinates[0], coordinates[1])
    })

    this.renderableGrid = [];
    for (let y = 0; y < this.height; y++) {
      let row = document.createElement('div')
      row.classList.add('tttrow')
      for (let x = 0; x < this.width; x++) {
        let cell = document.createElement('div')
        cell.classList.add('tttcell')
        let entry = this.get(x, y)
        if (entry === 1) { cell.classList.add('red') }
        else if (entry === -1) { cell.classList.add('blue') }
        cell.id = `${x} ${y}`
        // cell.addEventListener('click', (e) => {
        //   this.makeMove(x, y)
        // })

        row.appendChild(cell)
        this.renderableGrid.push(cell);
      }
      this.gridItem.appendChild(row)
    }

    this.status = document.getElementById('tttstatus')
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
    return (0 <= x && x < this.width) && (0 <= y && y < this.height)
  }
  
  // Check for a win starting from the cell (x, y) in the direction given by (dx, dy).
  checkWinIn(x, y, dx, dy) {
    let winner = this.get(x, y)
    if (winner === null) { return null }
    const end_x = x + dx*(this.toWin - 1)
    const end_y = y + dy*(this.toWin - 1)
    if (!this.inBounds(end_x, end_y)) { return null }
    
    let xx = x + dx
    let yy = y + dy
    let steps = 1
    
    while (this.inBounds(xx, yy) && steps < this.toWin) {
      if (winner !== this.get(xx, yy)) {
        return null
      }
      xx += dx
      yy += dy
      steps += 1
    }
    return winner
  }
  
  // Check for all possible wins and return the first win.
  checkWin() {
    let wins = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        [
          this.checkWinIn(x, y, 1, 0),
          this.checkWinIn(x, y, 0, 1),
          this.checkWinIn(x, y, 1, 1),
          this.checkWinIn(x, y, 1, -1)
        ].forEach((win) => {
          if (win !== null) { wins.push(win) }
        })
      }
    }
    return (wins.length !== 0)
    ? wins[0]
    : null
  }
  
  // Sets the cell (x, y) to the current player's color, changes turn, and checks for a win.
  makeMove(x, y) {
    if (this.get(x, y) !== null || this.outcome !== null) { return }
    
    this.set(x, y, this.turn)
    this.turn *= -1;
    
    const win = this.checkWin();
    if (win !== null) {
      this.outcome = win
    } else if (this.grid.every((cell) => cell !== null)) {
      this.outcome = 0
    }
    this.render()
  }

  // Updates the view with the current game state.
  render() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let cell = this.renderableGrid[this.index(x, y)]
        cell.classList.remove('red')
        cell.classList.remove('blue')
        let entry = this.get(x, y)
        if (entry === 1) { cell.classList.add('red') }
        else if (entry === -1) { cell.classList.add('blue') }
      }
    }
    
    this.renderStatus()
  }
  
  // Renders the current game status line beneath the grid.
  renderStatus() {
    if (this.outcome === null) {
      const color = (this.turn === 1) ? 'red' : 'blue'
      this.status.innerHTML =
        `<div class='indicator ${color}'></div> TO MOVE`
    } else {
      if (this.outcome === 0) {
        this.status.innerHTML = 'TIE'
      } else {
        const color = (this.outcome === 1) ? 'red' : 'blue'
        this.status.innerHTML =
          `<div class='indicator ${color}'></div> WIN`
      }
    }
  }
}

let state = new GameState(3, 3, 3);

document.addEventListener('DOMContentLoaded', (event) => {
  state.rebuildCachedItems()
  state.render()
});
