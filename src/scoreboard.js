class Scoreboard {
  constructor(parentElement) {
    // Score
    this.score = elementBuild("div",
      { classList: "scorecontainer", parent: parentElement });

    this.p1Scoreboard = elementBuild("div",
      { classList: "scoreitem", parent: this.score, });

    this.p1sep = elementBuild("div",
      { classList: "scoreitem", parent: this.score });
    this.p1sep.textContent = "-";

    this.p2Scoreboard = elementBuild("div",
      { classList: "scoreitem", parent: this.score, });

    this.p2sep = elementBuild("div",
      { classList: "scoreitem", parent: this.score });
    this.p2sep.textContent = "-";

    this.tieScoreboard = elementBuild("div",
      { classList: "scoreitem", parent: this.score, });

    this.update(0, 0, 0);
  }

  update(p1score, p2score, ties) {
    this.p1Scoreboard.textContent = p1score;
    this.p2Scoreboard.textContent = p2score;
    this.tieScoreboard.textContent = ties; 

    if (ties > 0) {
      this.p2sep.classList.remove("hidden");
      this.tieScoreboard.classList.remove("hidden");
    } else {
      this.p2sep.classList.add("hidden");
      this.tieScoreboard.classList.add("hidden");
    }
  }
}
