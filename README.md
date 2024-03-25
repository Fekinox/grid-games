# Grid Games

[![Netlify Status](https://api.netlify.com/api/v1/badges/0c21a3ac-0377-457d-9af7-5b00c2be33de/deploy-status)](https://app.netlify.com/sites/fekinox-grid-games/deploys)

![Vercel](https://vercelbadge.vercel.app/api/Fekinox/tic-tac-toe-tic)

![mainscreen](https://images2.imgbox.com/38/e2/dcM0Nvkn_o.png)

A collection of 3 two-player games.

* Tic Tac Toe: Start on a 3 x 3 grid by default. Get 3 in a row to win.
![ttt](https://images2.imgbox.com/4a/73/5yCeMDuQ_o.png)
* Tic Tac Toe Tic: A variant of Tic Tac Toe designed by a friend of mine. By default, it has the same rules as Tic Tac Toe, but you start on a 4 x 4 grid and must get 4 in a row to win. On your turn, you may either place a piece of your color, or expand the board by adding a row or column to the edge.
![tttt](https://images2.imgbox.com/18/f4/mK1YLWWi_o.png)
* othello: A variant of the game Reversi with a special initial board configuration. Players take turns conquering pieces of the opposing player- pieces must be placed such that there is a straight line of opponent tiles connecting that piece to another piece of the same player's color.
![othello](https://images2.imgbox.com/e2/f4/HA44yV3w_o.png)

The application also comes with additional functionality:
* Dynamic scaling to keep the game window a reasonable size, and the ability to scroll the board if it gets too large
* Ability to configure the game settings
* Can make one or both players an AI (which for now, just performs random moves)

## Rules

* You start with a 4 by 4 grid and must get 4 in a row to win.
* On your turn, you may either place a piece of your color or expand the board in any direction. These board expansions will add a new row or new column to the board.

## Building

* Install all project dependencies with `npm install`.
* Compile all Javascript files with `npm run build`. Add `-- --verbose` for detailed output.
* All frontend files (HTML page, CSS file, and compiled Javascript) will be placed in the `public` directory.
* To automatically refresh the files in the `public` directory on update, run `npm run build -- watch`.
