const start = Date.now();

class GameRunner {
  static particleCount = 30;

  constructor(app) {
    this.app = app;
    this.entry = null;

    this.player1 = null;
    this.player2 = null;

    this.enabled = false;
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

  startGame(gameEntry, rules, p1mode, p2mode) {
    this.clearGame();
    this.player1Builder = p1mode;
    this.player2Builder = p2mode;
    this.player1 = (p1mode !== null) ? p1mode(1) : null;
    this.player2 = (p2mode !== null) ? p2mode(-1) : null;
    this.entry = gameEntry;
    this.rules = rules;
    this.engine = gameEntry.run(this.rules);
    this.game.id = this.engine.name;

    // Javascript doesn't have cancellation tokens so I have to do this
    // hackiness.
    // Associate each game with a magic cookie that's created from the time
    // since the session began, and only respond to requests that use that
    // magic cookie.
    this.gameID = Date.now() - start;

    // Additionally, have a flag set that indicates if the game's ready to
    // accept actions. This will be set to false once the player goes back, so
    // it won't run any additional actions in the background.
    this.enabled = true;

    // Need to do this to prevent the callback from referencing this.gameID
    // instead of the one created at game start.
    const g = this.gameID;
    this.engine.sendAction = (action) => this.handleAction(action, g);

    this.resetView();
    this.view.render(this.engine);

    this.viewport.translateX = 0;
    this.viewport.translateY = 0;
    this.viewport.update();

    this.getNextMove();
  }

  getNextMove() {
    console.log(`Getting next move for ${this.engine.turn}`);
    let player =
      (this.engine.turn === 1)
        ? this.player1
        : this.player2;

    // If a player has no legal moves, but the game isn't over, then
    // automatically pass and change players.
    if (this.engine.getLegalMoves().length === 0 && engine.outcome !== null) {
      setTimeout(() => {
        const g = this.gameID;
        this.handleAction({ name: "pass", }, g);
      }, 1000);
    }
    // If player is an AI, disable the UI and get the next move from the AI
    else if (player !== null) {
      this.view.enabled = false;
      const g = this.gameID;
      setTimeout(() => {
        this.handleAction(player.nextMove(this.engine), g);
      }, 1000);
    }
    else {
    // If player is not an AI, enable the UI and get the next move from the
    // player
      this.view.enabled = true;
    }
  }

  resetView() {
    this.game.textContent = "";
    this.view = this.engine.buildView({
      root: this.root,
      container: this.game,
      status: this.statusLine,
      center: this.viewport.center,
    }, this.gameNumber);
    const g = this.gameID;
    this.view.sendAction = (action) => this.handleAction(action, g);
    this.view.isTranslating = () => {
      return this.viewport.dirty;
    };
    this.viewport.gameBackground.textContent = "";
  }

  handleAction(action, number) {
    if (number !== this.gameID || !this.enabled) {
      return;
    }

    console.log(action);
    const updated = this.engine.update(action);
    if (updated) {
      this.view.render(this.engine);
      this.viewport.update();
    }

    if (this.engine.outcome === null) {
      this.getNextMove();
    } else {
      let outcome = this.engine.outcome;
      switch(outcome.player) {
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
      if (outcome.player !== 0) {
        this.spawnWinParticles(outcome.player);
      }
      this.scoreboard.update(this.p1score, this.p2score, this.ties);
    }
  }

  resetGame() {
    this.engine.reset();
    this.gameID = Date.now() - start;
    const g = this.gameID;
    this.engine.sendAction = (action) => this.handleAction(action, g);
    this.game.textContent = "";
    this.resetView();
    this.view.render(this.engine);
    this.viewport.hardReset();
    this.getNextMove();
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
      this.enabled = false;
      this.clearGame();
      this.app.openMenu();
    });

    this.updateRulesButton = elementBuild("button", {
      id: "updateRules",
      parent: buttons,
      attributes: { innerHTML: "UPDATE RULES", }
    });
    this.updateRulesButton.addEventListener("click", (_event) => {
      let menu = this.entry.settings.buildSettingsPopup(this.app,
        (rules) => {
          this.startGame(this.entry, rules,
            this.player1Builder, this.player2Builder);
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
