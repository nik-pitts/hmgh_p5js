class GuitarString {
  constructor(x, y) {
    this.anchor = createVector(x, y);
  }

  show() {
    strokeWeight(2);
    stroke(255);
    line(this.anchor.x, 0, this.anchor.x, height);
  }
}