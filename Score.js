class Score {
  constructor() {
    this.score = 0;
    this.bonusPoint = 0;
    this.deltaBonusPoint = 0;
    this.startTime = millis();
    this.savedTime = 0;
    this.bonusTime = 0;
    this.eqDuration = 0;
    this.lastCheckedTime = 0;
    this.boost = 0;
    this.hContribution = 0;
    this.mContribution = 0;
    this.dContribution = 0;
    this.upcomingIsDifficult = false;
  }

  updateScoreData(player, game) {
    this.hContribution = float(player.thumanScore) / float(this.score || 1) * 100;
    this.mContribution = float(player.tmachineScore) / float(this.score || 1) * 100;
    this.computeContribution();
    this.updateUpcomingDifficultyFlag(game);
  }

  updateUpcomingDifficultyFlag(game) {
    if (!game || !game.patternsToFall) return;

    let currentMusicTime = song.currentTime() * 1000;
    this.upcomingIsDifficult = false;

    for (let pattern of game.patternsToFall) {
      for (let beat of pattern.patternMatrix) {
          if (beat) {
            if (beat.onsetTime >= currentMusicTime + 3000) {
                this.upcomingIsDifficult = pattern.difficulty >= 0.65;
            }
            break;
          }
      }
      if (this.upcomingIsDifficult !== false) break;
    }
  }

  computeContribution() {
    this.dContribution = abs(this.hContribution - this.mContribution);
    let now = millis();

    if (this.lastCheckedTime === 0) this.lastCheckedTime = now;
    let delta = now - this.lastCheckedTime;
    this.lastCheckedTime = now;

    let threshold = max(0.5, 10 * pow(0.8, this.boost));

    if (this.dContribution <= threshold) {
      if (this.savedTime === 0) {
        console.log("########## New time save ##########");
        this.savedTime = millis();
        this.boost = 0;
      }
      this.eqDuration += delta;
    } else {
      this.savedTime = 0;
      this.boost = 0;
    }

    let elapsed = now - this.savedTime;
    let nextBoostLevel = int(elapsed / 10000); // every 10s

    if (this.savedTime !== 0 && nextBoostLevel > this.boost) {
      this.boost = nextBoostLevel;
      console.log(this.boost * 10 + " Secs boost");
      this.bonusTime = millis();
      this.deltaBonusPoint = (this.score * this.boost / 10) * 0.5;
      this.bonusPoint += this.deltaBonusPoint;
    }
  }

  computeIdealContribution() {
    return this.score * 0.5;
  }

  showScore(x, y) {
    textAlign(LEFT);
    textSize(20);
    fill(255);
    text("Current score: " + this.score, x, y);
  }

  showContribution(x, y) {
    this.pieChart(x + 30, y, 60);
    fill(255);

    if (this.bonusPoint !== 0) {
      fill(255, 0, 0);
      text("Bonus point: " + this.bonusPoint, 400, 110);
    }

    if (this.savedTime !== 0 && this.boost !== 0) {
      this.showBonusScore();
      this.showStarPoint();
    }
  }

  pieChart(x, y, diameter) {
    let hAngle = map(this.hContribution, 0, 100, 0, 360);
    let mAngle = 360 - hAngle;

    textAlign(LEFT, CENTER);
    noStroke();
    textSize(12);

    // human contribution
    fill('#ffff01');
    arc(x, y, diameter, diameter, 0, radians(hAngle));
    rect(x + diameter + 10, y + 20, 25, 25);

    // machine contribution
    fill('#a901f7');
    arc(x, y, diameter, diameter, radians(hAngle), radians(hAngle + mAngle));
    rect(x + diameter + 10, y - 20, 25, 25);

    // text labels
    fill(255);
    text("Human   " + nf(this.hContribution, 0, 1) + "%", x + diameter + 35, y + 20);
    text("Machine   " + nf(this.mContribution, 0, 1) + "%", x + diameter + 35, y - 20);
  }

  showBonusScore() {
    let elapsed = millis() - this.bonusTime;
    if (elapsed < 5000) {
      let opacity = 255 - map(elapsed, 0, 5000, 0, 255);
      fill(255, 0, 0, opacity);
      text(this.deltaBonusPoint + " bonus points!", 400, 125);
    }
  }

  showStarPoint() {
    if (this.boost <= 8) {
      for (let i = 0; i < this.boost; i++) {
        fill(221, 245, 66);
        this.star(410 + i * 25, 80, 5, 10, 5);
      }
    } else {
      fill(221, 245, 66);
      this.star(410, 80, 5, 10, 5);
      textSize(12);
      text("x" + this.boost, 430, 80);
    }
  }

  star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}