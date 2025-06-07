class StartLaneSelect {
  constructor() {
    this.startLaneSelected = false;
    this.humanInput = [false, false, false];
    this.machineInput = [true, true, true];
    this.highwayChangedFlag = true;
  }

  drawStartLaneSelect() {
    if (!this.startLaneSelected) {
      fill(255);
      textAlign(LEFT);
      textSize(20);
      text("Configure string to play", (3 * width) / 8, height / 8);

      textSize(15);
      text(
        "Choose your highway to start with.\n" +
          "by pressing key 1, 2, or 3.\n" +
          "By default all lanes are machine's.\n" +
          "Press enter when done.",
        (3 * width) / 8,
        (4 * height) / 5
      );
    }
  }

  receiveHumanInput(game) {
    if (key === '1') {
      this.highwayChangedFlag = true;
      this.humanInput[0] = !this.humanInput[0];
      this.machineInput[0] = !this.machineInput[0];
    }
    if (key === '2') {
      this.highwayChangedFlag = true;
      this.humanInput[1] = !this.humanInput[1];
      this.machineInput[1] = !this.machineInput[1];
    }
    if (key === '3') {
      this.highwayChangedFlag = true;
      this.humanInput[2] = !this.humanInput[2];
      this.machineInput[2] = !this.machineInput[2];
    }
    if (keyCode === ENTER) {
      this.startLaneSelected = true;
      game.gameSceneFlag = true;
    }
  }
}