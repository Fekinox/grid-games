// TODO: Maybe make the game area scrollable and make the margin widths dynamic
// as well.
// TODO: Animations should not restart when you expand the board
// TODO: Add responsive design stuff as well
// TODO: Add additional variants (misere tic tac toe, for instance)
// TODO: Settings menu to set game parameters.
// TODO: Maybe some fun CSS effects in the background, it's otherwise kind of sparse.
// TODO: Add a proper menu system (this'll give me practice with writing other
// games)

let state = new GameState(4, 4, 4);

document.addEventListener('DOMContentLoaded', (event) => {
  state.initCachedItems()
  state.render()
});

document.addEventListener('keydown', (event) => {
  console.log(event.key)
  switch (event.key.toLowerCase()) {
    case 'w':
      state.expandGrid(state.width, state.height + 1, 0, 1)
      state.render()
      break;
    case 'a':
      state.expandGrid(state.width + 1, state.height, 1, 0)
      state.render()
      break;
    case 's':
      state.expandGrid(state.width, state.height + 1, 0, 0)
      state.render()
      break;
    case 'd':
      state.expandGrid(state.width + 1, state.height, 0, 0)
      state.render()
      break;
  }
})

