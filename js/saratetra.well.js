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
	ROWS_CLEARED: 5,
	GAME_ENDING: 6,
	GAME_OVER: 7
});

/**
 * Colour composition of the game over rainbow. :-)
 */
var gameOverColours = [
	BLOCK_RED,
	BLOCK_BLUE,
	BLOCK_ORANGE,
	BLOCK_YELLOW,
	BLOCK_PURPLE,
	BLOCK_GREEN,
	BLOCK_CYAN,
	BLOCK_RED,
	BLOCK_BLUE,
	BLOCK_ORANGE
];

/**
 * Saratetra well class.
 */
class Well {
	constructor() {
		this.state = WellState.GAME_OVER;
		this.fallingPiece = null;
		this.fallingCol = 5;
		this.fallingRow = 2;
		this.debris = new Array(WELL_COLUMNS);
		for (var i = 0; i < WELL_COLUMNS; i++) {
			this.debris[i] = new Array(WELL_ROWS);
		}
		this.rowsToClear = [];
		this.gameOverStep = 0;
		this.x = SCREEN_WIDTH / 2 - WELL_WIDTH / 2;
		this.y = SCREEN_HEIGHT / 2 - WELL_HEIGHT / 2;
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
	draw(context) {
		// Border
		context.strokeStyle = COLOUR_BORDER;
		context.lineWidth = 2;
		context.strokeRect(this.x, this.y, WELL_WIDTH, WELL_HEIGHT);
		context.save();

		// {
		// Clip inside of border
		context.beginPath();
		context.rect(this.x + 1, this.y + 1, WELL_WIDTH - 2, WELL_HEIGHT - 2);
		context.clip();

		// Back colour
		context.fillStyle = COLOUR_BACK;
		context.fillRect(this.x, this.y, WELL_WIDTH, WELL_HEIGHT);

		// Debris blocks
		for (var x = 0; x < WELL_COLUMNS; x++) {
			for (var y = 0; y < WELL_ROWS; y++) {
				var block = this.debris[x][y];
				if (block) {
					drawBlock(context, this.x + x * BLOCK_WIDTH, this.y + y * BLOCK_HEIGHT, block.blockColour);
				}
			}
		}

		// Falling piece
		if (this.fallingPiece) {
			this.fallingPiece.draw(context, this.x + this.fallingCol * BLOCK_WIDTH, this.y + this.fallingRow * BLOCK_HEIGHT);
		}

		// Cleared rows
		for (var row = 0; row < this.rowsToClear.length; row++) {
			// Get row index of cleared row
			var clearRow = this.rowsToClear[row];
			context.fillStyle = COLOUR_CLEAR_ROW;
			context.fillRect(this.x, this.y + clearRow * BLOCK_HEIGHT, WELL_WIDTH, BLOCK_HEIGHT);
		}

		// Game over animation
		if (this.state == WellState.GAME_ENDING || this.state == WellState.GAME_OVER) {
			for (var goRow = 0; goRow < this.gameOverStep; goRow++) {
				var rowColour = gameOverColours[this.gameOverStep];
				for (var goCol = 0; goCol < WELL_COLUMNS; goCol++) {
					// From the top
					drawBlock(context, this.x + goCol * BLOCK_WIDTH, this.y + goRow * BLOCK_HEIGHT, gameOverColours[goRow]);

					// From the bottom
					drawBlock(context, this.x + goCol * BLOCK_WIDTH, this.y + (WELL_ROWS - goRow - 1) * BLOCK_HEIGHT, gameOverColours[goRow]);
				}
			}
		}
		// }

		context.restore();
		// Temporary numbering
		/*context.fillStyle = "#ffff00";
		context.font = "10px Arial";
		context.textAlign = "center";
		context.textBaseline = "bottom";
		for (var j = 0; j < WELL_COLUMNS; j++) {
		    for (var k = 0; k < WELL_ROWS; k++) {
		        context.fillText(j + ", " + k, this.x + j * BLOCK_WIDTH + (BLOCK_WIDTH / 2), this.y + k * BLOCK_HEIGHT + (BLOCK_HEIGHT / 2));
		    }
		}*/
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
		for (var row = WELL_ROWS - 1; row >= 0; row--) {
			var goodRow = true;
			for (var col = 0; col < WELL_COLUMNS; col++) {
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
					for (var col = 0; col < WELL_COLUMNS; col++) {
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
			for (var col = 0; col < WELL_COLUMNS; col++) {
				this.debris[col][row] = null;
			}
		}

		// No more rows to clear
		this.rowsToClear = [];

		// Register that the rows have been cleared
		//this.state = WellState.ROWS_CLEARED;
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
			if ((row + blocks[i].rowOffset) >= WELL_ROWS) {
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
			if ((col + blocks[i].colOffset) >= WELL_COLUMNS) {
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
			if ((row + blocks[i].rowOffset) > WELL_ROWS) {
				return true;
			}

			// Check left boundary
			if ((col + blocks[i].colOffset) < 1) {
				return true;
			}

			// Check right boundary
			if ((col + blocks[i].colOffset) > WELL_COLUMNS) {
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