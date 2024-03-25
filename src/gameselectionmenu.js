class GameSelectionMenu {
  constructor(parent) {
    this.loadedEntry = null;
    this.currentRules = null;

    this.ongamestart = (_entry, _rules, _p1mode, _p2mode) => {};

    this.settingsMenu = null;

    this.container = elementBuild("div", {
      id: "gameselection", parent: parent,
    });

    this.gameName = elementBuild("h1", {
      parent: this.container,
    });

    this.gameName.textContent = "Tic Tac Toe";

    this.gameDescription = elementBuild("section", {
      parent: this.container,
    });

    this.buttonHbox = elementBuild("div", {
      classList: "buttons-hbox", parent: this.container
    });

    elementBuild("i", {
      classList: "red bx bx-x", parent: this.buttonHbox
    });

    this.player1ModeSelect = elementBuild("select", {
      parent: this.buttonHbox,
    });

    this.player2ModeSelect = elementBuild("select", {
      parent: this.buttonHbox,
    });

    elementBuild("i", {
      classList: "blue bx bx-radio-circle", parent: this.buttonHbox
    });

    this.menuSection = elementBuild("section", {
      parent: this.container, id: "settings"
    });
  }

  loadEntry(entry) {
    this.loadedEntry = entry;
    this.currentRules = entry.settings.getDefaultRules();
    this.gameName.textContent = entry.name,

    this.gameDescription.innerHTML = "";
    entry.longDescription.forEach((sentence) => {
      elementBuild("p", {
        parent: this.gameDescription, attributes: {
          textContent: sentence,
        }
      });
    });

    this.player1ModeSelect.innerHTML = "";
    this.player2ModeSelect.innerHTML = "";

    this.aiOptions = {};
    this.aiOptions["player"] = () => null;

    elementBuild("option", {
      parent: this.player1ModeSelect, attributes: {
        value: "player",
        textContent: "Player",
      }
    });
    elementBuild("option", {
      parent: this.player2ModeSelect, attributes: {
        value: "player",
        textContent: "Player",
      }
    });

    entry.ai.forEach((aiMode) => {
      elementBuild("option", {
        parent: this.player1ModeSelect, attributes: {
          value: aiMode.name,
          textContent: aiMode.longName,
        },
      });
      elementBuild("option", {
        parent: this.player2ModeSelect, attributes: {
          value: aiMode.name,
          textContent: aiMode.longName,
        },
      });
      this.aiOptions[aiMode.name] = aiMode.builder;
    });

    this.menuSection.textContent = "";
    this.menuSection.appendChild(
      this.loadedEntry.settings.buildSettingsMenu((rules) => {
        const entry = this.loadedEntry;

        const p1mode = this.aiOptions[this.player1ModeSelect.value];
        const p2mode = this.aiOptions[this.player2ModeSelect.value];
        console.log(p1mode);
        console.log(p2mode);

        this.ongamestart(entry, rules, p1mode, p2mode);
      })
    );
  }
}
