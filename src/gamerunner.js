class GameRunner {
  constructor(app) {
    this.app = app
    this.entry = null
  }

  initialize() {
    this.p1score = 0
    this.p2score = 0
    this.ties = 0

    this.getDOMElements()
  }

  clearGame() {
    this.game.innerHTML = ''
    this.entry = null

    this.p1score = 0
    this.p2score = 0
    this.ties = 0
  }

  startGame(gameEntry, rules) {
    this.clearGame()
    this.entry = gameEntry
    this.engine = gameEntry.run(rules)
    this.game.id = this.engine.name
    this.view = this.engine.buildView({
      root: this.root,
      container: this.game,
      status: this.statusLine,
    })

    this.engine.sendAction = (action) => this.handleAction(action)
    this.view.sendAction = (action) => this.handleAction(action)
    this.view.render(this.engine)
  }

  handleAction(action) {
    if (action.name === 'reset' || action === 'reset') {
      this.resetGame()
    } else if (action.name === 'gameOver') {
      switch(action.winner) {
        case 1:
          this.p1score += 1
          break;
        case -1:
          this.p2score += 1
          break;
        case 0:
          this.ties += 1
          break;
      }
      this.scoreboard.update(this.p1score, this.p2score, this.ties)
    } else {
      this.engine.update(action)
      console.log(action)
      this.view.render(this.engine)
    }
  }

  resetGame() {
    this.engine.reset()
    this.view.render(this.engine)
  }

  getDOMElements() {
    this.root = document.querySelector(':root')
    this.container = document.getElementById('gameview')

    // Game central container
    let center = elementBuild('div', {
      parent: this.container,
      id: 'center',
    })

    let gamecenter = elementBuild('div', {
      id: 'gamecenter',
      parent: center,
    })

    this.game = elementBuild('div', {
      parent: gamecenter,
      classList: 'game',
    })
    
    // Status
    let status = elementBuild('div', { id: 'status', parent: this.container, })
    this.statusLine = elementBuild('span',
      { id: 'statusline', parent: status, })

    this.scoreboard = new Scoreboard(this.container)

    // Buttons
    let buttons = elementBuild('div',
      { classList: 'buttons-hbox', parent: this.container, })

    this.resetButton = elementBuild('button', {
      id: 'reset',
      parent: buttons,
      attributes: { innerHTML: 'RESET', }
    })
    this.resetButton.addEventListener('click', (event) => {
      this.resetGame()
    })

    this.backButton = elementBuild('button', {
      id: 'back',
      parent: buttons,
      attributes: { innerHTML: 'BACK', }
    })
    this.backButton.addEventListener('click', (event) => {
      this.clearGame()
      this.app.openMenu()
    })

    this.updateRulesButton = elementBuild('button', {
      id: 'updateRules',
      parent: buttons,
      attributes: { innerHTML: 'UPDATE RULES', }
    })
    this.updateRulesButton.addEventListener('click', (event) => {
      let menu = this.entry.settings.buildSettingsMenu(this.app,
        (rules) => {
          this.startGame(this.entry, rules)
        }
      )
      app.addPopup(menu)
    })

    this.hardResetButton = elementBuild('button', {
      id: 'hardReset',
      parent: buttons,
      attributes: { innerHTML: 'RESET SCORES', }
    })
    this.hardResetButton.addEventListener('click', (event) => {
      this.resetGame()
      this.p1score = 0
      this.p2score = 0
      this.ties = 0
      this.scoreboard.update(this.p1score, this.p2score, this.ties)
    })
  }
}
