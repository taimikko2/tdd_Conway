import { expect } from "chai";
import { Board } from "../src/Board.mjs";

describe("Create Board", () => {
  it("Create empty board", () => {
    let b = new Board(3, 3);
    expect(b.toString()).to.equalShape(`bbb
    bbb
    bbb`);
  });
});
