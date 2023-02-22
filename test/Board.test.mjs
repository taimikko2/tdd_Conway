import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import writeFile from "write-file";
import { normalize } from "./testing.mjs";

describe("Conways game of life", () => {
  let b;

  beforeEach(() => {
    b = new Board();
  });
  /*
  it("Create empty board", () => {
    let b2 = new Board(3, 3);
    expect(b2.toString()).to.equalShape(`bbb
    bbb
    bbb`);
  });

  it("Read simple RLE file '3o!' -> 'ooo' ", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test_3o.rle";
    writeFile(filename, "3o!", function (err) {
      if (err)
        return console.log("===? " + err);

      console.log("Wrote file " + filename);
    });
    b = await b.readRLE(filename);
    // 3o! -> 'ooo'
    expect(b.toString()).to.equalShape(`ooo`);
  });

  it("has a rule (B3/S23)", () => {
    expect(b.birth).to.be.equal(3);
    let a = [2, 3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
  });

  it("can change state (tick)", () => {
    b.contentToCanvas(0, 0, "3o!");
    expect(b.toString()).to.equalShape(`ooo`);
    expect(b.birth).to.be.equal(3);
    let a = [2, 3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
    b.tick();
    expect(b.toString()).to.equalShape(`o
    o
    o`);
  });

  it("tick twice brings blinker back to original state", () => {
    b.contentToCanvas(0, 0, "3o!");
    expect(b.toString()).to.equalShape(`ooo`);
    //console.log(b.draw());
    b.tick();
    b.tick();
    //console.log(b.draw());
    expect(b.width).equal(3);
    expect(b.height).equal(1);
    expect(b.toString()).to.equalShape(`ooo`);
  });

  it("can simulate number of iterations", async () => {
    b.contentToCanvas(0, 0, "3o!");
    expect(b.toString()).to.equalShape(`ooo`);
    expect(b.birth).to.be.equal(3);
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
    //console.log(b.draw());
    b.simulate(3);
    expect(b.toString()).to.equalShape(`o
    o
    o`);
  });

  it("can draw canvas to screen", () => {
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    expect(b.draw()).to.equal(`|  o|\n|o o|\n| oo|\n`);
  });

  it("glider 1 tick", () => {
    b.contentToCanvas(1, 1, "bbo$obo$boo!");
    //console.log(b.draw());
    b.tick();
    //console.log(b.draw());
    expect(b.toString()).to.equalShape(`obb
    boo
    oob`);
  });

  it("can be printed in RLE -format", () => {
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    //console.log(b.draw());
    expect(b.asRLE()).to.equal("2bo$obo$b2o!");
  });

  it("more compact RLE output (clear ending 'b':s)", () => {
    b.contentToCanvas(0, 0, "bbb$oob$bob!");
    expect(b.toString()).to.equalShape(`bbb
    oob
    bob`);
    //console.log(b.draw());
    expect(b.asRLE()).to.equal("$2o$bo!");
  });

  // laske kuvion vasen yläkulma R ja tallenna sijainti
  // palauta kuvio RLE -formaatissa : vasen yläkulma + pienin tarvitava alue

  it("glider moving 1 tick (small canvas, grow right+down)", () => {
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    //console.log(b.draw());
    b.tick();
    //console.log(b.draw());
    expect(b.toString()).to.equalShape(`obb
    boo
    oob`);
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(3);
  });

  it("glider simulate 4 equals original", () => {
    b.contentToCanvas(0, 0, "2bo$obo$b2o!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    //console.log(b.draw());
    b.simulate(4);
    //console.log(b.draw());
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    expect(b.asRLE()).to.equal("2bo$obo$b2o!");
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(3);
  });

  it("glider moving 3 ticks (remove top line and left column)", () => {
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    b.tick();
    b.tick();
    b.tick();
    expect(b.toString()).to.equalShape(`obo
    boo
    bob`);
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(3);
  });

  it("can grow upwards (blink)", () => {
    b.contentToCanvas(0, 0, "3o!");
    expect(b.toString()).to.equalShape(`ooo`);
    //console.log(b.draw());
    b.tick();
    //console.log(b.draw());
    expect(b.width).equal(1);
    expect(b.height).equal(3);
    expect(b.toString()).to.equalShape(`o
    o
    o`);
  });

  it("can grow left (blink)", () => {
    b.contentToCanvas(0, 0, "o$o$o!");
    expect(b.toString()).to.equalShape(`o
    o
    o`);
    //console.log(b.draw());
    b.tick();
    //console.log(b.draw());
    expect(b.width).equal(3);
    expect(b.height).equal(1);
    expect(b.toString()).to.equalShape(`ooo`);
  });

  it("constructor default size (1,1)", () => {
    expect(b.height).equal(1);
    expect(b.width).equal(1);
    expect(b.toString()).to.equalShape(`b`);
  });

  it("glider gun 30 creates glider", () => {
    let a;
    b.contentToCanvas(
      0,
      0,
      "24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8bo3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!"
    );
    a = b.asRLE();
    b.simulate(30);
    //console.log(b.draw());
    let b2 = new Board();
    b2.contentToCanvas(0, 0, a);
    b2.contentToCanvas(23, 9, "o$b2o$2o!");
    //console.log(b2.draw());
    expect(b.toString()).to.equalShape(b2.toString());
    expect(b.asRLE()).to.equal(b2.asRLE());
  });

  it("can read a file, iterate and output result", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test_glider.rle";
    writeFile(filename, "2bo$obo$b2o!", function (err) {
      if (err)
        return console.log("===? " + err);

      console.log("Wrote file " + filename);
    });
    let res = await b.run(filename, 5);
    expect(res).to.equal("o$b2o$2o!");
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(3);
  })
*/
  xit("can read file, pass comments '#' and pass 'x,y,rule'", async () => {
    let filename = "G:\\HY\\conwayLife\\blinker.rle";
    let res = await b.run(filename, 1);
    //console.log(b.draw());
    expect(res).to.equal("o$o$o!");
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(1);
  });

  it("can read complex file, pass comments '#' and pass 'x,y,rule'", async () => {
    let filename = "G:\\HY\\conwayLife\\glidertrain.rle";
    let res = await b.run(filename, 0);
    console.log(b.draw());
    console.log(b.asRLE());
    console.log(b.height, b.width);
    expect(normalize(res)).to.equal(normalize(
      `32b2o$31b2o$33bo17b6o6b2o$50bo5bo4bo4bo$56bo10bo$26b5o19bo4bo5bo5bo$\
      25bo4bo21b2o8b6o$30bo$18b2o5bo3bo23bo$18b2o7bo24bobo$14b3o4bo29bo5bo$\
      13bob2o5b2o11b2o15bobobobo6bo$b2o9b2obobo3b2o11bo2bo13b2o2bo3bo5b2o$o\
      2bo9b6o9b2o4bobo7b2o5b2o3b2obo4bob2o$b2o11b4o10b2o5bo8b2o7bo5bo4bobo$\
      50bobo11b2o$50bobo11b2o$b2o11b4o10b2o5bo8b2o7bo5bo4bobo$o2bo9b6o9b2o\
      4bobo7b2o5b2o3b2obo4bob2o$b2o9b2obobo3b2o11bo2bo13b2o2bo3bo5b2o$13bob\
      2o5b2o11b2o15bobobobo6bo$14b3o4bo29bo5bo$18b2o7bo24bobo$18b2o5bo3bo23b\
      o$30bo$25bo4bo21b2o8b6o$26b5o19bo4bo5bo5bo$56bo10bo$50bo5bo4bo4bo$33bo\
      17b6o6b2o$31b2o$32b2o!`)
    );
    expect(b.height).to.equal(32);
    expect(b.width).to.equal(68);
  });
  // alussa kommenttirivit pois #
  // x = 3, y = 1, rule = B3/S23
  // x = m, y = n
  // width , height
});
