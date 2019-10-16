var Tetrominoes = require("../saratetra.tetrominoes.js");

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

test("peek returns the next piece that will be popped", () => {
    var generator = new Tetrominoes.Generator();
    var peeked = generator.peek();
    var popped = generator.pop();
    expect(peeked).toBe(popped);
});

test("pop changes the next piece that will be peeked", () => {
    var generator = new Tetrominoes.Generator();
    var peek1 = generator.peek();
    generator.pop();
    var peek2 = generator.peek();
    expect(peek1).not.toBe(peek2);
});