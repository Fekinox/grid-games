class RandomLegalMove {
  constructor(_player) {
  }

  nextMove(engine) {
    const moves = engine.getLegalMoves();
    if (moves.length === 0) { return null; }

    return moves[Math.floor(Math.random() * moves.length)];
  }
}
