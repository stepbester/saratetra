var Tetrominoes = require("./saratetra.tetromino.js");

/**
 * Saratetra tetromino generator class.
 */
module.exports = class TetrominoGenerator {
	constructor() {
		this.nextPiece = this.generatePiece();
	}
	generatePiece() {
		var luckyNumber = Math.floor(Math.random() * 7);
		var newPiece = null;
		switch (luckyNumber) {
			case 0:
				newPiece = new Tetrominoes.I();
				break;
			case 1:
				newPiece = new Tetrominoes.O();
				break;
			case 2:
				newPiece = new Tetrominoes.T();
				break;
			case 3:
				newPiece = new Tetrominoes.J();
				break;
			case 4:
				newPiece = new Tetrominoes.L();
				break;
			case 5:
				newPiece = new Tetrominoes.S();
				break;
			case 6:
				newPiece = new Tetrominoes.Z();
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