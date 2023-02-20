import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import writeFile from "write-file";

describe("Create Board", () => {
  xit("Create empty board", () => {
    let b = new Board(3, 3);
    expect(b.toString()).to.equalShape(`bbb
    bbb
    bbb`);
  });

  xit("Read simple RLE file '3o!' -> 'ooo' ", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test_3o.rle";
    let b = new Board(1, 1);
    // kirjoita tiedosto, jossa on yksi rivi "3o!" ja lue se
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    b = await b.readRLE(filename);
    // 3o! -> 'ooo'
    expect(b.toString()).to.equalShape(`ooo`);
  });

  it("Read longer RLE file '12b3o!' -> 'bbbbbbbbbbbbooo' ", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\testRLE_12b3o.rle";
    let b = new Board(1, 1);
    await writeFile(filename, "12b3o!", function (err) {
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    b = await b.readRLE(filename);
    expect(b.toString()).to.equalShape(`bbbbbbbbbbbbooo`);
  });
/*
  it("has a rule (B3/S23)", () => {
    let b = new Board(3,3);
    expect(b.birth).to.be.equal(3);
    let a = [2,3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
  })

  it("can add blinker to bigger board", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test2_3o.rle";
    let b = new Board(5, 5);
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    bbbbb
    bbbbb    
    bbbbb`);
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    await b.addRLE(1,2,filename);
    // 3o! -> 'ooo'
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    booob
    bbbbb    
    bbbbb`);
    expect(b.birth).to.be.equal(3);
    let a = [2,3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
  })

  it("can change state (tick)", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test2_3o.rle";
    let b = new Board(5, 5);
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    await b.addRLE(1,2,filename);
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    booob
    bbbbb    
    bbbbb`);
    expect(b.birth).to.be.equal(3);
    let a = [2,3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
    b.tick();
    expect(b.toString()).to.equalShape(`bbbbb
    bbobb
    bbobb
    bbobb    
    bbbbb`);
    
  })

  it("tick twice brings blinker back to original state", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test3_3o.rle";
    let b = new Board(5, 5);
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    await b.addRLE(1,2,filename);
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    booob
    bbbbb    
    bbbbb`);
    expect(b.birth).to.be.equal(3);
    let a = [2,3];
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
    b.tick();
    b.tick();
    expect(b.toString()).to.equalShape(`bbbbb
    bbbbb
    booob
    bbbbb    
    bbbbb`);
  })

  it("can simulate number of iterations", async () => {
    const filename = "G:\\HY\\tdd\\tdd_Conway\\test4_3o.rle";
    let b = new Board(5, 5);
    await writeFile(filename, "3o!", function (err) {
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    await b.addRLE(1,2,filename);
    expect(b.birth).to.be.equal(3);
    expect(b.survive.length).to.be.equal(2);
    expect(b.survive[0]).to.be.equal(2);
    expect(b.survive[1]).to.be.equal(3);
    b.simulate(3);
    expect(b.toString()).to.equalShape(`bbbbb
    bbobb
    bbobb
    bbobb    
    bbbbb`);
  })
*/
  // G:/HY/conwayLife/blinker.rle
  // alussa kommenttisirivit pois #
  // x = 3, y = 1, rule = B3/S23
  // 3o!
  // x = m, y = n
  // width , height
});
