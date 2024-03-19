const gameEntries = [
  TeeThreeEngine.getEntry(),
  TeeFourEngine.getEntry(),
  TeeThreeEngine.getEntry(),
]

class Menu {
  initialize(entries) {
    this.getDOMElements()
    entries.forEach((entry) => {
      let elem = this.buildGameEntry(entry)
      this.gameSelect.appendChild(elem)
    })
  }

  getDOMElements() {
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

    return elem
  }
}
