class GameRunner {
  static particleCount = 30;

  constructor(app) {
    this.app = app;
    this.entry = null;
  }

  initialize() {
    this.p1score = 0;
    this.p2score = 0;
    this.ties = 0;

    this.getDOMElements();
  }

  clearGame() {
    this.game.textContent= "";
    this.entry = null;

    this.p1score = 0;
    this.p2score = 0;
    this.ties = 0;
    this.scoreboard.update(this.p1score, this.p2score, this.ties);
  }

  startGame(gameEntry, rules) {
    this.clearGame();
    this.entry = gameEntry;
    this.engine = gameEntry.run(rules);
    this.game.id = this.engine.name;
    this.engine.sendAction = (action) => this.handleAction(action);

    this.resetView();
    this.view.render(this.engine);

    this.viewport.translateX = 0;
    this.viewport.translateY = 0;
    this.viewport.update();
  }

  resetView() {
    this.game.textContent = "";
    this.view = this.engine.buildView({
      root: this.root,
      container: this.game,
      status: this.statusLine,
      center: this.viewport.center,
    });
    this.view.sendAction = (action) => this.handleAction(action);
    this.view.isTranslating = () => {
      return this.viewport.dirty;
    };
    this.viewport.gameBackground.textContent = "";
  }

  handleAction(action) {
    if (action.name === "gameOver") {
      switch(action.winner) {
      case 1:
        this.p1score += 1;
        break;
      case -1:
        this.p2score += 1;
        break;
      case 0:
        this.ties += 1;
        break;
      }
      if (action.winner !== 0) {
        this.spawnWinParticles(action.winner);
      }
      this.scoreboard.update(this.p1score, this.p2score, this.ties);
    } else {
      const updated = this.engine.update(action);
      if (updated) {
        this.view.render(this.engine);
        this.viewport.update();
      }
    }
  }

  resetGame() {
    this.engine.reset();
    this.game.textContent = "";
    this.resetView();
    this.view.render(this.engine);
    this.viewport.hardReset();
  }

  getDOMElements() {
    this.root = document.querySelector(":root");
    this.container = document.getElementById("gameview");

    // Game central container
    this.game = elementBuild("div", {
      classList: "game",
    });

    this.viewport = new Viewport(this.container, this.game);

    window.addEventListener("resize", (_event) => {
      this.viewport.updateViewportSize();
      this.viewport.update();
    });
    
    // Status
    let status = elementBuild("div", { id: "status", parent: this.container, });
    this.statusLine = elementBuild("span",
      { id: "statusline", parent: status, });

    this.scoreboard = new Scoreboard(this.container);

    // Buttons
    let buttons = elementBuild("div",
      { classList: "buttons-hbox", parent: this.container, });

    this.resetButton = elementBuild("button", {
      id: "reset",
      parent: buttons,
      attributes: { innerHTML: "RESET", }
    });
    this.resetButton.addEventListener("click", (_event) => {
      this.resetGame();
    });

    this.backButton = elementBuild("button", {
      id: "back",
      parent: buttons,
      attributes: { innerHTML: "BACK", }
    });
    this.backButton.addEventListener("click", (_event) => {
      this.clearGame();
      this.app.openMenu();
    });

    this.updateRulesButton = elementBuild("button", {
      id: "updateRules",
      parent: buttons,
      attributes: { innerHTML: "UPDATE RULES", }
    });
    this.updateRulesButton.addEventListener("click", (_event) => {
      let menu = this.entry.settings.buildSettingsMenu(this.app,
        (rules) => {
          this.startGame(this.entry, rules);
        }
      );
      app.addPopup(menu);
    });

    this.hardResetButton = elementBuild("button", {
      id: "hardReset",
      parent: buttons,
      attributes: { innerHTML: "RESET SCORES", }
    });
    this.hardResetButton.addEventListener("click", (_event) => {
      this.resetGame();
      this.p1score = 0;
      this.p2score = 0;
      this.ties = 0;
      this.scoreboard.update(this.p1score, this.p2score, this.ties);
    });
  }

  spawnWinParticles(winner) {
    this.viewport.gameBackground.textContent = "";
    const width = this.viewport.gameBackground.clientWidth;
    const height = this.viewport.gameBackground.clientHeight;
    const color =
      (winner === 1)
        ? "var(--player1-color)"
        : "var(--player2-color)";

    let animations = [];

    for (let i = 0; i < GameRunner.particleCount; i++) {
      const opacity = Math.random();
      const initAngle = Math.random();
      const finalAngle = 1 + initAngle;
      const finalX = (Math.random() - 0.5) * 2 * width;
      const finalY = (Math.random() - 0.5) * 2 * height;
      const scale = Math.random() * 0.5 + 0.5;
      const delay = i * 10;

      let particle = elementBuild("div", {
        classList: "winparticle",
        parent: this.viewport.gameBackground,
      });
      particle.style.backgroundColor = color;

      const anim1 = particle.animate([
        {
          rotate: `${initAngle}turn`,
          translate: "0px 0px",
          opacity: `${opacity}`,
        },
        {
          rotate: `${finalAngle}turn`,
          translate: `${finalX}px ${finalY}px`,
          opacity: 0,
        },
      ], {
        duration: 1000,
        delay: delay,
        fill: "both",
      });

      const anim2 = particle.animate([
        { scale: 0, },
        { scale: scale, offset: 0.2, },
        { scale: 0, }
      ], {
        duration: 1000,
        delay: delay,
        fill: "both",
      });

      animations.push(anim1.finished);
      animations.push(anim2.finished);
    }

    Promise.all(animations).then(() => {
      this.viewport.gameBackground.textContent = "";
    });
  }
}
