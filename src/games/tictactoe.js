class TeeThreeEngine {
  constructor(rules) {
    this.width = rules.width;
    this.height = rules.height;
    this.toWin = rules.toWin;
    this.misere = rules.misere;
    this.name = "teethree";

    this.reset();
  }

  // Resets all game parameters.
  reset() {
    this.grid = new Grid(this.width, this.height);
    this.turn = 1;
    this.outcome = null;

    this.lastAction = null;
    this.potentialWins = new Grid(this.grid.width, this.grid.height, () => []);
  }

  static getEntry() {
    return {
      name: "Tic Tac Toe",
      description: "3 by 3 board. Get 3 in a row to win.",
      longDescription: [
        "Get 3 in a row to win.",
      ],
      settings: new GameRules([
        new GameRuleEntry({
          name: "width",
          desc: "Board Width",
          type: {
            name: "integer",
            lowerBound: 2,
          },
          default: 3,
        }),
        new GameRuleEntry({
          name: "height",
          desc: "Board Height",
          type: {
            name: "integer",
            lowerBound: 2,
          },
          default: 3,
        }),
        new GameRuleEntry({
          name: "toWin",
          desc: "Tiles to win",
          type: {
            name: "integer",
            lowerBound: 2,
          },
          default: 3,
        }),
        new GameRuleEntry({
          name: "misere",
          desc: "Misere rules",
          type: {
            name: "boolean",
          },
          default: false,
        }),
      ]),
      ai: [
        {
          name: "random",
          longName: "Random Move",
          builder: (player) => new RandomLegalMove(player),
        },
      ],
      run: (rules) => new TeeThreeEngine(rules),
    };
  }

  update(action) {
    this.lastAction = action;
    switch(action.name) {
    case "move":
      return this.makeMove(action.x, action.y);
    case "pass":
      this.turn *= -1;
      this.setCurrentPlayerLegalMoves();
      return true;
    }
  }


  makeMove(x, y) {
    if (this.grid.get(x, y) !== null || this.outcome !== null) { return false; }
    
    this.grid.set(x, y, this.turn);
    
    const win = this.checkWin(this.turn);
    if (win !== null) {
      this.outcome = win;
    } else if (this.grid.grid.every((elem) => elem !== null)) {
      this.outcome = {
        player: 0,
        tiles: []
      };
    } else {
      this.turn *= -1;
    }

    if (this.outcome === null) {
      this.updatePotentialWins(this.turn);
    }

    return true;
  }

  // Check for all possible wins and return the first win.
  checkWin(player) {
    let wins = this.grid.allKInARows(this.toWin, player);
    let tiles = [];
    wins.forEach((win) => {
      win.forEach((tile) => {
        if (!tiles.some((p) => {
          return p.x === tile.x && p.y === tile.y;
        })) {
          tiles.push(tile);
        }
      });
    });

    return (wins.length !== 0)
      ? {
        player: (!this.misere) ? this.turn : -this.turn,
        tiles: tiles,
      }
      : null;
  }

  getLegalMoves() {
    let moves = [];
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.get(x, y) === null) {
          moves.push({
            name: "move",
            x: x,
            y: y,
          });
        }
      }
    }
    return moves;
  }
  
  // Update the potentialWins grid for potential winning moves for the current
  // player
  updatePotentialWins(player) {
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.get(x, y) !== null) {
          this.potentialWins.set(x, y, []);
          continue;
        }
        let wins = Grid.forwardDirections.map((dir) => {
          // Get straight lines from the current cell position, offset
          // by one in both directions
          let forwardQuery = this.grid.lineQuery(
            x + dir.x, y + dir.y, dir.x, dir.y);
          let backwardQuery = this.grid.lineQuery(
            x - dir.x, y - dir.y, -dir.x, -dir.y);

          // Find the number of steps we have to walk in a certain direction
          // to reach a cell that isn't the current player's color
          let forwardFirstNonEqual =
            forwardQuery.findIndex((elem) => elem.elem !== player);
          let backwardFirstNonEqual =
            backwardQuery.findIndex((elem) => elem.elem !== player);
          // If one of them is negative 1, that means that all the cells are
          // the current player's color until they hit the end of the line.
          if (forwardFirstNonEqual === -1) { 
            forwardFirstNonEqual = forwardQuery.length;
          }
          if (backwardFirstNonEqual === -1) { 
            backwardFirstNonEqual = backwardQuery.length;
          }

          // This will produce a win if
          // 1 + forFirstNonE + backFirstNonE >= toWin.
          if (1 + forwardFirstNonEqual + backwardFirstNonEqual >= this.toWin) {
            return [
              ...forwardQuery.slice(0, forwardFirstNonEqual),
              ...backwardQuery.slice(0, backwardFirstNonEqual),
            ];
          } else {
            return null;
          }
        })
          .filter((win) => win !== null);
        this.potentialWins.set(x, y, wins);
      }
    }
  }

  buildView(domElems) {
    return new TeeThreeView(domElems, this);
  }
}

class TeeThreeView {
  constructor(domElems, engine) {
    this.rootElement = domElems.root;
    this.gameContainer = domElems.container;
    this.status = domElems.status;
    this.center = domElems.center;
    this.enabled = true;

    this.hboxesEnabled = true;

    this.internalGrid = engine.grid.clone();
    this.potWins = engine.potentialWins;

    this.gridView = new GridView(this.gameContainer);

    this.gridView.buildNewGrid(engine.grid.width, engine.grid.height,
      (x, y, cell) => {
        cell.cell.classList.add("hoverable");
      }
    );

    this.gridView.onclick = (pos) => {
      if (this.isTranslating() || !this.enabled) { return; }
      this.sendAction({
        name: "move",
        x: pos.x,
        y: pos.y,
      });
    };

    this.gridView.onhover = (pos) => {
      if (this.isTranslating() || !this.hboxesEnabled || !this.enabled) {
        return;
      }
      this.handleHover(pos);
    
    };
  }

  // Updates the view with the current game state.
  render(engine) {
    let delay = (_x, _y) => 0;
    if (engine.lastAction !== null) {
      switch (engine.lastAction.name) {
      case "move":
        delay = (x, y) => {
          const dist = Math.abs(x - engine.lastAction.x) +
              Math.abs(y - engine.lastAction.y);
          return 50 * dist;
        };
        break;
      }
    }

    if (engine.outcome === null) {
      this.center.classList.remove("game-complete");
    } else {
      this.hboxesEnabled = false;
      this.gridView.clearHoverboxes();
      this.center.classList.add("game-complete");
      if (engine.outcome.player === 1) {
        this.center.style.outlineColor = "var(--player1-color)";
      } else if (engine.outcome.player === -1) {
        this.center.style.outlineColor = "var(--player2-color)";
      } else {
        this.center.style.outlineColor = "var(--bg-5)";
      }
    }

    const isTied = (engine.outcome !== null && engine.outcome.player === 0);

    for (let y = 0; y < engine.grid.height; y++) {
      for (let x = 0; x < engine.grid.width; x++) {
        const entry = engine.grid.get(x, y);
        const oldEntry = this.internalGrid.get(x, y);
        let newClassList = "";

        let winPrefix = "";
        if (engine.outcome &&
          engine.outcome.tiles.some((p) =>
            p.x === x && p.y === y)
        ) {
          winPrefix = "win-";
          this.gridView.animate(x, y, "winSpin", {
            delay: delay(x, y),
          });
          this.gridView.animate(x, y, "bounceIn", {
            delay: delay(x, y),
          });
        }

        if (isTied) {
          this.gridView.animate(x, y, "tieWiggle", {
            delay: delay(x, y),
          });
        }

        if (entry !== oldEntry) {
          this.gridView.animate(x, y, "newCell");
        }

        if (entry === 1) {
          newClassList += `${winPrefix}red bx bx-x`;
        } else if (entry === -1) {
          newClassList += `${winPrefix}blue bx bx-radio-circle`;
        } else if (!engine.outcome) {
          newClassList += "hoverable";
        }

        this.gridView.update(x, y, newClassList);
        this.internalGrid.set(x, y, entry);
      }
    }

    let hover = "";
    if (engine.outcome && engine.outcome.player !== undefined) {
      hover = "var(--background-color)";
    } else if (engine.turn === 1) {
      hover = "var(--player1-color)";
    } else {
      hover = "var(--player2-color)";
    }
    this.rootElement.style.setProperty("--hover-color", hover);
    
    this.renderStatus(engine);
  }

  handleHover(pos) {
    let winningTiles = [];
    let checker = null;
    let delay = null;

    if (pos !== null) {
      const wins = this.potWins.get(pos.x, pos.y);

      wins.forEach((win) => {
        win.forEach((tile) => {
          if (!winningTiles.some((p) => 
            p.x === tile.x && p.y === tile.y
          )) {
            winningTiles.push(tile);
          }
        });
      });

      delay = (x, y) => {
        const dist = Math.max(Math.abs(x - pos.x),
          Math.abs(y - pos.y));
        return 50 * dist;
      };

      checker = (x, y) => winningTiles.some((p) =>
        p.x === x && p.y === y
      );
    }

    this.gridView.updateHoverboxes(checker, delay);
  }
  
  // Renders the current game status line beneath the grid.
  renderStatus(engine) {
    if (engine.outcome === null) {
      this.status.innerHTML =
        `${this.inlineIndicator(engine.turn)} TO MOVE`;
      this.status.className = "";
    } else {
      if (engine.outcome.player === 0) {
        this.status.innerHTML = "TIE";
        this.status.className = "tie";
      } else {
        this.status.innerHTML =
          `${this.inlineIndicator(engine.outcome.player)} WIN`;
        const colorTag =
          (engine.outcome.player === 1)
            ? "red"
            : "blue";
        this.status.className = `win-${colorTag}`;
      }
    }
  }

  inlineIndicator(color) {
    if (color === 1) {
      return "<i class='red bx bx-x'></i>";
    } else {
      return "<i class='blue bx bx-radio-circle'></i>";
    }
  }
}
