class GameUI {
  constructor() {
    this.buttons = new Array(3);
    this.strings = new Array(3);
  }

  generateGameUIObjects() {
    for (let j = 0; j < this.buttons.length; j++) {
      this.buttons[j] = new Button(60 + 60 * j, height * 4 / 5);
      this.strings[j] = new GuitarString(60 + 60 * j, 0);
    }
  }

  drawGameUIObjects() {
    for (let j = 0; j < this.buttons.length; j++) {
      this.strings[j].show();
      this.buttons[j].show();
    }
  }

  drawLaneSelection(lane) {
    textAlign(CENTER, CENTER);
    textSize(18);
    fill(0);
    for (let i = 0; i < lane.length; i++) {
      text(lane[i] ? "H" : "M", 60 + 60 * i, height * 4 / 5);
    }
  }
}