class TeeFourEngine {
  constructor(rules) {
    this.initWidth = rules.width
    this.initHeight = rules.height
    this.toWin = rules.toWin
    this.misere = rules.misere
    this.name = 'teefour'

    this.reset()
  }

  // Resets all game parameters.
  reset() {
    this.grid = new Grid(this.initWidth, this.initHeight)
    this.turn = 1
    this.outcome = null

    this.lastAction = null
    this.potentialWins = new Grid(this.grid.width, this.grid.height, () => [])
  }


  static getEntry() {
    return {
      name: "Tic Tac Toe Tic",
      description: "4 by 4 board. Get 4 in a row to win. Can expand the board by adding a row or column to the edge.",
      settings: new GameRules([
        new GameRuleEntry({
          name: "width",
          desc: "Board Width",
          type: {
            name: 'integer',
            lowerBound: 2,
          },
          default: 4,
        }),
        new GameRuleEntry({
          name: "height",
          desc: "Board Height",
          type: {
            name: 'integer',
            lowerBound: 2,
          },
          default: 4,
        }),
        new GameRuleEntry({
          name: "toWin",
          desc: "Tiles to win",
          type: {
            name: 'integer',
            lowerBound: 2,
          },
          default: 4,
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
      run: (rules) => new TeeFourEngine(rules),
    }
  }

  update(action) {
    if (this.outcome !== null) { return false; }

    this.lastAction = action

    switch(action.name) {
      case 'move':
        return this.makeMove(action.x, action.y)
      case 'expand':
        this.expand(action.dir)
        return true
    }
  }

  // Check for all possible wins and return the first win.
  checkWin(player) {
    let wins = this.grid.allKInARows(this.toWin, player)
    let tiles = []
    wins.forEach((win) => {
      win.forEach((tile) => {
        if (!tiles.some((p) => {
          return p.x === tile.x && p.y === tile.y
        })) {
          tiles.push(tile)
        }
      })
    })

    return (wins.length !== 0)
    ? {
      player: (!this.misere) ? this.turn : -this.turn,
      tiles: tiles,
    }
    : null
  }

  // Update the potentialWins grid for potential winning moves for the current
  // player
  updatePotentialWins(player) {
    if (this.grid.height !== this.potentialWins.height ||
      this.grid.width !== this.potentialWins.width) {
      this.potentialWins = new Grid(this.grid.width, this.grid.height)
    }

    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.get(x, y) !== null) {
          this.potentialWins.set(x, y, [])
          continue
        }

        let wins = Grid.allDirections.map((dir) => {
          let xx = x + dir.x
          let yy = y + dir.y
          return this.grid.kInARow(xx, yy, dir.x, dir.y, this.toWin - 1, player)
        })
        .filter((win) => win !== null)
        this.potentialWins.set(x, y, wins)
      }
    }
  }
  

  makeMove(x, y) {
    if (this.grid.get(x, y) !== null || this.outcome !== null) { 
        return false
    }
    
    this.grid.set(x, y, this.turn)
    
    const win = this.checkWin(this.turn);
    if (win !== null) {
      this.outcome = win
    } else {
      this.turn *= -1;
    }

    if (this.outcome !== null) {
      this.sendAction({
        name: 'gameOver',
        winner: this.outcome.player
      })
    } else {
      this.updatePotentialWins(this.turn)
    }


    return true
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
    this.updatePotentialWins(this.turn)
  }

  buildView(domElems) {
    return new TeeFourView(domElems, this)
  }
}

class TeeFourView {
  constructor(domElems, engine) {
    this.rootElement = domElems.root
    this.gameContainer = domElems.container
    this.status = domElems.status

    this.internalGrid = engine.grid.clone()
    this.potWins = engine.potentialWins
    this.hoverboxes = new Grid(engine.grid.width, engine.grid.height,
      () => false)

    this.gridView = new GridView(this.gameContainer)

    this.gridView.buildNewGrid(engine.grid.width, engine.grid.height,
      (x, y, cell) => {
        cell.cell.classList.add('hoverable')
      }
    )

    this.gridView.onclick = (pos) => {
      if (this.isTranslating()) { return }
      this.sendAction({
        name: 'move',
        x: pos.x,
        y: pos.y,
      })
    }

    this.gridView.onhover = (pos) => {
      if (this.isTranslating()) { return }
      this.handleHover(pos)
    }

    // Expansion buttons
    for (const dir of ['up', 'down', 'left', 'right']) {
      const tag = `${dir}Button`
      let button = document.createElement('button')
      this[tag] = button

      button.id = dir
      button.classList.add('expand')

      let hbox = document.createElement('div')
      hbox.classList.add('hoverbox')
      button.appendChild(hbox)
      this.gameContainer.appendChild(button)
      button.addEventListener('click', (event) => {
        if (this.isTranslating()) { return }
        this.sendAction({
          name: 'expand',
          dir: dir
        })
      })
    }
  }

  rebuildGrid(engine) {
    let expDir = null
    if (engine.lastAction !== null && engine.lastAction.name === 'expand') {
      expDir = engine.lastAction.dir
    }
    this.gridView.buildNewGrid(engine.grid.width, engine.grid.height,
      (x, y, cell) => {
        const entry = engine.grid.get(x, y)

        if (entry === 1) {
          cell.cell.classList.add('red', 'bx', 'bx-x')
        } else if (entry === -1) {
          cell.cell.classList.add('blue', 'bx', 'bx-radio-circle')
        } else {
          cell.cell.classList.add('hoverable')
        }

        if (expDir !== null && (expDir === 'up' && y === 0 ||
          expDir === 'down' && y === engine.grid.height-1 ||
          expDir === 'left' && x === 0 ||
          expDir === 'right' && x === engine.grid.width-1 )) {
          applyAnimation(cell.cell, 'expandSpin')
        }
      }
    )
    this.internalGrid = engine.grid.clone()
    this.potWins = engine.potentialWins
    this.hoverboxes = new Grid(engine.grid.width, engine.grid.height,
      () => false)
  }

  // Updates the view with the current game state.
  render(engine) {
    if (engine.grid.width !== this.internalGrid.width ||
        engine.grid.height !== this.internalGrid.height) {
      this.rebuildGrid(engine)
      this.potWins = engine.potentialWins
      this.hoverboxes = new Grid(engine.grid.width, engine.grid.height,
        () => false)
      return
    }

    let delay = (x, y) => 0
    if (engine.lastAction !== null) {
      switch (engine.lastAction.name) {
        case 'move': {
          delay = (x, y) => {
            const dist = Math.abs(x - engine.lastAction.x) +
              Math.abs(y - engine.lastAction.y)
            return 50 * dist;
          }
        }
      }
    }

    for (let y = 0; y < engine.grid.height; y++) {
      for (let x = 0; x < engine.grid.width; x++) {
        const entry = engine.grid.get(x, y)
        const oldEntry = this.internalGrid.get(x, y)
        let newClassList = ''

        let winPrefix = ''
        if (engine.outcome &&
          engine.outcome.tiles.some((p) =>
            p.x === x && p.y === y)
        ) {
          winPrefix = 'win-'
          this.gridView.animate(x, y, 'winSpin', {
            delay: delay(x, y),
          })
          this.gridView.animate(x, y, 'bounceIn', {
            delay: delay(x, y),
          })
        }


        if (entry !== oldEntry) {
          this.gridView.animate(x, y, 'newCell')
        }

        if (entry === 1) {
          newClassList += `${winPrefix}red bx bx-x`
        } else if (entry === -1) {
          newClassList += `${winPrefix}blue bx bx-radio-circle`
        } else if (!engine.outcome) {
          newClassList += `hoverable`
        }

        this.gridView.update(x, y, newClassList)
        this.internalGrid.set(x, y, entry)
      }
    }

    let hover = ''
    if (engine.outcome && engine.outcome.player !== undefined) {
      hover = 'var(--background-color)'
    } else if (engine.turn === 1) {
      hover = 'var(--player1-color)'
    } else {
      hover = 'var(--player2-color)'
    }
    this.rootElement.style.setProperty('--hover-color', hover)
    
    this.renderStatus(engine)
  }

  handleHover(pos) {
    let winningTiles = []
    let delay = (x, y) => 0

    if (pos !== null) {
      const wins = this.potWins.get(pos.x, pos.y)

      wins.forEach((win) => {
        win.forEach((tile) => {
          if (!winningTiles.some((p) => 
            p.x === tile.x && p.y === tile.y
          )) {
            winningTiles.push(tile)
          }
        })
      })

      delay = (x, y) => {
        const dist = Math.abs(x - pos.x) +
          Math.abs(y - pos.y)
        return 50 * dist;
      }
    }

    for (let y = 0; y < this.potWins.height; y++) {
      for (let x = 0; x < this.potWins.width; x++) {
        const inWinTiles = winningTiles.some((p) => 
          p.x === x && p.y === y
        )
        const hboxVisible = this.hoverboxes.get(x, y)
        let hbox = this.gridView.getHbox(x, y)

        if (!hboxVisible && inWinTiles) {
          applyAnimation(hbox, 'quarterTurn', {
            duration: 300,
            delay: delay(x, y),
          })
          applyAnimation(hbox, 'fadeIn', {
            duration: 300,
            delay: delay(x, y),
          })
        } else if (hboxVisible && !inWinTiles) {
          applyAnimation(hbox, 'quarterTurn', {
            duration: 300,
          })
          applyAnimation(hbox, 'fadeOut', {
            duration: 300,
          })
        }
        this.hoverboxes.set(x, y, inWinTiles)
      }
    }
  }
  
  // Renders the current game status line beneath the grid.
  renderStatus(engine) {
    if (engine.outcome === null) {
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
