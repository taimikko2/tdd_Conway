import { expect } from "chai";
import { Board } from "../src/Board.mjs";

describe("Create Board", () => {
  it("Create empty board", () => {
    let b = new Board(3, 3);
    expect(b.toString()).to.equalShape(`bbb
    bbb
    bbb`);
  });

  it("Read RLE file", () => {
    let b = new Board(1,1);
    b.readRLE("G:/HY/conwayLife/blinker.rle")
    // alussa kommenttisirivit pois #
    // x = 3, y = 1, rule = B3/S23
    // 3o!
    // x = m, y = n
    // width , height
    expect(b.toString()).to.equalShape(`ooo`)
  })
});
