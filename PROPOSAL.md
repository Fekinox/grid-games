# Grid-based Board Games

## Project Choice

Tic Tac Toe Tic (and other grid-based 2-player games)

## Project Description 

For my project, I plan on developing a site (currently unnamed) in which players can play a variety of 2-player board games which use a grid. The current app that I have implemented so far is Tic Tac Toe Tic, a variant of Tic Tac Toe in which players use a 4x4 grid, players must get 4 in a row to win, and players can either place a piece of their own color or expand the board by a row or column in any direction. I would like to expand this app by allowing players to choose between different grid-based games, such as Othello, Connect-4, regular Tic Tac Toe, misere Tic Tac Toe (where players must force the opponent to get k-in-a-row to win) and so on.

## Wire Frames

![image](https://github.com/Fekinox/tic-tac-toe-tic/assets/20966518/0e9ea51a-619e-4c40-988d-fac2c1691c39)

## User Stories

#### MVP Goals

- As a player, I want to recognize 4 ticks in a row to know who won a game.
  - As a player, I want to highlight the winning tiles so I know specifically who won.
- As a player, I want to expand the board by adding a row or colun to the edge of the grid.
- As a player, I want some visual feedback on win.
- As a player, I would like to reset the game state at any time so I can play again.
- As a player, I want the UI to be clean, modern, and responsive, with smooth, subtle animations on all updates to game state.
- As a player, I want to be able to scroll through the game board if/when it gets too large so that the icons don't become too small for me to feasibly see.
- As a developer, I want a clean, nicely managed codebase to make it easier to
  add new games and functionality.
- As a player, I would like to play additional games that also use the same
game board.
  - As a developer, I want to design a nice interface that games can use so
    that adding new games is easy to do.
  - As a player, I would like to choose between the additional games through a
    menu screen.
    - As a player, I would like a tool tip upon hovering over each game so that I know the rules of the game I'm about to select.
  - As a player, I would like to add Othello, a 2-player game where players compete to fill
  a grid with pieces of their own color.
  - As a player, I would like to add Connect-4, a game where players drop pieces down onto a
  board to get four in a row.

#### Stretch Goals

- As a player who is playing on a mobile device, I wish to have a consistent, seamless, and comfortable user experience.
- As a player, I would like to open a settings menu in which I can set game parameters like the initial number of rows and columns and the number of tiles needed to win.
- As a player, I would like access to different variations on the rules, such as regular tic-tac-toe rules without board expansion, or misere rules in which forcing a player to get k-in-a-row counts as a win instead of a loss.
- As a player, I would like to choose between additional color themes to
  personalize my game experience.
  - As a player, I would like my color scheme choices persisted in the browser
    so that if I open the game again or refresh the page, the theme remains
    there.
  - As a player, I would like to play against an AI.

#### Timeline - Daily Accountability
| Day   | Task                                                                                                                                                                                        | Notes |
|-------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 03/18 | Clean up the codebase (split code across multiple files and compile them with Grunt) and generalize the code to allow for running any kind of game, instead of a particular hard-coded one. |       |
| 03/19 | Begin implementing other games like Othello and Connect-4.                                                                                                                                  |       |
| 03/20 | Add additional niceties like a running score counting wins, losses, and ties, game settings, and a popup explaining the rules of a game.                                                    |       |
| 03/21 | Improve the visuals and add animations and styling.                                                                                                                                         |       |
| 03/22 | Flexible time if previous tasks are not completed by then.                                                                                                                                  |       |
| 03/23 | Stretch goals                                                                                                                                                                               |       |
| 03/24 | Stretch goals                                                                                                                                                                               |       |
| 03/25 | Presentation                                                                                                                                                                                |       |
