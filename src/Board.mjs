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

  constructor(w = 1, h = 1) {
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

  async run(filename, iterations) {
    await this.readRLE(filename);
    this.simulate(iterations);
    return this.asRLE();
  }

  async cleanContent(content) {
    let data = content.replace(/\r/gi,'').split("\n");
    let line = data[0].trim();
    let params;
    //console.log(data);

    while (line[0] == "#") {
      data.shift();
      line = data[0].trim();
    }
    // jätetäänkö x, y, rule ?
    if (line[0] == "x") {
      /** /
      params = line.split(",");
      let temp, vari, value;
      for (let i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        switch (temp[0].trim()[0]) {
          case "x":
            let x = Number(temp[1].trim());
            break;
          case "y":
            let y = Number(temp[1].trim());
            break;

          default:
            // rule
            let rule = temp[1].split("/");
            // B3/S23
            break;
        }
      }
      / **/
      data.shift();
    }
    data = data.join("");
    return data;
  }

  async readRLE(filename) {
    var content = readTextFile.readSync(filename);
    console.log("luettiin " + content + " " + content.length);
    content = await this.cleanContent(content);
    let h = 1;
    let w = 3;
    this.width = w;
    this.height = h;
    let res = "";
    let count = 1;
    this.canvas = new Array(h);
    for (let i = 0; i < this.height; i++) {
      this.canvas[i] = new Array(w);
    }
    this.contentToCanvas(0, 0, content);

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

  findCanvasWidth(content) {
    let count = 0;
    let c = 0;
    let maxLength = 0;
    let length = 0;
    for (let i = 0; i < content.length; i++) {
      try {
        if (content[i] in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
          c = Number(content[i]);
          count *= 10;
          count += c;
        } else {
          throw new Error(content[i] + " ei ole luku");
        }
      } catch (err) {
        if (content[i] == "!") {
          break;
        }
        if (content[i] == "$") {
          count = 0;
          c = 0;
          maxLength = Math.max(length, maxLength);
          length = 0;
          continue;
        }
        if (count == 0 && c == 0) {
          length += 1;
        } else {
          length += count;
        }
        count = 0;
        c = 0;
      }
    }
    maxLength = Math.max(length, maxLength);
    return maxLength;
  }

  contentToCanvas(x, y, content) {
    let count = 0;
    let c = 0;
    let xpos = x;
    let lines = content.split("$");
    lines = lines.length + y;
    let width = this.findCanvasWidth(content);
    this.width = Math.max(this.width, x + width);
    if (lines > this.canvas.length) {
      for (let i = this.canvas.length; i < lines; i++) {
        this.canvas[i] = new Array(this.width);
        this.canvas[i].fill("b");
      }
      this.height = lines;
    }
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

  enlargeCanvas() {
    let line = new Array(this.width);
    line.fill("b");
    this.canvas.unshift(line);
    this.height += 1;
    for (let i = 0; i < this.height; i++) {
      line = this.canvas[i];
      line.unshift("b");
    }
    this.width += 1;
  }

  tick() {
    this.enlargeCanvas();
    //console.log(this.canvas);
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
    let bColumn;
    const bOnly = (value) => value == "b";
    let line;

    line = this.canvas[0];
    while (line.every(bOnly)) {
      this.canvas.shift();
      this.height = this.canvas.length;
      line = this.canvas[0];
    }

    line = this.canvas[this.height - 1];
    while (line.every(bOnly)) {
      this.canvas.length -= 1;
      this.height = this.canvas.length;
      line = this.canvas[this.height - 1];
    }

    bColumn = true;
    while (bColumn) {
      for (let r = 0; r < this.canvas.length; r++) {
        if (this.canvas[r][this.width - 1] != "b") {
          bColumn = false;
        }
      }
      if (bColumn) {
        for (let r = 0; r < this.canvas.length; r++) {
          this.canvas[r].pop();
        }
        this.width = this.canvas[0].length;
      }
    }

    bColumn = true;
    while (bColumn) {
      for (let r = 0; r < this.canvas.length; r++) {
        if (this.canvas[r][0] != "b") {
          bColumn = false;
        }
      }
      if (bColumn) {
        for (let r = 0; r < this.canvas.length; r++) {
          this.canvas[r].shift();
        }
        this.width = this.canvas[0].length;
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

let b = new Board(1, 1);
let filename = "G:\\HY\\conwayLife\\glidertrain.rle";
let res = await b.run(filename, 30);
console.log(b.draw());

