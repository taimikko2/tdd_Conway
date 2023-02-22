import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import writeFile from "write-file";

describe("Create Board", () => {
  it("Create empty board", () => {
    let b = new Board(3, 3);
    expect(b.toString()).to.equalShape(`bbb
    bbb
    bbb`);
  });

  it("Read simple RLE file '3o!' -> 'ooo' ", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test_3o.rle";
    let b = new Board(1, 1);
    // kirjoita tiedosto, jossa on yksi rivi "3o!" ja lue se
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? " + err);

      console.log("Wrote file " + filename);
    });
    b = await b.readRLE(filename);
    // 3o! -> 'ooo'
    expect(b.toString()).to.equalShape(`ooo`);
  });

  it("Read longer RLE file '12b3o!' -> 'bbbbbbbbbbbbooo' ", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\testRLE_12b3o.rle";
    let b = new Board(1, 1);
    await writeFile(filename, "12b3o!", function (err) {
      if (err) return console.log("===? " + err);

      console.log("Wrote file " + filename);
    });
    b = await b.readRLE(filename);
    expect(b.toString()).to.equalShape(`bbbbbbbbbbbbooo`);
  });

  it("End of line is $ and after it there is only b", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\testRLE_12b3o.rle";
    let b = new Board(12, 3);
    b.contentToCanvas(0, 0, "obo$11o$o!");
    expect(b.toString()).to.equalShape(`obobbbbbbbbb
    ooooooooooob
    obbbbbbbbbbb`);
  });

  it("has a rule (B3/S23)", () => {
    let b = new Board(3, 3);
    expect(b.birth).to.be.equal(3);
    let a = [2, 3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
  });

  it("can add blinker to bigger board", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test2_3o.rle";
    let b = new Board(5, 5);
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    bbbbb
    bbbbb    
    bbbbb`);
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? " + err);

      console.log("Wrote file " + filename);
    });
    await b.addRLE(1, 2, filename);
    // 3o! -> 'ooo'
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    booob
    bbbbb    
    bbbbb`);
    expect(b.birth).to.be.equal(3);
    let a = [2, 3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
  });

  it("can change state (tick)", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test2_3o.rle";
    let b = new Board(3, 3);
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? " + err);

      console.log("Wrote file " + filename);
    });
    await b.addRLE(0, 1, filename);
    expect(b.toString()).to.equalShape(`bbb
    ooo
    bbb`);
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
    let b = new Board(1, 1);
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
    let b = new Board(1, 1);
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
    let b = new Board(3, 3);
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
  obo
  boo`);
    expect(b.draw()).to.equal(`|  o|\n|o o|\n| oo|\n`);
  });

  it("glider 1 tick big canvas", () => {
    let b = new Board(5, 5);
    b.contentToCanvas(1, 1, "bbo$obo$boo!");
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
    expect(b.toString()).to.equalShape(`obb
    boo
    oob`);
  });

  it("can be printed in RLE -format", () => {
    let b = new Board(3, 3);
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    console.log(b.draw());
    expect(b.asRLE()).to.equal("2bo$obo$b2o!");
  });

  it("more compact RLE output (clear ending 'b':s)", () => {
    let b = new Board(3, 3);
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
    let b = new Board(3, 3);
    b.contentToCanvas(0, 0, "bbo$obo$boo!");
    expect(b.toString()).to.equalShape(`bbo
    obo
    boo`);
    console.log(b.draw());
    b.tick();
    console.log(b.draw());
    expect(b.toString()).to.equalShape(`bobb
    bboo
    boob`);
    expect(b.height).to.equal(3);
    expect(b.width).to.equal(4);
  });

  it("glider simulate 4 equals original", () => {
    let b = new Board(1, 1); // too small board -> grow ?
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

  xit("glider moving 3 ticks (remove top line and left column)", () => {
    let b = new Board(3, 3);
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
    let b = new Board(1, 1);
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
    let b = new Board(1, 1);
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

  // G:/HY/conwayLife/blinker.rle
  // alussa kommenttirivit pois #
  // x = 3, y = 1, rule = B3/S23
  // 3o!
  // x = m, y = n
  // width , height
});
