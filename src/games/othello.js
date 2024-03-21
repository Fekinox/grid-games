class OthelloEngine {
  constructor(rules) {
    this.width = rules.width
    this.height = rules.height
    this.misere = rules.misere
    this.name = 'othello'

    this.reset()
  }

  static getEntry() {
    return {
      name: "Othello",
      description: "Cover as much of the game board as possible.",
      settings: new GameRules([
        new GameRuleEntry({
          name: "width",
          desc: "Board Width",
          type: {
            name: 'integer',
            lowerBound: 6,
          },
          default: 8,
        }),
        new GameRuleEntry({
          name: "height",
          desc: "Board Height",
          type: {
            name: 'integer',
            lowerBound: 6,
          },
          default: 8,
        }),
        new GameRuleEntry({
          name: "misere",
          desc: "Misere rules",
          type: {
            name: 'boolean',
          },
          default: false,
        }),
      ]),
      run: (rules) => new OthelloEngine(rules),
    }
  }

  // Resets all game parameters.
  reset() {
    this.grid = new Grid(this.width, this.height)
    this.turn = 1
    this.outcome = null
    console.log(this.outcome)

    // In Othello, set center of board to
    // 0 1
    // 1 0
    let centerX = Math.floor(this.width/2)-1
    let centerY = Math.floor(this.width/2)-1
    this.grid.set(centerX, centerY, -1)
    this.grid.set(centerX+1, centerY+1, -1)
    this.grid.set(centerX, centerY+1, 1)
    this.grid.set(centerX+1, centerY, 1)

    this.currentPlayerLegalMoves = new Grid(this.width, this.height)
    this.setCurrentPlayerLegalMoves()

  }

  matchesAt(x, y, player) {
    const dirs = [
      { x: 1, y: 1, },
      { x: 1, y: 0, },
      { x: 1, y: -1, },
      { x: 0, y: -1, },
      { x: -1, y: -1, },
      { x: -1, y: 0, },
      { x: -1, y: 1, },
      { x: 0, y: 1, },
    ]

    // (x, y) is a legal move if
    return dirs.map((dir) => {
      const line = this.grid.lineQuery(x, y, dir.x, dir.y)
      let res = {
        toRemove: []
      }
      for (let i = 1; i < line.length; i++) {
        if (line[i].elem === -player) { 
          res.toRemove.push({x: line[i].x, y: line[i].y})
        }
        else if (line[i].elem === player) {
          res.darkPosition = {x: line[i].x, y: line[i].y}
          return res
        } else {
          return null
        }
      }
      return null
    }).filter((l) => l !== null && l.toRemove.length > 0)
  }

  setCurrentPlayerLegalMoves(player) {
    this.hasLegalMoves = false
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        const legal =
          (this.grid.get(x, y) === null &&
           this.matchesAt(x, y, this.turn).length !== 0)
        if (legal) { this.hasLegalMoves = true }
        this.currentPlayerLegalMoves.set(x, y, legal)
      }
    }
  }

  update(action) {
    switch(action.name) {
      case 'move':
        return this.makeMove(action.x, action.y)
      case 'pass':
        this.turn *= -1
        this.setCurrentPlayerLegalMoves()
        return true;
    }
  }

  // The game will end if one of two conditions hold:
  // - The board consists of only empty spaces and one player's color
  // - There are no legal moves either player can make
  checkWin() {
    // Count up the number of player 1 tiles, then the number of player 2 tiles.
    // If they are equal, it is a tie game.
    let player1Tiles = []
    let player2Tiles = []
    let legalMoves = 0

    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        // Game is not over if a legal move can be made
        if (this.grid.get(x, y) === null &&
          (this.matchesAt(x, y, this.turn) ||
           this.matchesAt(x, y, -this.turn))) {
          legalMoves += 1
        }
        else if (this.grid.get(x, y) === 1) {
          player1Tiles.push({ x: x, y: y })
        } else if (this.grid.get(x, y) === -1) {
          player2Tiles.push({ x: x, y: y })
        }
      }
    }

    if (player1Tiles.length === 0) {
        return {
          player: -1,
          tiles: player2Tiles
        }
    } else if (player2Tiles.length === 0) {
        return {
          player: 1,
          tiles: player1Tiles
        }
    } else if (legalMoves === 0) {
      if (player1Tiles.length > player2Tiles.length) { 
        return {
          player: 1,
          tiles: player1Tiles
        }
      } else if (player1Tiles.length < player2Tiles.length) { 
        return {
          player: -1,
          tiles: player2Tiles
        }
      } else {
        return {
          player: 0,
          tiles: []
        }
      }
    }

    return null
  }
  

  makeMove(x, y) {
    const lines = this.matchesAt(x, y, this.turn)
    if (this.grid.get(x, y) !== null ||
      this.outcome !== null ||
      lines.length === 0) { return false }
    
    this.grid.set(x, y, this.turn)
    lines.forEach((line) => {
      line.toRemove.forEach((position) => {
        this.grid.set(position.x, position.y, this.turn)
      })
    })

    const win = this.checkWin()
    if (win !== null) {
      this.outcome = win
      console.log(this.outcome)
    } else {
      this.turn *= -1
      this.setCurrentPlayerLegalMoves()
      if (!this.hasLegalMoves) {
        window.setTimeout(() => {
          this.sendAction({
            name: 'pass',
          })
        }, 3000)
      }
    }

    if (this.outcome !== null) {
      this.sendAction({
        name: 'gameOver',
        winner: this.outcome.player
      })
    }

    return true
  }

  buildView(domElems) {
    return new OthelloView(domElems, this)
  }
}

class OthelloView {
  constructor(domElems, engine) {
    this.rootElement = domElems.root
    this.gameContainer = domElems.container
    this.status = domElems.status

    // Build grid
    this.gridItem = document.createElement('div')
    this.gridItem.id = 'tttgrid'
    this.gameContainer.appendChild(this.gridItem)
    this.gridItem.addEventListener('click', (evt) => {
      if (this.isTranslating()) { return }
      const target = evt.target
      if (!target.classList.contains('tttcell')) { return }

      this.sendAction({
        name: 'move',
        x: Number(target.dataset.x),
        y: Number(target.dataset.y),
      })
    })

    this.rebuildGrid(engine)
  }

  rebuildGrid(engine) {
    this.gridItem.innerHTML = '';
    this.renderableGrid = new Grid(engine.grid.width, engine.grid.height)
    for (let y = 0; y < engine.grid.height; y++) {
      let row = document.createElement('div')
      row.classList.add('tttrow')
      for (let x = 0; x < engine.grid.width; x++) {
        let cell = document.createElement('div')
        cell.classList.add('tttcell')
        let entry = engine.grid.get(x, y)
        if (entry === 1) { cell.classList.add('red') }
        else if (entry === -1) { cell.classList.add('blue') }

        cell.dataset.x = x
        cell.dataset.y = y

        row.appendChild(cell)
        this.renderableGrid.set(x, y, cell);
      }
      this.gridItem.appendChild(row)
    }

    this.lastWidth = engine.grid.width
    this.lastHeight = engine.grid.height

    // Set transform to scale inner contents to 600px
    const maxLen = Math.max(
        this.gameContainer.clientWidth,
        this.gameContainer.clientHeight,
    )
    // this.scaleWindow(600/maxLen)
  }

  // Updates the view with the current game state.
  render(engine) {
    if (engine.grid.width !== this.lastWidth ||
        engine.grid.height !== this.lastHeight) {
      this.rebuildGrid(engine)
    }
    for (let y = 0; y < engine.grid.height; y++) {
      for (let x = 0; x < engine.grid.width; x++) {
        let cell = this.renderableGrid.get(x, y)
        cell.className = 'tttcell'
        const entry = engine.grid.get(x, y)
        const isLegal = engine.currentPlayerLegalMoves.get(x, y)

        const winPrefix =
          (engine.outcome &&
           engine.outcome.tiles.some((p) => 
            p.x === x && p.y === y  
           ))
          ? 'win-'
          : ''
        if (entry === 1) { 
          cell.classList.add(`${winPrefix}red`, 'bx', 'bx-x')
        }
        else if (entry === -1) {
          cell.classList.add(`${winPrefix}blue`, 'bx', 'bx-radio-circle')
        }
        else if (!this.outcome && isLegal) { 
          cell.classList.add('hoverable')
          cell.classList.add('legalmove')
        }
      }
    }

    let hover = ''
    if (engine.outcome && engine.outcome.player !== undefined) {
      hover = 'var(--bg-2)'
    } else if (engine.turn === 1) {
      hover = 'var(--player1-color)'
    } else {
      hover = 'var(--player2-color)'
    }
    this.rootElement.style.setProperty('--hover-color', hover)
    
    this.renderStatus(engine)
  }
  
  // Renders the current game status line beneath the grid.
  renderStatus(engine) {
    if (!engine.hasLegalMoves) {
      this.status.innerHTML =
        `${this.inlineIndicator(engine.turn)} HAS NO LEGAL MOVES, PASS.`
      this.status.className = ''
    } else if (engine.outcome === null) {
      this.status.innerHTML =
        `${this.inlineIndicator(engine.turn)} TO MOVE`
      this.status.className = ''
    } else {
      if (engine.outcome.player === 0) {
        this.status.innerHTML = 'TIE'
        this.status.className = 'tie'
      } else {
        this.status.innerHTML =
          `${this.inlineIndicator(engine.outcome.player)} WIN`
        const colorTag =
          (engine.outcome.player === 1)
          ? 'red'
          : 'blue'
        this.status.className = `win-${colorTag}`
      }
    }
  }

  inlineIndicator(color) {
    if (color === 1) {
      return '<i class=\'red bx bx-x\'></i>'
    } else {
      return '<i class=\'blue bx bx-radio-circle\'></i>'
    }
  }
}
