import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import writeFile from "write-file";

describe("Conways game of life", () => {
  let b;

  beforeEach(() => {
    b = new Board();
  });

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
    console.log(b.draw());
    b.tick();
    b.tick();
    console.log(b.draw());
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
    console.log(b.draw());
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
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
    expect(b.toString()).to.equalShape(`obb
    boo
    oob`);
  });

  it("can be printed in RLE -format", () => {
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    console.log(b.draw());
    expect(b.asRLE()).to.equal("2bo$obo$b2o!");
  });

  it("more compact RLE output (clear ending 'b':s)", () => {
    b.contentToCanvas(0, 0, "bbb$oob$bob!");
    expect(b.toString()).to.equalShape(`bbb
    oob
    bob`);
    console.log(b.draw());
    expect(b.asRLE()).to.equal("$2o$bo!");
  });

  // laske kuvion vasen yläkulma R ja tallenna sijainti
  // palauta kuvio RLE -formaatissa : vasen yläkulma + pienin tarvitava alue

  it("glider moving 1 tick (small canvas, grow right+down)", () => {
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
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
    console.log(b.draw());
    b.simulate(4);
    console.log(b.draw());
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
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
    expect(b.toString()).to.equalShape(`obo
    boo
    bob`);
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(3);
  });

  it("can grow upwards (blink)", () => {
    b.contentToCanvas(0, 0, "3o!");
    expect(b.toString()).to.equalShape(`ooo`);
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
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
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
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
    console.log(b.draw());
    let b2 = new Board();
    b2.contentToCanvas(0, 0, a);
    b2.contentToCanvas(23, 9, "o$b2o$2o!");
    console.log(b2.draw());
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
    res = await b.run(filename, 5);
    expect(res).to.equal("o2b$b2o$2ob!");
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(3);
  })

  // G:/HY/conwayLife/blinker.rle
  // alussa kommenttirivit pois #
  // x = 3, y = 1, rule = B3/S23
  // 3o!
  // x = m, y = n
  // width , height
});
