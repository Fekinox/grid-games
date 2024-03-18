class GameRunner {
  startGame(engine) {
    this.engine = engine
    this.view = engine.buildView({
      root: document.querySelector(':root'),
      container: document.getElementById('game'),
      status: document.getElementById('tttstatus'),
    })
    this.view.sendAction = (action) => this.handleAction(action)
    this.view.render(this.engine)

    this.resetButton = document.querySelector('button#reset')
    this.resetButton.addEventListener('click', (event) => {
      this.handleAction('reset')
    })
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
}
