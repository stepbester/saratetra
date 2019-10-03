var Colours = require("./saratetra.blockColours.js").Colours;

/**
 * Saratetra debris block class.
 */
class DebrisBlock {
	constructor(blockColour) {
		this.blockColour = blockColour;
	}
}

/**
 * Saratetra well state enumerate.
 */
var WellState = Object.freeze({
	PIECE_FALLING: 1,
	PIECE_STUCK: 2,
	PENDING_NEXT_PIECE: 3,
	CLEARING_ROWS: 4,
	GAME_ENDING: 5,
	GAME_OVER: 6
});

/**
 * Colour composition of the game over rainbow. :-)
 */
var GameOverColours = [
	Colours.Red,
	Colours.Blue,
	Colours.Orange,
	Colours.Yellow,
	Colours.Purple,
	Colours.Green,
	Colours.Cyan,
	Colours.Red,
	Colours.Blue,
	Colours.Orange
];

/**
 * Saratetra well class.
 */
class Well {
	constructor() {
		this.state = WellState.GAME_OVER;
		this.rows = 20;
		this.columns = 10;
		this.fallingPiece = null;
		this.fallingCol = 5;
		this.fallingRow = 2;
		this.debris = new Array(this.columns);
		for (var i = 0; i < this.columns; i++) {
			this.debris[i] = new Array(this.rows);
		}
		this.rowsToClear = [];
		this.gameOverStep = 0;
	}
	// clear(): Clear the well of falling blocks and debris.
	clear() {
		this.fallingPiece = null;
		for (var x = 0; x < this.debris.length; x++) {
			for (var y = 0; y < this.debris[x].length; y++) {
				this.debris[x][y] = null;
			}
		}
	}
	// draw(): Draw the well and its contents.
	draw(renderer) {
		renderer.drawWell(this.rows, this.columns, this.debris, 
			this.fallingCol, this.fallingRow, this.fallingPiece, 
			this.rowsToClear, this.state, this.gameOverStep);
	}
	// applyGravity(): Lower falling piece.
	applyGravity() {
		if (this.fallingPiece) {
			if (this.collidesBelow(this.fallingCol, this.fallingRow, this.fallingPiece)) {
				// Register that piece has become stuck
				this.state = WellState.PIECE_STUCK;
				return;
			}
			// No collision, so lower piece
			this.dropPiece();
		}
	}
	// animateEnding(): Display a step of the ending animation.
	animateEnding(step) {
		this.gameOverStep = step;
		if (step == 10) {
			this.state = WellState.GAME_OVER;
		}
	}
	// freezePiece(): Convert the falling piece to debris blocks.
	freezePiece() {
		// Create debris
		var blocks = this.fallingPiece.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			this.debris[this.fallingCol + blocks[i].colOffset - 1][this.fallingRow + blocks[i].rowOffset - 1] =
				new DebrisBlock(this.fallingPiece.colour);
		}

		// Kill piece
		this.fallingPiece = null;

		// Register that well is ready for next piece
		this.state = WellState.PENDING_NEXT_PIECE;
	}
	// eliminateRows(): Find and destroy rows.
	eliminateRows() {
		// Find rows from the bottom up
		for (var row = this.rows - 1; row >= 0; row--) {
			var goodRow = true;
			for (var col = 0; col < this.columns; col++) {
				var block = this.debris[col][row];

				// Stop looking on empty block
				if (block == null) {
					goodRow = false;
					break;
				}
			}
			// Remember good rows
			if (goodRow) {
				this.rowsToClear.push(row);
			}
		}
		// Register that rows are being cleared
		if (this.rowsToClear.length > 0) {
			this.state = WellState.CLEARING_ROWS;
		}
	}
	// getClearRowCount(): Return the number of rows to clear.
	getClearRowCount() {
		return this.rowsToClear.length;
	}
	// collapseDebris: Remove cleared rows and collapse the remains.
	collapseDebris() {
		if (this.rowsToClear.length > 0) {
			// Start at the lowest clear row and collapse them all one by one
			for (var i = 0; i < this.rowsToClear.length; i++) {
				var clearRow = this.rowsToClear[i];

				// Cascade rows from bottom up
				for (var row = clearRow; row > 0; row--) {
					for (var col = 0; col < this.columns; col++) {
						// Get top block
						var topBlock = this.debris[col][row - 1];

						// Replace bottom block with top block
						this.debris[col][row] = topBlock;
					}
				}

				// Adjust remaining rows to clear
				for (var rowLeft = i + 1; rowLeft < this.rowsToClear.length; rowLeft++) {
					this.rowsToClear[rowLeft]++;
				}
			}

			// Clear top-most row
			for (var col = 0; col < this.columns; col++) {
				this.debris[col][row] = null;
			}
		}

		// No more rows to clear
		this.rowsToClear = [];

		// Register that the rows have been cleared
		this.state = WellState.PENDING_NEXT_PIECE;
	}
	// insertPiece(): Drop a new tetromino into the well.
	insertPiece(tetromino) {
		// Position the piece
		this.fallingPiece = tetromino;
		this.fallingCol = 5;
		this.fallingRow = 2;

		// Register that piece is falling
		this.state = WellState.PIECE_FALLING;
	}
	// isLandingClear(): Check whether the landing space for new pieces is clear.
	isLandingClear(nextPiece) {
		return !this.overlaps(5, 2, nextPiece);
	}
	// endGame(): End the current game.
	endGame() {
		this.state = WellState.GAME_ENDING;
	}
	// dropPiece(): Attempt to lower the falling piece.
	dropPiece() {
		if (this.fallingPiece) {
			// Check collisions
			if (this.collidesBelow(this.fallingCol, this.fallingRow, this.fallingPiece)) {
				// Register that the piece has become stuck
				this.state = WellState.PIECE_STUCK;
				return;
			}

			// No collision, so lower piece
			this.fallingRow++;
		}
	}
	// rotatePiece(): Attempt to rotate the falling piece.
	rotatePiece() {
		// Can only move in the falling phase
		if (this.state != WellState.PIECE_FALLING) {
			return;
		}

		if (this.fallingPiece) {
			// Do not rotate an unrotatable piece (lol)
			if (!this.fallingPiece.rotatable) {
				return;
			}
			var allowRotate = true;

			// Temporarily rotate for overlap check
			var oldOrientation = this.fallingPiece.orientation;
			this.fallingPiece.rotate();
			if (this.overlaps(this.fallingCol, this.fallingRow, this.fallingPiece)) {
				allowRotate = false;
			}

			// Revert rotation
			this.fallingPiece.orientation = oldOrientation;

			// Rotate or don't depending on outcome
			if (allowRotate) {
				this.fallingPiece.rotate();
			}
		}
	}
	// steerPieceLeft(): Attempt to move the falling piece to the left.
	steerPieceLeft() {
		// Can only move in the falling phase
		if (this.state != WellState.PIECE_FALLING) {
			return;
		}
		if (this.fallingPiece) {
			// Check collisions
			if (this.collidesLeft(this.fallingCol, this.fallingRow, this.fallingPiece)) {
				return;
			}
			this.fallingCol--;
		}
	}
	// steerPieceRight(): Attempt to move the falling piece to the right.
	steerPieceRight() {
		// Can only move in the falling phase
		if (this.state != WellState.PIECE_FALLING) {
			return;
		}
		if (this.fallingPiece) {
			// Check collisions
			if (this.collidesRight(this.fallingCol, this.fallingRow, this.fallingPiece)) {
				return;
			}
			this.fallingCol++;
		}
	}
	// collidesBelow(): Check for debris/boundary collisions below a piece.
	collidesBelow(col, row, piece) {
		var blocks = piece.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			// Check lower boundary
			if ((row + blocks[i].rowOffset) >= this.rows) {
				return true;
			}

			// Check debris
			var checkCol = col + blocks[i].colOffset - 1;
			var checkRow = row + blocks[i].rowOffset;
			if (this.debris[checkCol][checkRow]) {
				return true;
			}
		}
		return false;
	}
	// collidesLeft(): Check for debris/boundary collisions to the left of a piece.
	collidesLeft(col, row, piece) {
		var blocks = piece.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			// Check left boundary
			if ((col + blocks[i].colOffset) <= 1) {
				return true;
			}

			// Check debris
			var checkCol = col + blocks[i].colOffset - 2;
			var checkRow = row + blocks[i].rowOffset - 1;
			if (this.debris[checkCol][checkRow]) {
				return true;
			}
		}
		return false;
	}
	// collidesRight(): Check for debris/boundary collisions to the right of a piece.
	collidesRight(col, row, piece) {
		var blocks = piece.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			// Check right boundary
			if ((col + blocks[i].colOffset) >= this.columns) {
				return true;
			}

			// Check debris
			var checkCol = col + blocks[i].colOffset;
			var checkRow = row + blocks[i].rowOffset - 1;
			if (this.debris[checkCol][checkRow]) {
				return true;
			}
		}
		return false;
	}
	// overlaps(): Check whether a piece overlaps debris/boundaries.
	overlaps(col, row, piece) {
		var blocks = piece.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			// Check lower boundary
			if ((row + blocks[i].rowOffset) > this.rows) {
				return true;
			}

			// Check left boundary
			if ((col + blocks[i].colOffset) < 1) {
				return true;
			}

			// Check right boundary
			if ((col + blocks[i].colOffset) > this.columns) {
				return true;
			}

			// Check debris
			var checkCol = col + blocks[i].colOffset - 1;
			var checkRow = row + blocks[i].rowOffset - 1;
			if (this.debris[checkCol][checkRow]) {
				return true;
			}
		}
		return false;
	}
}

module.exports = {
	GameOverColours: GameOverColours,
	WellState: WellState,
	Well: Well
};