class Scoreboard {
  constructor(parentElement) {
    // Score
    this.score = elementBuild("div",
      { classList: "scorecontainer", parent: parentElement });

    this.p1Scoreboard = elementBuild("div",
      { classList: "scoreitem", parent: this.score, });
    this.p1Scoreboard.style.color = "var(--player1-color)";

    this.p1sep = elementBuild("div",
      { classList: "scoreitem", parent: this.score });
    this.p1sep.textContent = "-";

    this.p2Scoreboard = elementBuild("div",
      { classList: "scoreitem", parent: this.score, });
    this.p2Scoreboard.style.color = "var(--player2-color)";

    this.p2sep = elementBuild("div",
      { classList: "scoreitem", parent: this.score });
    this.p2sep.textContent = "-";

    this.tieScoreboard = elementBuild("div",
      { classList: "scoreitem", parent: this.score, });


    this.lastScores = {
      p1: null,
      p2: null,
      tie: null,
    };
    this.update(0, 0, 0);
  }

  update(p1score, p2score, ties) {
    if (p1score != this.lastScores.p1) {
      this.p1Scoreboard.textContent = p1score;
      applyAnimation(this.p1Scoreboard, "scoreHighlight");
      this.lastScores.p1 = p1score;
    }
    if (p2score != this.lastScores.p2) {
      this.p2Scoreboard.textContent = p2score;
      applyAnimation(this.p2Scoreboard, "scoreHighlight");
      this.lastScores.p2 = p2score;
    }
    if (ties != this.lastScores.tie) {
      this.tieScoreboard.textContent = ties;
      applyAnimation(this.tieScoreboard, "scoreHighlight");
      this.lastScores.tie = ties;
    }

    if (ties > 0) {
      this.p2sep.classList.remove("hidden");
      this.tieScoreboard.classList.remove("hidden");
    } else {
      this.p2sep.classList.add("hidden");
      this.tieScoreboard.classList.add("hidden");
    }
  }
}
