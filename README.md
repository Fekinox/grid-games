# Tic Tac Toe Tic

[![Netlify Status](https://api.netlify.com/api/v1/badges/0c21a3ac-0377-457d-9af7-5b00c2be33de/deploy-status)](https://app.netlify.com/sites/fekinox-grid-games/deploys)

![Vercel](https://vercelbadge.vercel.app/api/Fekinox/tic-tac-toe-tic)

A variant of Tic Tac Toe implemented by Will Fowlkes, and designed by a friend of his.

## Rules

* You start with a 4 by 4 grid and must get 4 in a row to win.
* On your turn, you may either place a piece of your color or expand the board in any direction. These board expansions will add a new row or new column to the board.

## Building

* Install all project dependencies with `npm install`.
* Compile all Javascript files with `npm run build`. Add `-- --verbose` for detailed output.
* All frontend files (HTML page, CSS file, and compiled Javascript) will be placed in the `public` directory.
* To automatically refresh the files in the `public` directory on update, run `npm run build -- watch`.
