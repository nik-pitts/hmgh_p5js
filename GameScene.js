class GameScene {
  constructor() {
    this.gameSceneFlag = false;
    this.gameEndBtn = new Button(450, 275);
    this.patternsToFall = [];
    this.initialLength = null;
    this.gameScore = new Score();
    this.musicStartMillis = null;
  }

  generateGameSceneObjects() {
    let jsonTool = new JSONTool();
    this.patternsToFall = jsonTool.loadData();

    console.log("Number of patterns:", this.patternsToFall.length);
    console.log("First pattern matrix:", this.patternsToFall[0]?.patternMatrix?.length);
  }

  drawGameSceneObject(player) {
    // Render Beats
    for (let i = this.patternsToFall.length - 1; i >= 0; i--) {
      let pattern = this.patternsToFall[i];

      if (pattern.deletePattern) {
        this.patternsToFall.splice(i, 1);
        continue;
      }

      for (let beat of pattern.patternMatrix) {
        if (beat) {
          beat.fall(player, this.gameScore);
          beat.show();
        }
      }
    }

    // Render Game Score
    this.gameScore.updateScoreData(player, this);
    this.gameScore.showScore(400, 50);
    this.gameScore.showContribution(400, 170);

    // Render Button
    rectMode(CENTER);
    noFill();
    stroke(255);
    rect(this.gameEndBtn.anchor.x + 40, this.gameEndBtn.anchor.y, 90, 30);
    stroke(0);
    fill(255);
    textSize(15);
    text("exit game", this.gameEndBtn.anchor.x + 10, this.gameEndBtn.anchor.y);

    // Skill-Management Graph for debug (optional)
    // this.gameScore.showSkillManagementGraph();
  }

  detectCollisionForHuman(hbuttons, beat, player) {
    for (let i = 0; i < hbuttons.length; i++) {
      if (hbuttons[i].anchor.x === beat.anchor.x) {
        if (hbuttons[i].hit) {
          if (this.distance(beat.anchor.x, beat.anchor.y, hbuttons[i].anchor.x, hbuttons[i].anchor.y)) {
            beat.hit = true;
            if (!beat.validPlayDetected) {
              this.gameScore.score += 1;
              player.thumanScore += 1;
              player.phumanScore += 1;
              beat.validPlayDetected = true;
            }
          } else if (this.faultyDistance(beat.anchor.x, beat.anchor.y, hbuttons[i].anchor.x, hbuttons[i].anchor.y)) {
            if (!beat.invalidPlayDetected) {
              player.humanFault += 1;
              beat.invalidPlayDetected = true;
            }
          }
        }
      }
    }
  }

  detectCollisionForMachine(buttons, beat, player) {
    for (let i = 0; i < buttons.length; i++) {
      if (beat) {
        if (this.distance(beat.anchor.x, beat.anchor.y, buttons[i].anchor.x, buttons[i].anchor.y)) {
          beat.hit = true;
          if (!beat.validPlayDetected) {
            this.gameScore.score += 1;
            player.tmachineScore += 1;
            player.pmachineScore += 1;
            beat.validPlayDetected = true;
          }
        }
      }
    }
  }

  distance(beatX, beatY, btnX, btnY) {
    return dist(beatX, beatY, btnX, btnY) < 25;
  }

  faultyDistance(beatX, beatY, btnX, btnY) {
    let d = dist(beatX, beatY, btnX, btnY);
    return d >= 25 && d < 35;
  }
}