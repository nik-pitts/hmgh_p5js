class Player {
  constructor() {
    this.tmachineScore = 0;
    this.thumanScore = 0;
    this.pmachineScore = 0;
    this.phumanScore = 0;
    this.humanFault = 0;
    this.skillComputed = false;
    this.playStyleGroup = null;

    this.machineHighway = new Array(3).fill(false);
    this.machineButtons = [];
    this.humanButtons = [];
    this.humanGameSkill = []; // Array of Tuple
    this.humanManagement = []; // Array of Tuple

    this.decisionMap = {
      Novice: 0,
      Solo: 0,
      Strategic: 0,
      Master: 0,
    };
  }

  updateGameData(startLane, buttons) {
    if (startLane.highwayChangedFlag) {
      this.machineHighway = startLane.machineInput;
      this.machineButtons = [];
      this.humanButtons = [];

      for (let i = 0; i < this.machineHighway.length; i++) {
        if (this.machineHighway[i]) {
          this.machineButtons.push(buttons[i]);
        } else {
          this.humanButtons.push(buttons[i]);
        }
      }
      startLane.highwayChangedFlag = false;
    }
  }

  playGuitarHero(game) {
    for (let pattern of game.patternsToFall) {
      for (let beat of pattern.patternMatrix) {
        for (let j = 0; j < this.machineHighway.length; j++) {
          if (this.machineHighway[j] && beat.anchor.x === 60 * (j + 1)) {
            game.detectCollisionForMachine(this.machineButtons, beat, this);
          } else {
            game.detectCollisionForHuman(this.humanButtons, beat, this);
          }
        }
      }
    }
  }

  computeHumanPlayerSkill(patternNumber, patternLength, difficulty) {
    let humanMiss = patternLength - this.pmachineScore - this.phumanScore;
    if (humanMiss < 0) humanMiss = 0;

    let fault_weight = 1.0;
    let raw_skill = (this.phumanScore - fault_weight * this.humanFault) / (this.phumanScore + humanMiss);
    let raw_skill_weight = 0.7;
    let weighted_skill = raw_skill_weight * raw_skill + (1 - raw_skill_weight) * difficulty;
    let mappedSkill = map(weighted_skill, 0, 1, 180, 460);

    this.humanGameSkill.push(new Tuple(weighted_skill, mappedSkill));
    console.log("Player Skill:", weighted_skill, "Human Fault:", this.humanFault, "Human Miss:", humanMiss);

    this.humanFault = 0;
    this.phumanScore = 0;
    this.pmachineScore = 0;
    this.skillComputed = true;

    return mappedSkill;
  }

  computeHumanPlayerManagement(score) {
    let now = millis();
    let gameDuration = now - score.startTime;
    console.log("Eq duration:", score.eqDuration, "Game duration:", gameDuration);

    let managingAbility = score.eqDuration / gameDuration;
    console.log("Raw Managing Ability:", managingAbility);

    let mappedManagingAbility = map(managingAbility, 0, 1, 440, 160);
    this.humanManagement.push(new Tuple(managingAbility, mappedManagingAbility));
    return mappedManagingAbility;
  }

  decidePlayStyle(mappedSkill, mappedManagement) {
    if (mappedSkill <= 320 && mappedManagement >= 300) {
      this.decisionMap.Novice += 1;
    } else if (mappedSkill <= 320 && mappedManagement < 300) {
      this.decisionMap.Strategic += 1;
    } else if (mappedSkill > 320 && mappedManagement >= 300) {
      this.decisionMap.Solo += 1;
    } else if (mappedSkill > 320 && mappedManagement < 300) {
      this.decisionMap.Master += 1;
    }

    let bestGrp = null;
    let bestInt = -Infinity;

    for (let [grp, count] of Object.entries(this.decisionMap)) {
      if (count > bestInt) {
        bestGrp = grp;
        bestInt = count;
      }
    }

    this.playStyleGroup = bestGrp;
    console.log("This human player is:", this.playStyleGroup);
  }

  play(startLane, game, buttons) {
    this.updateGameData(startLane, buttons);
    this.playGuitarHero(game);
  }
}