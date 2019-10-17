var Tetrominoes = require("../saratetra.tetromino.js");

test("rotatable tetromino 'I' has 4 orientations", () => {
    var i = new Tetrominoes.I();
    expect(i.orientation).toBe(0);
    i.rotate();
    expect(i.orientation).toBe(1);
    i.rotate();
    expect(i.orientation).toBe(2);
    i.rotate();
    expect(i.orientation).toBe(3);
    i.rotate();
    expect(i.orientation).toBe(0);
});

test("unrotatable tetromino 'O' has only 1 orientation", () => {
    var o = new Tetrominoes.O();
    expect(o.orientation).toBe(0);
    o.rotate();
    expect(o.orientation).toBe(0);
});