import readTextFile from "read-text-file";
//import lineReader  from 'line-reader';

export class Board {
  width;
  height;
  canvas;
  x;
  y;
  birth;
  survive;

  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.canvas = new Array(h);
    this.birth = 3; //default
    this.survive = new Array();
    this.survive.push(2);
    this.survive.push(3);
    for (let i = 0; i < this.height; i++) {
      this.canvas[i] = new Array(w);
      this.canvas[i].fill("b");
    }
  }

  async readRLE(filename) {
    // "G:/HY/conwayLife/blinker.rle"
    var content = readTextFile.readSync(filename);
    //console.log("luettiin " + content + " " + content.length);
    let h = 1;
    let w = 3;
    this.width = w;
    this.height = h;
    let res = "";
    let count = 1;
    this.canvas = new Array(h);
    for (let i = 0; i < this.height; i++) {
      this.canvas[i] = new Array(w);
      //this.canvas[i].fill("b");
    }
    this.contentToCanvas(0, 0, content);

    return this.toString();
  }

  async addRLE(x, y, filename) {
    //console.log("addRLE(",x,",",y,",",filename,")");
    var content = readTextFile.readSync(filename);
    this.contentToCanvas(x, y, content);
    return this.toString();
  }

  asRLE() {
    let res = "";
    let ch;
    let count;
    // alkuun vain varsinainen kuvio, jätetään pois muut: x = 3, y = 3, rule= abc
    for (let r = 0; r < this.height; r++) {
      ch = this.canvas[r][0];
      count = 0;
      if (r > 0) {
        res += "$";
      }
      for (let c = 0; c < this.width; c++) {
        if (ch == this.canvas[r][c]) {
          count++;
        } else {
          res += count == 1 ? ch : count + ch;
          ch = this.canvas[r][c];
          count = 1;
        }
        if (c == this.width - 1 && ch == "o") {
          res += count == 1 ? ch : count + ch;
        }
      }
    }
    res += "!";
    return res;
  }

  contentToCanvas(x, y, content) {
    let count = 0;
    let c = 0;
    let xpos = x;
    //console.log("contentToCanvas(",x,",",y,",",content);
    for (let i = 0; i < content.length; i++) {
      try {
        if (content[i] in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
          c = Number(content[i]); // erikoistapauksena kaksinumeroinen luku ...
          count *= 10;
          count += c;
        } else {
          throw new Error(content[i] + " ei ole luku");
        }
      } catch (err) {
        if (content[i] == "!") {
          for (let j = xpos; j < this.width; j++) {
            this.canvas[y][j] = "b";
          }
          break;
        }
        if (content[i] == "$") {
          for (let j = xpos; j < this.width; j++) {
            this.canvas[y][j] = "b";
          }
          count = 0;
          c = 0;
          xpos = x;
          y += 1;
          continue;
        }
        if (count == 0 && c == 0) {
          // content[i] in ["b","o"] &&
          this.canvas[y][xpos] = content[i];
          xpos += 1;
        } else {
          for (let j = 0; j < count; j++) {
            this.canvas[y][xpos] = content[i];
            xpos += 1;
          }
        }
        count = 0;
        c = 0;
      }
    }
    //console.log(this.canvas);
    // alussa kommenttirivit pois #
    // x = 3, y = 1, rule = B3/S23
    // 3o!
    // x = m, y = n
    // width , height
    //(`ooo`)
  }

  canSurvive(c) {
    for (let i = 0; i < this.survive.length; i++) {
      if (c == this.survive[i]) {
        return true;
      }
    }
    return false;
  }

  isAlive(r, c) {
    if (r < this.height && r >= 0 && c < this.width && c >= 0) {
      return this.canvas[r][c] == "o" ? true : false;
    }
    return false;
  }

  tick() {
    let newCanvas = new Array(this.height);
    for (let i = 0; i <= this.height; i++) {
      newCanvas[i] = new Array(this.width);
    }
    let count = 0;
    for (let r = 0; r <= this.height; r++) {
      for (let c = 0; c <= this.width; c++) {
        count = 0;
        for (let ri = r - 1; ri <= r + 1; ri++) {
          if (ri < 0 || ri > this.height - 1) {
            continue;
          }
          for (let ci = c - 1; ci <= c + 1; ci++) {
            if (ci < 0 || ci > this.width - 1) {
              continue;
            }
            if (ri == r && ci == c) {
              continue; // etsitään ympäröivien solujen määrää, solua itseään ei lasketa
            }
            if (this.canvas[ri][ci] == "o") {
              count++;
            }
          }
        }
        if (this.canSurvive(count) && this.isAlive(r, c)) {
          newCanvas[r][c] = "o"; // survive
        } else if (count == this.birth) {
          newCanvas[r][c] = "o"; // birth
        } else {
          newCanvas[r][c] = "b";
        }
      }
    }
    this.canvas = newCanvas.slice();
    this.height = this.canvas.length;
    this.width = this.canvas[0].length;
    this.cleanCanvas();
    return this;
  }

  cleanCanvas() {
    let bColumn = true;
    const bOnly = (value) => value == "b";
    let line = this.canvas[this.height - 1];
    // jos viimeisellä rivillä on pelkkää b:tä niin poistetaan (ehkä myös ekalla ?)
    if (line.every(bOnly)) {
      this.canvas.length -= 1;
      //this.canvas.pop();
      this.height -= 1;
    }

    for (let r = 0; r < this.canvas.length; r++) {
      if (this.canvas[r][this.width] != "b") {
        bColumn = false;
      }
    }
    if (bColumn) {
      for (let r = 0; r < this.canvas.length; r++) {
        line = this.canvas[r];
        line.length -= 1;
      }
    }
  }

  simulate(iterations) {
    for (let i = 0; i < iterations; i++) {
      this.tick();
      //console.log(this.draw());
    }
  }

  toString() {
    let res = "";
    for (let i = 0; i < this.height; i++) {
      res += this.canvas[i].join("") + "\n";
    }
    return res;
  }

  draw() {
    let res = "|" + this.toString().replace(/b/g, " ").replace(/\n/g, "|\n|");
    res = res.slice(0, res.length - 1);
    return res;
  }
}

/*let b = new Board(3, 3);
b.contentToCanvas(0, 0, "bbo$obo$boo!");
b.tick();*/
