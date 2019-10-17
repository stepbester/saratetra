var TetrominoGenerator = require("../saratetra.generator.js");

test("peek() returns the next piece that will be popped", () => {
    var generator = new TetrominoGenerator();
    var peeked = generator.peek();
    var popped = generator.pop();
    expect(peeked).toBe(popped);
});

test("pop() changes the next piece that will be peeked", () => {
    var generator = new TetrominoGenerator();
    var peek1 = generator.peek();
    generator.pop();
    var peek2 = generator.peek();
    expect(peek1).not.toBe(peek2);
});