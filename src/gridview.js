class GridView {
  constructor(parentElement, disabled) {
    this.lastFocus = null

    // Event listeners
    // disabled - Checks if the grid is currently disabled
    this.disabled = disabled

    // onclick - Fired when the player clicks inside of a cell. Returns an
    // object with an x attribute representing the column and a y attribute
    // representing the row.
    this.onclick = (pos) => {
      console.log(`Clicked on cell (${pos.x} ${pos.y})`)
    }

    // onhover - Fired when the focused element changes (i.e. the element that
    // the player is hovering over). Either returns null (if there is no
    // element) or the position of that element.
    this.onhover = (pos) => {
      if (pos === null) {
        console.log(`No longer hovering`)
      } else {
        console.log(`Hovering over cell (${pos.x} ${pos.y})`)
      }
    }

    this.gridItem = elementBuild('div', {
      id: 'tttgrid',
      parent: parentElement,
    })

    this.gridItem.addEventListener('click', (evt) => {
      if (this.disabled()) { return }

      if (!evt.target.classList.contains('tttcell')) { return }

      this.onclick({ 
        x: Number(evt.target.dataset.x),
        y: Number(evt.target.dataset.y),
      })
    })

    this.gridItem.addEventListener('mouseover', (evt) => {
      if (this.disabled()) { return }

      let newFocus = null

      if (evt.target.classList.contains('tttcell')) {
        newFocus = {
          x: Number(evt.target.dataset.x),
          y: Number(evt.target.dataset.y),
        }
      }

      const oneIsNull =
        this.lastFocus === null && newFocus !== null ||
        this.lastFocus !== null && newFocus === null
      const bothNonNull =
        this.lastFocus !== null && newFocus !== null
      const differentValues =
        bothNonNull && (this.lastFocus.x !== newFocus.x ||
          this.lastFocus.y !== newFocus.y)
      if (oneIsNull || differentValues) {
        this.lastFocus = newFocus
        this.onhover(newFocus)
      }
    })
  }

  buildNewGrid(grid, defaultClasses) {
    this.gridItem.textContent = ''
    this.renderableGrid = 
      new Grid(grid.width, grid.height)

    const defaults = defaultClasses.split(' ')

    for (let y = 0; y < grid.height; y++) {
      let row = elementBuild('div', {
        classList: 'tttrow',
        parent: this.gridItem,
      })
      for (let x = 0; x < grid.width; x++) {
        let cell = elementBuild('div', {
          classList: 'tttcell',
          parent: row,
        })
        this.renderableGrid.set(x, y, cell);
        let entry = grid.get(x, y)

        if (entry !== null) {
          for (const c of entry.split(' ')) {
            cell.classList.add(c)
          }
        } else {
          for (const d of defaults) {
            cell.classList.add(d)
          }
        }

        cell.dataset.x = x
        cell.dataset.y = y

      }
    }
  }

  update(x, y, newClasses) {
    let cell = this.renderableGrid.get(x, y)
    cell.className = 'tttcell'
    let trimmed = newClasses.trim()
    if (trimmed.length !== 0) {
      for (const c of trimmed.split(' ')) {
        cell.classList.add(c)
      }
    }
  }
}
