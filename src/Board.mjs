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
    console.log("luettiin "+content+" "+content.length);
    //let cont = content.split("\n");
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
    for (let i=0; i<content.length; i++) {
      try {
        if (content[i] in ["0","1","2","3","4","5","6","7","8","9"]) {
          count = Number(content[i]); // erikoistapauksena kaksinumeroinen luku ...
        } else {
          throw new Error(content[i]+" ei ole luku");
        }
      } catch (err) {
        if (content[i] == "!") {
          break;
        } 
        for (let j = 0; j<count; j++) {
          res += content[i];
          this.canvas[0].push(content[i]);
        }
        count = 1;
      }
    }
    //console.log("readRLE returning "+res)
    return this.toString()
    // alussa kommenttisirivit pois #
    // x = 3, y = 1, rule = B3/S23
    // 3o!
    // x = m, y = n
    // width , height
    //(`ooo`)
  }

  toString() {
    let res = "";
    for (let i = 0; i < this.height; i++) {
      res += this.canvas[i].join("") + "\n";
    }
    return res;
  }
}
