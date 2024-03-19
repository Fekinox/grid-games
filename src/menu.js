const gameEntries = [
  {
    name: "Tic Tac Toe",
    description: "3 by 3 board. Get 3 in a row to win.",
    settings: new GameRules([
      new GameRuleEntry({
        name: "width",
        desc: "Board Width",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "height",
        desc: "Board Height",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "toWin",
        desc: "Tiles to win",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "misere",
        desc: "Misere rules",
        type: {
          name: 'boolean',
        },
        default: 3,
      }),
    ]),
    run: function(rules) {
      TeeThreeEngine(rules)
    }
  },
  {
    name: "Tic Tac Toe",
    description: "3 by 3 board. Get 3 in a row to win.",
    settings: new GameRules([
      new GameRuleEntry({
        name: "width",
        desc: "Board Width",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "height",
        desc: "Board Height",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "toWin",
        desc: "Tiles to win",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "misere",
        desc: "Misere rules",
        type: {
          name: 'boolean',
        },
        default: 3,
      }),
    ]),
    run: function(rules) {
      TeeThreeEngine(rules)
    }
  },
  {
    name: "Tic Tac Toe",
    description: "3 by 3 board. Get 3 in a row to win.",
    settings: new GameRules([
      new GameRuleEntry({
        name: "width",
        desc: "Board Width",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "height",
        desc: "Board Height",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "toWin",
        desc: "Tiles to win",
        type: {
          name: 'integer',
          lowerBound: 2,
        },
        default: 3,
      }),
      new GameRuleEntry({
        name: "misere",
        desc: "Misere rules",
        type: {
          name: 'boolean',
        },
        default: 3,
      }),
    ]),
    run: function(rules) {
      TeeThreeEngine(rules)
    }
  },
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
