// FIXME: Othello is extremely inefficient when the board gets really full.

class OthelloEngine {
  constructor(rules) {
    this.width = rules.width;
    this.height = rules.height;
    this.misere = rules.misere;
    this.name = "othello";

    this.reset();
  }

  static getEntry() {
    return {
      name: "Othello",
      description: "Cover as much of the game board as possible.",
      settings: new GameRules([
        new GameRuleEntry({
          name: "width",
          desc: "Board Width",
          type: {
            name: "integer",
            lowerBound: 6,
          },
          default: 8,
        }),
        new GameRuleEntry({
          name: "height",
          desc: "Board Height",
          type: {
            name: "integer",
            lowerBound: 6,
          },
          default: 8,
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
      run: (rules) => new OthelloEngine(rules),
    };
  }

  // Resets all game parameters.
  reset() {
    this.grid = new Grid(this.width, this.height);
    this.turn = 1;
    this.outcome = null;

    this.lastAction = null;

    // In Othello, set center of board to
    // 0 1
    // 1 0
    let centerX = Math.floor(this.width/2)-1;
    let centerY = Math.floor(this.width/2)-1;
    this.grid.set(centerX, centerY, -1);
    this.grid.set(centerX+1, centerY+1, -1);
    this.grid.set(centerX, centerY+1, 1);
    this.grid.set(centerX+1, centerY, 1);

    this.currentPlayerLegalMoves = new Grid(this.grid.width, this.grid.height);
    this.setCurrentPlayerLegalMoves();

  }

  matchesAt(x, y, player) {
    // (x, y) is a legal move if
    return Grid.allDirections.map((dir) => {
      const line = this.grid.lineQuery(x, y, dir.x, dir.y);
      let res = {
        toRemove: []
      };
      for (let i = 1; i < line.length; i++) {
        if (line[i].elem === -player) { 
          res.toRemove.push({x: line[i].x, y: line[i].y});
        }
        else if (line[i].elem === player) {
          res.darkPosition = {x: line[i].x, y: line[i].y};
          return res;
        } else {
          return null;
        }
      }
      return null;
    }).filter((l) => l !== null && l.toRemove.length > 0);
  }

  getLegalMoves() {
    let moves = [];
    if (!this.hasLegalMoves) { return []; }
    
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.currentPlayerLegalMoves.get(x, y).length > 0) {
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

  setCurrentPlayerLegalMoves() {
    this.hasLegalMoves = false;
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.get(x, y) !== null) {
          this.currentPlayerLegalMoves.set(x, y, []);
          continue;
        }
        let moves = this.matchesAt(x, y, this.turn);
        if (moves.length !== 0) {
          this.hasLegalMoves = true;
        }
        this.currentPlayerLegalMoves.set(x, y,
          moves);
      }
    }
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

  // The game will end if one of two conditions hold:
  // - The board consists of only empty spaces and one player's color
  // - There are no legal moves either player can make
  checkWin() {
    // Count up the number of player 1 tiles, then the number of player 2 tiles.
    // If they are equal, it is a tie game.
    let player1Tiles = [];
    let player2Tiles = [];
    let legalMoves = 0;

    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        // Game is not over if a legal move can be made
        if (this.grid.get(x, y) === null &&
          (this.matchesAt(x, y, this.turn) ||
           this.matchesAt(x, y, -this.turn))) {
          legalMoves += 1;
        }
        else if (this.grid.get(x, y) === 1) {
          player1Tiles.push({ x: x, y: y });
        } else if (this.grid.get(x, y) === -1) {
          player2Tiles.push({ x: x, y: y });
        }
      }
    }

    if (player1Tiles.length === 0) {
      return {
        player: -1,
        tiles: player2Tiles
      };
    } else if (player2Tiles.length === 0) {
      return {
        player: 1,
        tiles: player1Tiles
      };
    } else if (legalMoves === 0) {
      if (player1Tiles.length > player2Tiles.length) { 
        return {
          player: 1,
          tiles: player1Tiles
        };
      } else if (player1Tiles.length < player2Tiles.length) { 
        return {
          player: -1,
          tiles: player2Tiles
        };
      } else {
        return {
          player: 0,
          tiles: []
        };
      }
    }

    return null;
  }
  

  makeMove(x, y) {
    const lines = this.matchesAt(x, y, this.turn);
    if (this.grid.get(x, y) !== null ||
      this.outcome !== null ||
      lines.length === 0) { return false; }
    
    this.grid.set(x, y, this.turn);
    lines.forEach((line) => {
      line.toRemove.forEach((position) => {
        this.grid.set(position.x, position.y, this.turn);
      });
    });

    const win = this.checkWin();
    if (win !== null) {
      this.outcome = win;
    } else {
      this.turn *= -1;
      this.setCurrentPlayerLegalMoves();
    }

    return true;
  }

  buildView(domElems) {
    return new OthelloView(domElems, this);
  }
}

class OthelloView {
  constructor(domElems, engine) {
    this.rootElement = domElems.root;
    this.gameContainer = domElems.container;
    this.status = domElems.status;
    this.center = domElems.center;
    this.enabled = true;

    this.hboxesEnabled = true;

    this.internalGrid = engine.grid.clone();
    this.legalMoves = engine.currentPlayerLegalMoves;

    this.gridView = new GridView(this.gameContainer);

    this.gridView.buildNewGrid(engine.grid.width, engine.grid.height);

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
          const dist = Math.max(Math.abs(x - engine.lastAction.x),
            Math.abs(y - engine.lastAction.y));
          return dist;
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
        const isLegal = engine.currentPlayerLegalMoves.get(x, y).length !== 0;
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

        // Add flipping animation
        if (entry !== oldEntry) {
          if (oldEntry !== null) {
            this.gridView.animate(x, y, "invert", {
              delay: Math.max(0, 50 * (delay(x, y) + 2))
            });
            this.gridView.animate(x, y, "bounceIn", {
              delay: Math.max(0, 50 * (delay(x, y) + 2))
            });
            this.gridView.updateHoverboxAt(x, y, false);
          } else {
            this.gridView.animate(x, y, "newCell");
          }
        }

        if (isTied) {
          this.gridView.animate(x, y, "tieWiggle", {
            delay: delay(x, y),
          });
        }

        if (entry === 1) {
          newClassList += `${winPrefix}red bx bx-x`;
        } else if (entry === -1) {
          newClassList += `${winPrefix}blue bx bx-radio-circle`;
        } else if (!engine.outcome && isLegal) {
          newClassList += "hoverable legalmove";
        }

        this.gridView.update(x, y, newClassList);
        this.internalGrid.set(x, y, entry);
      }
    }

    let hover = "";
    if (engine.outcome && engine.outcome.player !== undefined) {
      hover = "var(--bg-2)";
    } else if (engine.turn === 1) {
      hover = "var(--player1-color)";
    } else {
      hover = "var(--player2-color)";
    }
    this.rootElement.style.setProperty("--hover-color", hover);
    
    this.renderStatus(engine);
  }

  handleHover(pos) {
    let swapTiles = [];
    let delay = null;
    let checker = null;

    if (pos !== null) {
      const swaps = this.legalMoves.get(pos.x, pos.y);

      swaps.forEach((swap) => {
        swap.toRemove.forEach((tile) => {
          if (!swapTiles.some((p) => 
            p.x === tile.x && p.y === tile.y
          )) {
            swapTiles.push(tile);
          }
        });
      });

      delay = (x, y) => {
        const dist = Math.max(Math.abs(x - pos.x),
          Math.abs(y - pos.y));
        return Math.max(0, 50 * (dist - 1));
      };

      checker = (x, y) => swapTiles.some((p) => 
        p.x === x && p.y === y
      );
    }

    this.gridView.updateHoverboxes(checker, delay);
  }
  
  // Renders the current game status line beneath the grid.
  renderStatus(engine) {
    if (!engine.hasLegalMoves && engine.outcome === null) {
      this.status.innerHTML =
        `${this.inlineIndicator(engine.turn)} HAS NO LEGAL MOVES, PASS.`;
      this.status.className = "";
    } else if (engine.outcome === null) {
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
