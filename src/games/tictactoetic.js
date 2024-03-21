class TeeFourEngine {
  constructor(rules) {
    this.initWidth = rules.width
    this.initHeight = rules.height
    this.toWin = rules.toWin
    this.misere = rules.misere
    this.name = 'teefour'

    this.reset()
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

  // Resets all game parameters.
  reset() {
    this.grid = new Grid(this.initWidth, this.initHeight)
    this.turn = 1
    this.outcome = null

    this.lastExpansion = null
  }

  update(action) {
    if (this.outcome !== null) { return false; }

    switch(action.name) {
      case 'move':
        this.lastExpansion = null
        return this.makeMove(action.x, action.y)
      case 'expand':
        this.lastExpansion = action.dir
        this.expand(action.dir)
        return true
    }
  }

  // Check for all possible wins and return the first win.
  checkWin(player) {
    let wins = this.grid.allKInARows(this.toWin, player)
    return (wins.length !== 0)
    ? {
      player: (!this.misere) ? this.turn : -this.turn,
      tiles: wins[0],
    }
    : null
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

    this.gridView = new GridView(
      this.gameContainer,
      () => { return this.isTranslating() },
    )

    this.gridView.buildNewGrid(
      this.internalGrid,
      'hoverable'
    )

    this.gridView.onclick = (pos) => {
      this.sendAction({
        name: 'move',
        x: pos.x,
        y: pos.y,
      })
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
    let newRenderableGrid = new Grid(engine.grid.width, engine.grid.height)

    for (let y = 0; y < engine.grid.height; y++) {
      for (let x = 0; x < engine.grid.width; x++) {
        let newClassList = ''
        const entry = engine.grid.get(x, y)

        // Check if this is a new cell added from an expansion
        if (engine.lastExpansion !== null &&
          (engine.lastExpansion === 'up' && y === 0 ||
           engine.lastExpansion === 'down' && y === engine.grid.height-1 ||
          engine.lastExpansion === 'left' && x === 0 ||
           engine.lastExpansion === 'right' && x === engine.grid.width-1 )) {
          newClassList += 'expandedcell '
        }

        if (entry === 1) {
          newClassList += 'red bx bx-x'
        } else if (entry === -1) {
          newClassList += 'blue bx bx-radio-circle'
        } else {
          newClassList += 'hoverable'
        }

        newRenderableGrid.set(x, y, newClassList)
      }
    }

    this.internalGrid = engine.grid.clone()
    this.gridView.buildNewGrid(newRenderableGrid, 'hoverable')
  }

  // Updates the view with the current game state.
  render(engine) {
    if (engine.grid.width !== this.internalGrid.width ||
        engine.grid.height !== this.internalGrid.height) {
      this.rebuildGrid(engine)
      return
    }
    for (let y = 0; y < engine.grid.height; y++) {
      for (let x = 0; x < engine.grid.width; x++) {
        const entry = engine.grid.get(x, y)
        const oldEntry = this.internalGrid.get(x, y)
        let newClassList = ''

        const winPrefix =
          (engine.outcome &&
           engine.outcome.tiles.some((p) => 
            p.x === x && p.y === y  
           ))
          ? 'win-'
          : ''

        if (entry !== oldEntry) {
          newClassList += 'newcell '
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
