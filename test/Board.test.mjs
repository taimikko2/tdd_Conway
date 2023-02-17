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
      if (err) return console.log("===? "+err)

      console.log("Wrote file "+filename);
    });
    b = await b.readRLE(filename);
    // 3o! -> 'ooo'
    expect(b.toString()).to.equalShape(`ooo`);
  });

  // G:/HY/conwayLife/blinker.rle
  // alussa kommenttisirivit pois #
  // x = 3, y = 1, rule = B3/S23
  // 3o!
  // x = m, y = n
  // width , height
});
