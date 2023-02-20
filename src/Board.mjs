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
    for (let i = 0; i < content.length; i++) {
      try {
        if (content[i] in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
          count = Number(content[i]); // erikoistapauksena kaksinumeroinen luku ...
        } else {
          throw new Error(content[i] + " ei ole luku");
        }
      } catch (err) {
        if (content[i] == "!") {
          break;
        }
        for (let j = 0; j < count; j++) {
          res += content[i];
          this.canvas[0].push(content[i]);
        }
        count = 1;
      }
    }
    //console.log("readRLE returning "+res)
    return this.toString();
    // alussa kommenttisirivit pois #
    // x = 3, y = 1, rule = B3/S23
    // 3o!
    // x = m, y = n
    // width , height
    //(`ooo`)
  }

  async addRLE(x, y, filename) {
    //console.log("addRLE(",x,",",y,",",filename,")");
    var content = readTextFile.readSync(filename);
    let count = 1;

    for (let i = 0; i < content.length; i++) {
      try {
        if (content[i] in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
          count = Number(content[i]); // erikoistapauksena kaksinumeroinen luku ...
        } else {
          throw new Error(content[i] + " ei ole luku");
        }
      } catch (err) {
        if (content[i] == "!") {
          break;
        }
        for (let j = 0; j < count; j++) {
          this.canvas[y][x+j] = content[i];
        }
        count = 1;
      }
    }
    return this.toString();
  }

  tick() {
    let newCanvas = new Array(this.height);
    for (let i=0; i< this.height; i++) {
      newCanvas[i] = new Array(this.width);
    }
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        let count = 0; 
        for (let ri = r-1; ri <= r+1; ri++) {
          if (ri < 0 || ri>this.height-1) {
            continue;
          }
          for (let ci = c-1; ci <= c+1; ci++) {
            if (ci < 0 || ci>this.width-1) {
              continue;
            }  
            if (this.canvas[ri][ci] == "o") {
              count ++;
            }
          }
        }
        if (count in(this.survive) && this.canvas[r][c] == "o") {
          newCanvas[r][c] = "o"; // survive
        } else if (count == this.birth) {
          newCanvas[r][c] = "o"; // birth
        } else {
          newCanvas[r][c] = "b"; 
        }
      }
    }
    this.canvas = newCanvas.slice();
    return this
  }

  toString() {
    let res = "";
    for (let i = 0; i < this.height; i++) {
      res += this.canvas[i].join("") + "\n";
    }
    return res;
  }
}
