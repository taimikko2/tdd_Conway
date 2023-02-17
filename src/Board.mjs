export class Board {
  width;
  height;
  canvas;

  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.canvas = new Array(h);
    for (let i = 0; i < this.height; i++) {
      this.canvas[i] = new Array(w);
      this.canvas[i].fill("b");
    }
  }

  toString() {
    let res = "";
    for (let i = 0; i < this.height; i++) {
      res += this.canvas[i].join("")+"\n";
    }
    return res;
  }
}
