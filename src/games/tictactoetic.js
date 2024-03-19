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
  }

  update(action) {
    switch(action.name) {
      case 'move':
        this.makeMove(action.x, action.y)
        break;
      case 'expand':
        this.expand(action.dir)
        break;
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
    if (this.grid.get(x, y) !== null || this.outcome !== null) { return }
    
    this.grid.set(x, y, this.turn)
    
    const win = this.checkWin(this.turn);
    if (win !== null) {
      this.outcome = win
    } else {
      this.turn *= -1;
    }
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

    // Build grid
    this.gridItem = document.createElement('div')
    this.gridItem.id = 'tttgrid'
    this.gameContainer.appendChild(this.gridItem)
    this.gridItem.addEventListener('click', (evt) => {
      const target = evt.target
      if (!target.classList.contains('tttcell')) { return }

      this.sendAction({
        name: 'move',
        x: Number(target.dataset.x),
        y: Number(target.dataset.y),
      })
    })

    this.rebuildGrid(engine)

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
        this.sendAction({
          name: 'expand',
          dir: dir
        })
      })
    }
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

        const winPrefix =
          (engine.outcome &&
           engine.outcome.tiles.some((p) => 
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
      return '<i class=\'red fa-solid fa-x\'></i>'
    } else {
      return '<i class=\'blue fa-solid fa-o\'></i>'
    }
  }
}
