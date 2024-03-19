const gameEntries = [
  TeeThreeEngine.getEntry(),
  TeeFourEngine.getEntry(),
]

class Menu {
  constructor(app) {
    this.app = app
  }

  initialize(entries) {
    this.getDOMElements()
    entries.forEach((entry) => {
      let elem = this.buildGameEntry(entry)
      this.gameSelect.appendChild(elem)
    })
  }

  getDOMElements() {
    this.menuWindow = document.getElementById('gamemenu')
    this.gameSelect = document.getElementById('gameselect')
    this.globalSettingsButton = document.getElementById('globalsettings')
  }

  buildGameEntry(entry) {
    let elem = document.createElement('div')
    elem.classList.add('gameentry')

    elem.innerHTML += entry.name

    let desc = document.createElement('div')
    desc.classList.add('gamedesc')
    elem.appendChild(desc)

    desc.innerHTML += entry.description

    let settingsButton = document.createElement('button')
    settingsButton.innerHTML = 'Settings'
    desc.appendChild(settingsButton)

    elem.addEventListener('click', (event) => {
      app.startGame(entry.run, entry.settings.getDefaultRules())
    })

    return elem
  }
}
