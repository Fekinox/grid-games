const gameEntries = [
  TeeThreeEngine.getEntry(),
  TeeFourEngine.getEntry(),
  OthelloEngine.getEntry(),
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
    let elem = elementBuild('div', {
      classList: 'gameentry',
    })

    elem.innerHTML += entry.name

    elem.addEventListener('click', (event) => {
      app.startGame(entry, entry.settings.getDefaultRules())
    })


    let desc = elementBuild('div', {
      classList: 'gamedesc',
      parent: elem,
    })

    desc.appendChild(elementBuild('hr', {}))

    desc.innerHTML += entry.description

    let settingsButton = elementBuild('button', {
      parent: desc,
      attributes: {
        innerHTML: 'Settings',
      }
    })

    settingsButton.addEventListener('click', (event) => {
      let menu = entry.settings.buildSettingsMenu(this.app, 
        (rules) => {
          this.app.startGame(entry, rules)
        }
      )
      app.addPopup(menu)
      event.stopPropagation()
      event.preventDefault()
    })

    return elem
  }
}
