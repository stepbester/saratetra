/**
 * Generic function for drawing a block.
 * TODO: Move this function to a more sensible place.
 */
function drawBlock(context, x, y, blockColour) {
	// Back
	context.fillStyle = blockColour.back;
	context.fillRect(x, y, BLOCK_WIDTH, BLOCK_WIDTH);

	// Front
	context.fillStyle = blockColour.front;
	context.fillRect(x + 1, y + 1, BLOCK_WIDTH - 2, BLOCK_HEIGHT - 2);

	// Shine
	context.fillStyle = blockColour.shine;
	context.fillRect(x + 0.6 * BLOCK_WIDTH, y + 0.1 * BLOCK_HEIGHT, 0.25 * BLOCK_WIDTH, 0.25 * BLOCK_HEIGHT);
}

/**
 * Tetromino block colour scheme class.
 */
class BlockColour {
	constructor(front, back, shine) {
		this.front = front;
		this.back = back;
		this.shine = shine;
	}
}

/**
 * Seratetra standard colours.
 */
var BLOCK_RED = new BlockColour("#ff0033", "#cc0000", "#ff6699");
var BLOCK_BLUE = new BlockColour("#1e90ff", "#0b60cc", "#7ff6ff");
var BLOCK_ORANGE = new BlockColour("#ff8800", "#cc5500", "#ffee66");
var BLOCK_YELLOW = new BlockColour("#ffd700", "#cca400", "#fffd66");
var BLOCK_PURPLE = new BlockColour("#da70d6", "#a740a3", "#ffd6fc");
var BLOCK_GREEN = new BlockColour("#00ff44", "#00cc11", "#99ffaa"); // breaking the rules on the shine colour 
// because otherwise it's too blue
var BLOCK_CYAN = new BlockColour("#b0e0e6", "#7dadb3", "#f6f6fc");

/**
 * Saratetra tetromino class.
 */
class Tetromino {
	constructor() {
		this.colour = null;
		this.orientation = 0;
		this.rotatable = false;
		this.columns = 3;
		this.rows = 3;
	}
	getBlocks() {
		return [];
	}
	draw(context, x, y) {
		var blocks = this.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			drawBlock(context, x + ((blocks[i].colOffset - 1) * BLOCK_WIDTH), y + ((blocks[i].rowOffset - 1) * BLOCK_HEIGHT), this.colour);
		}
	}
	rotate() {
		if (this.rotatable) {
			if (this.orientation < 3) {
				this.orientation++;
			} else {
				this.orientation = 0;
			}
		}
	}
}

/**
 * Saratetra "I" tetromino class.
 */
class I extends Tetromino {
	constructor() {
		super();
		this.rotatable = true;
		this.rows = 4;
		this.columns = 4;
		this.colour = BLOCK_RED;
	}
	getBlocks() {
		switch (this.orientation) {
			case 0:
				/*
				    ` ` ` `
				    X X X X
				    ` ` ` `
				    ` ` ` `
				*/
				return [{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: 2,
						rowOffset: 0
					}
				];
				break;
			case 1:
				/*
				    ` ` X `
				    ` ` X `
				    ` ` X `
				    ` ` X `
				*/
				return [{
						colOffset: 1,
						rowOffset: -1
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 1
					},
					{
						colOffset: 1,
						rowOffset: 2
					}
				];
				break;
			case 2:
				/*
				    ` ` ` `
				    ` ` ` `
				    X X X X
				    ` ` ` `
				*/
				return [{
						colOffset: -1,
						rowOffset: 1
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: 1,
						rowOffset: 1
					},
					{
						colOffset: 2,
						rowOffset: 1
					}
				];
				break;
			case 3:
				/*
				    ` X ` `
				    ` X ` `
				    ` X ` `
				    ` X ` `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: 0,
						rowOffset: 2
					}
				];
				break;
		}
	}
}

/**
 * Saratetra "O" tetromino class.
 */
class O extends Tetromino {
	constructor() {
		super();
		this.rotatable = false;
		this.columns = 4;
		this.rows = 3;
		this.colour = BLOCK_BLUE;
	}
	getBlocks() {
		/*
		    ` X X `
		    ` X X `
		    ` ` ` `
		*/
		return [{
				colOffset: 0,
				rowOffset: -1
			},
			{
				colOffset: 0,
				rowOffset: 0
			},
			{
				colOffset: 1,
				rowOffset: -1
			},
			{
				colOffset: 1,
				rowOffset: 0
			}
		];
	}
}

/**
 * Saratetra "T" tetromino class.
 */
class T extends Tetromino {
	constructor() {
		super();
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = BLOCK_ORANGE;
	}
	getBlocks() {
		switch (this.orientation) {
			case 0:
				/*
				    ` X `
				    X X X
				    ` ` `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					}
				];
				break;
			case 1:
				/*
				    ` X `
				    ` X X
				    ` X `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: 1,
						rowOffset: 0
					}
				];
				break;
			case 2:
				/*
				    ` ` `
				    X X X
				    ` X `
				*/
				return [{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					}
				];
				break;
			case 3:
				/*
				    ` X `
				    X X `
				    ` X `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: -1,
						rowOffset: 0
					}
				];
				break;
		}
	}
}

/**
 * Saratetra "J" tetromino class.
 */
class J extends Tetromino {
	constructor() {
		super();
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = BLOCK_YELLOW;
	}
	getBlocks() {
		switch (this.orientation) {
			case 0:
				/*
				    X ` `
				    X X X
				    ` ` `
				*/
				return [{
						colOffset: -1,
						rowOffset: -1
					},
					{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					}
				];
				break;
			case 1:
				/*
				    ` X X
				    ` X `
				    ` X `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: 1,
						rowOffset: -1
					}
				];
				break;
			case 2:
				/*
				    ` ` `
				    X X X
				    ` ` X
				*/
				return [{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 1
					}
				];
				break;
			case 3:
				/*
				    ` X `
				    ` X `
				    X X `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: -1,
						rowOffset: 1
					}
				];
				break;
		}
	}
}

/**
 * Saratetra "L" tetromino class.
 */
class L extends Tetromino {
	constructor() {
		super();
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = BLOCK_PURPLE;
	}
	getBlocks() {
		switch (this.orientation) {
			case 0:
				/*
				    ` ` X
				    X X X
				    ` ` `
				*/
				return [{
						colOffset: 1,
						rowOffset: -1
					},
					{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					}
				];
				break;
			case 1:
				/*
				    ` X `
				    ` X `
				    ` X X
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: 1,
						rowOffset: 1
					}
				];
				break;
			case 2:
				/*
				    ` ` `
				    X X X
				    X ` `
				*/
				return [{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: -1,
						rowOffset: 1
					}
				];
				break;
			case 3:
				/*
				    X X `
				    ` X `
				    ` X `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: -1,
						rowOffset: -1
					}
				];
				break;
		}
	}
}

/**
 * Saratetra "S" tetromino class.
 */
class S extends Tetromino {
	constructor() {
		super();
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = BLOCK_GREEN;
	}
	getBlocks() {
		switch (this.orientation) {
			case 0:
				/*
				    ` X X
				    X X `
				    ` ` `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 1,
						rowOffset: -1
					},
					{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					}
				];
				break;
			case 1:
				/*
				    ` X `
				    ` X X
				    ` ` X
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 1
					}
				];
				break;
			case 2:
				/*
				    ` ` `
				    ` X X
				    X X `
				*/
				return [{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: -1,
						rowOffset: 1
					},
					{
						colOffset: 0,
						rowOffset: 1
					}
				];
				break;
			case 3:
				/*
				    X ` `
				    X X `
				    ` X `
				*/
				return [{
						colOffset: -1,
						rowOffset: -1
					},
					{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					}
				];
				break;
		}
	}
}

/**
 * Saratetra "Z" tetromino class.
 */
class Z extends Tetromino {
	constructor() {
		super();
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = BLOCK_CYAN;
	}
	getBlocks() {
		switch (this.orientation) {
			case 0:
				/*
				    X X `
				    ` X X
				    ` ` `
				*/
				return [{
						colOffset: -1,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					}
				];
				break;
			case 1:
				/*
				    ` ` X
				    ` X X
				    ` X `
				*/
				return [{
						colOffset: 1,
						rowOffset: -1
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					}
				];
				break;
			case 2:
				/*
				    ` ` `
				    X X `
				    ` X X
				*/
				return [{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 1
					},
					{
						colOffset: 1,
						rowOffset: 1
					}
				];
				break;
			case 3:
				/*
				    ` X `
				    X X `
				    X ` `
				*/
				return [{
						colOffset: 0,
						rowOffset: -1
					},
					{
						colOffset: -1,
						rowOffset: 0
					},
					{
						colOffset: 0,
						rowOffset: 0
					},
					{
						colOffset: -1,
						rowOffset: 1
					}
				];
				break;
		}
	}
}

/**
 * Saratetra tetromino generator class.
 */
class TetrominoGenerator {
	constructor() {
		this.nextPiece = this.generatePiece();
	}
	generatePiece() {
		var luckyNumber = Math.floor(Math.random() * 7);
		var newPiece = null;
		switch (luckyNumber) {
			case 0:
				newPiece = new I();
				break;
			case 1:
				newPiece = new O();
				break;
			case 2:
				newPiece = new T();
				break;
			case 3:
				newPiece = new J();
				break;
			case 4:
				newPiece = new L();
				break;
			case 5:
				newPiece = new S();
				break;
			case 6:
				newPiece = new Z();
				break;
		}
		return newPiece;
	}
	peek() {
		return this.nextPiece;
	}
	pop() {
		var returnPiece = this.nextPiece;
		this.nextPiece = this.generatePiece();
		return returnPiece;
	}
}