const gameEntries = [
  TeeThreeEngine.getEntry(),
  TeeFourEngine.getEntry(),
  OthelloEngine.getEntry(),
];

class Menu {
  constructor(app) {
    this.app = app;

    this.selectedGame = null;
    this.player1Mode = null;
    this.player2Mode = null;
  }

  initialize(entries) {
    this.getDOMElements();

    // Add credits button
    this.creditsButtonBox = elementBuild("div", {
      classList: "buttons-hbox", parent: this.menuWindow,
    });

    this.creditsButton = elementBuild("button", {
      parent: this.creditsButtonBox, attributes: {
        textContent: "CREDITS",
      }
    });

    this.creditsButton.addEventListener("click", (_event) => {
      const credits = elementBuild("div", {
        classList: "popup",
      });

      elementBuild("p", {
        parent: credits, attributes: {
          textContent: "a game written by Will Fowlkes"
        }
      });

      elementBuild("a", {
        parent: credits, classList: "bx bxl-github", attributes: {
          href: "https://github.com/Fekinox/grid-games",
          target: "_blank",
        }
      });

      credits.addEventListener("click", (_event) => app.clearPopup());
      this.app.addPopup(credits);
    });

    // Build selected game menu
    this.gameSelectionMenu = new GameSelectionMenu(this.menuWindow);

    this.gameSelectionMenu.ongamestart = this.startGame;

    this.gameSelect = elementBuild("section", {
      id: "gameselect", parent: this.menuWindow
    });

    entries.forEach((entry, i) => {
      let elem = this.buildGameEntry(entry, i);
      this.gameSelect.appendChild(elem);
    });

    this.selectGame(0);
  }

  getDOMElements() {
    this.menuWindow = document.getElementById("gamemenu");
  }

  selectGame(i) {
    this.gameSelectionMenu.loadEntry(gameEntries[i]);
    this.gameSelect.childNodes.forEach((node, j) => {
      if (i == j) { node.classList.add("selected"); }
      else { node.classList.remove("selected"); }
    });
  }

  startGame(entry, rules, p1mode, p2mode) {
    app.startGame(entry, rules, p1mode, p2mode);
  }

  buildGameEntry(entry, i) {
    let elem = elementBuild("div", {
      classList: "gameentry"
    });

    elem.innerHTML += entry.name;

    elem.addEventListener("click", (_event) => {
      this.selectGame(i);
    });

    return elem;
  }
}
