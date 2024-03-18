class GameRunner {
  startGame(engine) {
    this.buildView()
    this.engine = engine
    this.view = engine.buildView({
      root: this.root,
      container: this.game,
      status: this.statusLine,
    })

    this.view.sendAction = (action) => this.handleAction(action)
    this.view.render(this.engine)
  }

  handleAction(action) {
    if (action.name === 'reset' || action === 'reset') {
      this.resetGame()
    } else {
      this.engine.update(action)
      this.view.render(this.engine)
    }
  }

  resetGame() {
    this.engine.reset()
    this.view.render(this.engine)
  }

  buildView() {
    this.root = document.querySelector(':root')
    let container = document.getElementById('container')
    // Game central container
    let center = document.createElement('div')
    center.id = 'center'
    container.appendChild(center)

    let gamecenter = document.createElement('div')
    gamecenter.id = 'gamecenter'
    center.appendChild(gamecenter)

    this.game = document.createElement('div')
    this.game.id = 'game'
    gamecenter.appendChild(this.game)
    
    // Status
    let status = document.createElement('div')
    this.statusLine = document.createElement('span')
    status.id = 'tttstatus'
    this.statusLine.id = 'statusline'
    status.appendChild(this.statusLine)
    container.appendChild(status)

    // Buttons
    let buttons = document.createElement('section')
    buttons.id = 'buttons'
    container.appendChild(buttons)

    this.resetButton = document.createElement('button')
    this.resetButton.id = 'reset'
    this.resetButton.innerHTML = 'RESET'
    this.resetButton.addEventListener('click', (event) => {
      this.resetGame()
    })

    buttons.appendChild(this.resetButton)
  }
}
