class GameEndScene {
  constructor() {
    this.gameEndSceneFlag = false;
  }

  drawGameEndScene(score, player) {
    // Draw game finished label
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Game Finished", width / 2, 80);

    // Draw total score
    let totalScore = score.score + score.bonusPoint;
    fill(255,0,0);
    text("Total score: " + totalScore, width / 2, 110);

    // Draw decision quadrant and points
    this.showDecisionQuadrant();
    this.plotPointsOnQuadrant(player);

    // Draw play style
    textSize(20);
    text("You are: " + player.playStyleGroup, width / 2, 500);
  }

  showDecisionQuadrant() {
    stroke(255);
    fill(255);
    line(180, 300, 460, 300);
    line(320, 160, 320, 440);


    textSize(15);
    stroke(0);
    textAlign(CENTER, CENTER);

    text("poor", 160, 300);
    text("excellent", 495, 300);
    text("collaborate", 320, 145);
    text("solitary", 320, 455);
  }

  plotPointsOnQuadrant(player) {
    if (player.humanGameSkill.length !== 0) {
      for (let i = 0; i < player.humanGameSkill.length; i++) {
        let xcoor = player.humanGameSkill[i].Y; // mapped value
        let ycoor = player.humanManagement[i].Y; // mapped value
        fill(255);
        noStroke();
        ellipse(xcoor, ycoor, 5, 5);
        // Optionally add text label
        textSize(10);
        text(i, xcoor, ycoor - 20);
      }
    }
  }
}