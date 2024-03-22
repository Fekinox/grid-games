const animations = {
  newCell: {
    frames: [
      { fontSize: 0 },
      { fontSize: 'var(--cell-size)' },
    ],
    timing: {
      duration: '0.2s',
      easing: 'ease-out',
    }
  },
  winSpin: {
    frames: [
      { rotate: '1turn' },
      { rotate: 0 },
    ],
    timing: {
      duration: '0.2s',
      easing: 'ease-out',
    }
  },
  tieWiggle: {
    frames: [
      { rotate: 0 },
      { rotate: '20deg', offset: 0.25, },
      { rotate: '-20deg', offset: 0.75, },
      { rotate: 0 },
    ],
    timing: {
      duration: '0.2s',
      iterations: 2,
    }
  },
  expandSpin: {
    frames: [
      { rotate: '0.5turn', scale: 0 },
      { rotate: 0, scale: 1 },
    ],
    timing: {
      duration: '0.2s',
      easing: 'ease-out',
    }
  }
}

function applyAnimation(element, animationName) {
  element.animate(
    animations[animationName].frames,
    animations[animationName].timing,
  )
}
