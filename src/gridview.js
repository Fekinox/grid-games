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
    }

    // onhover - Fired when the focused element changes (i.e. the element that
    // the player is hovering over). Either returns null (if there is no
    // element) or the position of that element.
    this.onhover = (pos) => {
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

  buildNewGrid(width, height, buildFn = null) {
    let newFun = (x, y, cell) => {}

    if (buildFn !== null) {
      newFun = buildFn
    }

    this.gridItem.textContent = ''
    this.renderableGrid = 
      new Grid(width, height,
      (x, y) => {
        let cell = elementBuild('div', {
          classList: 'tttcell',
        })

        cell.dataset.x = x
        cell.dataset.y = y

        newFun(x, y, cell)

        return cell
      })

    for (let y = 0; y < height; y++) {
      let row = elementBuild('div', {
        classList: 'tttrow',
        parent: this.gridItem,
      })
      for (let x = 0; x < width; x++) {
        let cell = this.renderableGrid.get(x, y);
        row.appendChild(cell)
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

  get(x, y) {
    return this.renderableGrid.get(x, y)
  }

  animate(x, y, animationName, params = {}) {
    applyAnimation(this.renderableGrid.get(x, y), animationName, params)
  }
}
