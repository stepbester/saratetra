var Colours = require("./saratetra.blockColours.js").Colours;

/**
 * Saratetra tetromino class.
 */
class Tetromino {
	constructor() {
		this.key = null;
		this.colour = null;
		this.orientation = 0;
		this.rotatable = false;
		this.columns = 3;
		this.rows = 3;
	}
	getBlocks() {
		return [];
	}
	draw(renderer, x, y, scale = 1) {
		var blocks = this.getBlocks();
		renderer.drawBlocks(x, y, blocks, this.colour, scale);
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
		this.key = "i";
		this.rotatable = true;
		this.rows = 4;
		this.columns = 4;
		this.colour = Colours.Red;
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
		this.key = "o";
		this.rotatable = false;
		this.columns = 4;
		this.rows = 3;
		this.colour = Colours.Blue;
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
		this.key = "t";
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = Colours.Orange;
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
		this.key = "j";
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = Colours.Yellow;
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
		this.key = "l";
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = Colours.Purple;
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
		this.key = "s";
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = Colours.Green;
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
		this.key = "z";
		this.rotatable = true;
		this.columns = 3;
		this.rows = 3;
		this.colour = Colours.Cyan;
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

module.exports = {
	I: I,
	O: O,
	T: T,
	J: J,
	L: L,
	S: S,
	Z: Z
};