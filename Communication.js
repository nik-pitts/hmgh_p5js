class Communication {
  constructor() {
    this.communicationStrings = new Map(); // Map<Integer, Array<PVector>>
    this.stringNumberTags = new Map();     // Map<Integer, PVector>
    this.whoIsTalking = WhoIsTalking.NO_ONE;
    this.recommended = false;
    this.humanSays = 0;
    this.machineSays = 0;
    this.startTalking = 0;

    for (let i = 0; i < 3; i++) {
      // Line anchors
      let anchor1 = createVector(420 + 80 * i, 350);
      let anchor2 = createVector(420 + 80 * i, 550);
      this.communicationStrings.set(i + 1, [anchor1, anchor2]);

      // Label position
      this.stringNumberTags.set(i + 1, createVector(420 + 80 * i, 480));
    }
  }

  show() {
    strokeWeight(2);
    for (let [akey, linePoints] of this.communicationStrings.entries()) {
      if (akey !== this.humanSays && akey !== this.machineSays) {
        let recPoints = this.stringNumberTags.get(akey);

        stroke(255);
        fill(255);
        line(linePoints[0].x, linePoints[0].y, linePoints[1].x, linePoints[1].y);
        rectMode(CENTER);
        rect(recPoints.x, recPoints.y, 20, 20);

        fill(0);
        textAlign(CENTER, CENTER);
        text(akey, recPoints.x, recPoints.y);
      }
    }
  }

  talkRender(buttons) {
    if (this.whoIsTalking !== WhoIsTalking.NO_ONE) {
      let renderColor;
      let stringKey;

      switch (this.whoIsTalking) {
        case WhoIsTalking.HUMAN:
          renderColor = color('#ffff01');
          stringKey = this.humanSays;
          break;
        case WhoIsTalking.MACHINE:
          renderColor = color('#a901f7');
          stringKey = this.machineSays;
          break;
        default:
          renderColor = color(255);
          break;
      }

      let linePoints = this.communicationStrings.get(stringKey);
      let recPoints = this.stringNumberTags.get(stringKey);
      let opacity = 255 - map(millis() - this.startTalking, 0, 10000, 0, 255);

      stroke(red(renderColor), green(renderColor), blue(renderColor), opacity);
      fill(red(renderColor), green(renderColor), blue(renderColor), opacity);
      line(linePoints[0].x, linePoints[0].y, linePoints[1].x, linePoints[1].y);

      noStroke();
      rectMode(CENTER);
      rect(recPoints.x, recPoints.y, 20, 20);

      fill(0);
      textAlign(CENTER, CENTER);
      text(stringKey, recPoints.x, recPoints.y);
    }
  }

  trackTalk(sls) { //sls is StartLaneSelect object = initial configuration of strings
    if (this.whoIsTalking !== WhoIsTalking.NO_ONE) {
      if (this.startTalking === 0) {
        this.startTalking = millis();
      }

      if (millis() - this.startTalking >= 3000) {
        let key = (this.whoIsTalking === WhoIsTalking.HUMAN) ? this.humanSays : this.machineSays;

        sls.humanInput[key - 1] = !sls.humanInput[key - 1];
        sls.machineInput[key - 1] = !sls.machineInput[key - 1];
        sls.highwayChangedFlag = true;

        this.whoIsTalking = WhoIsTalking.NO_ONE;
        this.humanSays = 0;
        this.machineSays = 0;
        this.startTalking = 0;
      }
    }
  }

  // Machine behavior protocol:
  // Master: Follows the human player's action plan.
  // Strategic: Minimizes human play when difficult beat patterns are detected.
  // Otherwise, follow the human player's management decision.
  // Novice: Leads the play session, by minimizing human player's play.
  // Solo: Suggest string configuration that maximizes human's play.

  machineTalk(playStyle, machineHighway, score) {
    if (playStyle && this.whoIsTalking === WhoIsTalking.NO_ONE) {
      let mStringnumber = -1;
      let hStringnumber = -1;

      for (let i = 0; i < 3; i++) {
        if (machineHighway[i]) {
          mStringnumber = i;
        } else {
          hStringnumber = i;
        }
      }

      let threshold = max(0.5, 10 * pow(0.8, score.boost));

      if (playStyle === "Novice") {
        this.novice(score, threshold, hStringnumber, mStringnumber);
      } else if (playStyle === "Solo") {
        this.solo(score, threshold, hStringnumber, mStringnumber);
      } else if (playStyle === "Strategic") {
        this.strategic(score, threshold, hStringnumber);
      }
    }
  }

  stringSwitch(score, hStringnumber, mStringnumber) {
    if (score.hContribution > score.mContribution) {
      if (hStringnumber >= 0) {
        this.whoIsTalking = WhoIsTalking.MACHINE;
        this.machineSays = hStringnumber + 1;
      }
    } else {
      if (mStringnumber >= 0) {
        this.whoIsTalking = WhoIsTalking.MACHINE;
        this.machineSays = mStringnumber + 1;
      }
    }
  }

  // this is how threshold is computed: max(0.5, 10 * pow(0.8, this.boost));
  // if boost is 1, threshold is 10 * 0.8 = 8
  // if boost is 2, threshold is 10 * 0.64 = 6.4
  // if boost is 3, threshold is 10 * 0.512 = 5.12
  // if boost is 4, threshold is 10 * 0.4096 = 4.096
  // if boost is 5, threshold is 10 * 0.32768 = 3.2768
  // if boost is 6, threshold is 10 * 0.262144 = 2.62144

  novice(score, threshold, hStringnumber, mStringnumber) {
    // In novice mode, the machine will maximize its play
    // as long as the contribution level is below threshold level.
    if (score.dContribution < threshold) {
      if (hStringnumber >= 0) { // human player has a string to play
        this.whoIsTalking = WhoIsTalking.MACHINE;
        this.machineSays = hStringnumber + 1;
      }
    }
    // If the contribution level is above threshold, the machine will
    // regulate contribution level by switching strings.
    else {
      this.stringSwitch(score, hStringnumber, mStringnumber);
    }
  }

  solo(score, threshold, hStringnumber, mStringnumber) {
    if (score.dContribution < threshold) {
      if (mStringnumber >= 0) {
        this.whoIsTalking = WhoIsTalking.MACHINE;
        this.machineSays = mStringnumber + 1;
      }
    } else {
      this.stringSwitch(score, hStringnumber, mStringnumber);
    }
  }

  strategic(score, threshold, hStringnumber) {
    if (score.dContribution < threshold) { // as long as threshold is maintained
      if (hStringnumber >= 0) { // human player has a string to play
        // machine will play more strings
        this.whoIsTalking = WhoIsTalking.MACHINE;
        this.machineSays = hStringnumber + 1;
      }
    } else if (score.upcomingIsDifficult) { // if the upcoming is difficult
      if (hStringnumber >= 0) { // human player has a string to play
        // machine will play the human string
        this.whoIsTalking = WhoIsTalking.MACHINE;
        this.machineSays = hStringnumber + 1;
      }      
    }
  }
}