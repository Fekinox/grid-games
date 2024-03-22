/* https://linear-easing-generator.netlify.app */
const easeOutElastic = `linear(
  0, 1.09 12%, 1.3 17%, 1.28 20%, 0.99 29%, 0.91 35%, 1.03, 0.99 70%, 1
)`

const animations = {
  newCell: {
    frames: [
      { fontSize: 0 },
      { fontSize: 'var(--cell-size)' },
    ],
    timing: {
      duration: 500,
      easing: easeOutElastic,
    }
  },
  winSpin: {
    frames: [
      { rotate: '1turn', },
      { rotate: '0turn', },
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
      { rotate: '1turn', },
      { rotate: '0turn', },
    ],
    /* https://linear-easing-generator.netlify.app */
    timing: {
      duration: 500,
      easing: 'ease-out',
    }
  },
  bounceIn: {
    frames: [
      { scale: 0, },
      { scale: 1, },
    ],
    timing: {
      duration: 1000,
      easing: easeOutElastic,
      fill: 'backwards',
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
