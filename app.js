// TODO: Maybe make the game area scrollable and make the margin widths dynamic
// as well.
// TODO: Animations should not restart when you expand the board
// TODO: Add responsive design stuff as well
// TODO: Add additional variants (misere tic tac toe, for instance)
// TODO: Settings menu to set game parameters.
// TODO: Maybe some fun CSS effects in the background, it's otherwise kind of sparse.
// TODO: Add a proper menu system (this'll give me practice with writing other
// games)

class GameState {
  constructor(width = 3, height = 3, toWin = 3) {
    // Dimensions of the game board.
    this.initWidth = width
    this.initHeight = height
    this.initToWin = toWin

    this.width = width
    this.height = height
    this.toWin = toWin

    this.gridItem = null
    this.renderableGrid = [];
    this.status = null

    this.reset()
  }
  
  // Resets all game parameters.
  reset() {
    this.width = this.initWidth
    this.height = this.initHeight
    this.toWin = this.initToWin

    this.grid =
      Array.from({ length: this.width * this.height},
      () => null)
    this.turn = 1
    this.outcome = null
  }

  // Rebuilds the cached renderables.
  initCachedItems() {
    this.rootElement = document.querySelector(':root');
    this.gridItem = document.getElementById('tttgrid')
    this.gameContainer = document.getElementById('game')
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

    this.rebuildGrid()

    this.status = document.getElementById('statusline')

    this.resetButton = document.querySelector('button#reset')
    this.resetButton.addEventListener('click', (event) => { 
      this.reset()
      this.rebuildGrid()
      this.render()
    })

    // Expansion buttons
    let gs = this;
    ['up', 'down', 'left', 'right'].forEach((dir) => {
      const tag = `${dir}Button`
      console.log(tag)
      gs[tag] = document.querySelector(`button#${dir}`)
      gs[tag].addEventListener('click', (event) => {
        this.expand(dir)
      })
    })
  }

  rebuildGrid() {
    this.gridItem.innerHTML = '';
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

    // Set transform to scale inner contents to 600px
    const maxLen = Math.max(
        this.gameContainer.clientWidth,
        this.gameContainer.clientHeight,
    )
    // this.scaleWindow(600/maxLen)
  }

  scaleWindow(sizeFactor) {
    this.gameContainer.style.scale =
      `${sizeFactor * 100}%`
  }

  translateWindow(x, y) {
    this.gameContainer.style.translate =
      `${x}px ${y}px`
  }

  expandGrid(new_width, new_height, origin_x, origin_y) {
    let gs = this
    let newGrid =
      Array.from(
        { length: new_width * new_height },
        (v, idx) => {
          const cur_x = idx % new_width
          const cur_y = Math.floor(idx / new_width)

          const offset_x = cur_x - origin_x
          const offset_y = cur_y - origin_y

          if (gs.inBounds(offset_x, offset_y)) {
            return gs.get(offset_x, offset_y)
          } else {
            return null
          }
        }
      )
    this.width = new_width
    this.height = new_height
    this.grid = newGrid
    this.rebuildGrid()
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
    // Returns an object with the following properties:
  // player: Winning player
  // tiles: Winning tiles in tile coordinate form
  checkWinIn(x, y, dx, dy) {
    let winner = this.get(x, y)
    if (winner === null) { return null }
    const end_x = x + dx*(this.toWin - 1)
    const end_y = y + dy*(this.toWin - 1)
    if (!this.inBounds(end_x, end_y)) { return null }

    let winningTiles = [[x, y]]
    
    let xx = x + dx
    let yy = y + dy
    let steps = 1
    
    while (this.inBounds(xx, yy) && steps < this.toWin) {
      winningTiles.push([xx, yy])
      if (winner !== this.get(xx, yy)) {
        return null
      }
      xx += dx
      yy += dy
      steps += 1
    }
    return {
      player: winner,
      tiles: winningTiles
    }
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
    } 
    this.render()
  }

  expand(dir) {
    switch(dir) {
      case 'up':
        this.expandGrid(this.width, this.height + 1, 0, 1)
        break;
      case 'down':
        this.expandGrid(this.width, this.height + 1, 0, 0)
        break;
      case 'left':
        this.expandGrid(this.width + 1, this.height, 1, 0)
        break;
      case 'right':
        this.expandGrid(this.width + 1, this.height, 0, 0)
        break;
    }
    this.turn *= -1;
    this.render()
  }

  // Updates the view with the current game state.
  render() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let cell = this.renderableGrid[this.index(x, y)]
        cell.className = 'tttcell'
        const entry = this.get(x, y)

        const winPrefix =
          (this.outcome &&
           this.outcome.tiles.some((p) => 
            p[0] === x && p[1] === y  
           ))
          ? 'win-'
          : ''
        if (entry === 1) { 
          cell.classList.add(`${winPrefix}red`, 'filledcell')
        }
        else if (entry === -1) {
          cell.classList.add(`${winPrefix}blue`, 'filledcell')
        }
        else if (!this.outcome) { cell.classList.add('hoverable') }
      }
    }

    let hover = ''
    if (this.outcome && this.outcome.player !== undefined) {
      hover = 'var(--background-color)'
    } else if (this.turn === 1) {
      hover = 'var(--player1-color)'
    } else {
      hover = 'var(--player2-color)'
    }
    this.rootElement.style.setProperty('--hover-color', hover)
    
    this.renderStatus()
  }
  
  // Renders the current game status line beneath the grid.
  renderStatus() {
    if (this.outcome === null) {
      this.status.innerHTML =
        `${this.inlineIndicator(this.turn)} TO MOVE`
      this.status.className = ''
    } else {
      if (this.outcome.player === 0) {
        this.status.innerHTML = 'TIE'
        this.status.className = 'tie'
      } else {
        this.status.innerHTML =
          `${this.inlineIndicator(this.outcome.player)} WIN`
        const colorTag =
          (this.outcome.player === 1)
          ? 'red'
          : 'blue'
        this.status.className = `win-${colorTag}`
      }
    }
  }

  inlineIndicator(color) {
    if (color === 1) {
      return '<i class=\'red fa-solid fa-x\'></i>'
    } else {
      return '<i class=\'blue fa-solid fa-o\'></i>'
    }
  }
}

let state = new GameState(4, 4, 4);

document.addEventListener('DOMContentLoaded', (event) => {
  state.initCachedItems()
  state.render()
});

document.addEventListener('keydown', (event) => {
  console.log(event.key)
  switch (event.key.toLowerCase()) {
    case 'w':
      state.expandGrid(state.width, state.height + 1, 0, 1)
      state.render()
      break;
    case 'a':
      state.expandGrid(state.width + 1, state.height, 1, 0)
      state.render()
      break;
    case 's':
      state.expandGrid(state.width, state.height + 1, 0, 0)
      state.render()
      break;
    case 'd':
      state.expandGrid(state.width + 1, state.height, 0, 0)
      state.render()
      break;
  }
})

