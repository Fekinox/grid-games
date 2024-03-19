// TODO: Maybe make the game area scrollable and make the margin widths dynamic
// as well.
// TODO: Animations should not restart when you expand the board
// TODO: Add responsive design stuff as well
// TODO: Add additional variants (misere tic tac toe, for instance)
// TODO: Settings menu to set game parameters.
// TODO: Maybe some fun CSS effects in the background, it's otherwise kind of sparse.
// TODO: Add a proper menu system (this'll give me practice with writing other
// games)

let runner = new GameRunner()
let menu = new Menu()

document.addEventListener('DOMContentLoaded', (event) => {
  // runner.startGame(new TeeFourEngine({
  //   width: 4,
  //   height: 4,
  //   toWin: 4,
  // }))
  // runner.startGame(new TeeThreeEngine({
  //   width: 3,
  //   height: 3,
  //   toWin: 3,
  // }))
  menu.initialize(gameEntries)
})
