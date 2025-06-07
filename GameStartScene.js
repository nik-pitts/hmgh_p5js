class GameStartScene {
  constructor() {
    this.startSceneFlag = true;
    this.gameStartBtn = null;
  }

  generateGameStartSceneObjects() {
    this.gameStartBtn = new Button(width / 2, height / 2);
  }

  drawGameStartScene() {
    // text
    textAlign(CENTER, CENTER);
    stroke(0);
    fill(255);    
    textSize(20);
    text("Welcome to Human - Machine Guitar Hero", width / 2, height / 2 - 100);
    
    textSize(12);
    text("Game Start", width / 2, height / 2);

    // button rect
    rectMode(CENTER);
    noFill();
    stroke('#bdbdbd');
    rect(this.gameStartBtn.anchor.x, this.gameStartBtn.anchor.y, 100, 25);
  }
}