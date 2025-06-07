class Button {
  constructor(x, y) {
    this.anchor = createVector(x, y);
    this.hit = false;
    this.machineHit = false;
  }

  show() {
    rectMode(CENTER);
    noStroke();
    if (this.hit) {
      fill(189); // #bdbdbd
    } else {
      fill(255);
    }
    rect(this.anchor.x, this.anchor.y, 25, 25);
  }

  // Placeholder for machinePressed logic
  machinePressed() {
    // To be implemented
  }
}