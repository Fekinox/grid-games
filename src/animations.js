const animations = {
  newCell: {
    frames: [
      { fontSize: 0 },
      { fontSize: 'var(--cell-size)' },
    ],
    timing: {
      duration: 200,
      easing: 'ease-out',
    }
  },
  winSpin: {
    frames: [
      { rotate: '1turn', scale: 1.5, },
      { rotate: '0turn', scale: 1, },
    ],
    timing: {
      duration: 500,
      easing: 'ease-out',
    }
  },
  tieWiggle: {
    frames: [
      { rotate: '0turn' },
      { rotate: '20deg', offset: 0.25, },
      { rotate: '-20deg', offset: 0.75, },
      { rotate: '0turn' },
    ],
    timing: {
      duration: 200,
      iterations: 2,
    }
  },
  expandSpin: {
    frames: [
      { rotate: '0.5turn', scale: 0 },
      { rotate: '0turn', scale: 1 },
    ],
    timing: {
      duration: 200,
      easing: 'ease-out',
    }
  },
  invert: {
    frames: [
      { rotate: '1turn', scale: '0' },
      { rotate: '0turn', scale: '1' },
    ],
    timing: {
      duration: 500,
      easing: 'ease-out',
    }
  }
}

function applyAnimation(element, animationName, newParams = {}) {
  element.animate(
    animations[animationName].frames,
    {
      ...animations[animationName].timing,
      ...newParams,
    }
  )
}
