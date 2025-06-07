const FALL_DURATION = 2000;
const GLOBAL_VISUAL_OFFSET = 400; // Assuming this is defined somewhere in your code

class BeatPattern {
  constructor(patternNumber, difficulty, morans_i, sparseness) {
    this.patternNumber = patternNumber;
    this.difficulty = difficulty;
    this.morans_i = morans_i;
    this.sparseness = sparseness;

    this.patternLength = 0;
    this.endOfThePattern = false;
    this.deletePattern = false;
    this.patternMatrix = []; // replaces ArrayList
  }

  setBeatPatternMatrix(xcoord, onsetTime, beatNumber) {
    this.patternMatrix.push(new Beat(this, xcoord, onsetTime, beatNumber));
  }

  setPatternLength(newPatternLength) {
    this.patternLength = newPatternLength;
  }
}

class Beat {
  constructor(parentPattern, xcoord, onsetTime, beatNumber) {
    this.parent = parentPattern; // reference to enclosing BeatPattern
    this.beatNumber = beatNumber;

    this.onsetTime = onsetTime * 1000; // time when the beat occurs seconds to milliseconds
    this.spawnTime = (this.onsetTime + GLOBAL_VISUAL_OFFSET) - FALL_DURATION;

    this.anchor = createVector(xcoord, -10); // y-coordinate starts at 0 (stop of the screen)
    this.startY = -10;
    this.endY = height * 4 / 5; // target line

    this.hit = false;
    this.validPlayDetected = false;
    this.invalidPlayDetected = false;
  }

  fall(player, score) {
    let now = song.currentTime() * 1000; 
    let t = (now - this.spawnTime) / FALL_DURATION;
    //t = constrain(t, 0, 1);
    if (t <= 1)
    {
      this.anchor.y = lerp(this.startY, this.endY, t);
    }
    else{
      const fallSpeedAfterHit = 255; // px/sec → tune this as you like
      this.anchor.y = this.endY + ((t - 1) * FALL_DURATION / 1000) * fallSpeedAfterHit;      
    }
    this.endOfPattern(player, score);
  }

  endOfPattern(player, score) {
    if (this.beatNumber === 9) {
      if (this.anchor.y >= height * 4 / 5 && !this.parent.endOfThePattern) {
        this.parent.endOfThePattern = true;

        if (player.humanButtons.length !== 0) {
          let mappedSkill = player.computeHumanPlayerSkill(
            this.parent.patternNumber,
            this.parent.patternLength,
            this.parent.difficulty
          );
          let mappedManagement = player.computeHumanPlayerManagement(score);
          player.decidePlayStyle(mappedSkill, mappedManagement);
        } else {
          console.log("no human buttons assigned");
        }
      }

      if (this.anchor.y > height && !this.parent.deletePattern) {
        this.parent.deletePattern = true;
      }
    }
  }

  show() {
    if (!this.hit) {
      fill(255);
      noStroke();
      textSize(15);
      text(this.parent.patternNumber, this.anchor.x + 15, this.anchor.y);
      textSize(10);
      text(this.beatNumber, this.anchor.x - 10, this.anchor.y);
    } else {
      noFill();
      noStroke();
    }
    ellipse(this.anchor.x, this.anchor.y, 10, 10);
  }

  showDifficulty() {
    let xcoor = map(this.parent.difficulty, 0.8, 1.5, 400, 600);
    ellipse(xcoor, 450, 5, 5);
    textSize(10);
    text(this.parent.patternNumber, xcoor, 430);
  }

  toString() {
    return `(${this.anchor.x}, ${this.anchor.y})`;
  }
}