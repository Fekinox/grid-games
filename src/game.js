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

    this.toWin = toWin

    this.gridItem = null
    this.renderableGrid = new Grid(width, height)
    this.status = null

    this.reset()
  }
  
  // Resets all game parameters.
  reset() {
    this.toWin = this.initToWin

    this.grid = new Grid(this.initWidth, this.initHeight)
    this.turn = 1
    this.outcome = null
  }

  // Rebuilds the cached renderables.
  initCachedItems() {
    this.rootElement = document.querySelector(':root');
    this.gridItem = document.getElementById('tttgrid')
    this.gameContainer = document.getElementById('game')
    this.status = document.getElementById('statusline')
    this.resetButton = document.querySelector('button#reset')

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

    this.resetButton.addEventListener('click', (event) => { 
      this.reset()
      this.rebuildGrid()
      this.render()
    })

    // Expansion buttons
    for (const dir of ['up', 'down', 'left', 'right']) {
      const tag = `${dir}Button`
      this[tag] = document.querySelector(`button#${dir}`)
      this[tag].addEventListener('click', (event) => {
        this.expand(dir)
      })
    }
  }

  rebuildGrid() {
    this.gridItem.innerHTML = '';
    this.renderableGrid = new Grid(this.grid.width, this.grid.height)
    for (let y = 0; y < this.grid.height; y++) {
      let row = document.createElement('div')
      row.classList.add('tttrow')
      for (let x = 0; x < this.grid.width; x++) {
        let cell = document.createElement('div')
        cell.classList.add('tttcell')
        let entry = this.grid.get(x, y)
        if (entry === 1) { cell.classList.add('red') }
        else if (entry === -1) { cell.classList.add('blue') }
        cell.id = `${x} ${y}`

        row.appendChild(cell)
        this.renderableGrid.set(x, y, cell);
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
  
  // Check for all possible wins and return the first win.
  checkWin(player) {
    let wins = this.grid.allKInARows(this.toWin, player)
    return (wins.length !== 0)
    ? {
      player: this.turn,
      tiles: wins[0],
    }
    : null
  }
  
  // Sets the cell (x, y) to the current player's color, changes turn, and checks for a win.
  makeMove(x, y) {
    if (this.grid.get(x, y) !== null || this.outcome !== null) { return }
    
    this.grid.set(x, y, this.turn)
    
    const win = this.checkWin(this.turn);
    if (win !== null) {
      this.outcome = win
    } else {
      this.turn *= -1;
    }

    this.render()
  }

  expand(dir) {
    switch(dir) {
      case 'up':
        this.grid.resize(this.grid.width, this.grid.height + 1, 0, 1)
        break;
      case 'down':
        this.grid.resize(this.grid.width, this.grid.height + 1, 0, 0)
        break;
      case 'left':
        this.grid.resize(this.grid.width + 1, this.grid.height, 1, 0)
        break;
      case 'right':
        this.grid.resize(this.grid.width + 1, this.grid.height, 0, 0)
        break;
    }
    this.turn *= -1;
    this.rebuildGrid()
    this.render()
  }

  // Updates the view with the current game state.
  render() {
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        let cell = this.renderableGrid.get(x, y)
        cell.className = 'tttcell'
        const entry = this.grid.get(x, y)

        const winPrefix =
          (this.outcome &&
           this.outcome.tiles.some((p) => 
            p.x === x && p.y === y  
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
