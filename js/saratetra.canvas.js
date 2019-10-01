var GameOverColours = require("./saratetra.well.js").GameOverColours;
var WellState = require("./saratetra.well.js").WellState;

/**
 * Saratetra canvas renderer.
 */
module.exports = class CanvasRenderer {
	constructor(canvas, screenWidth, screenHeight) {
		this.context = canvas.getContext("2d");
		this.width = screenWidth;
		this.height = screenHeight;

		// Derived sizes
		this.blockWidth = 29 / 800 * screenWidth;
		this.blockHeight = 29 / 600 * screenHeight;
		this.borderPadding = 10 / 29 * this.blockWidth;

		// Colours
		this.textColour = "#ffffff";
		this.borderColour = "#ffffff";
		this.backColour = "#000000";
		this.rowClearColour = "#ffffff";
	}

	clearScreen() {
		this.context.fillStyle = "#000000";
		this.context.fillRect(0, 0, this.width, this.height);
	}

	drawBackground(image) {
		this.context.drawImage(image, 0, 0, this.width, this.height);
	}

	drawLevelBox(level) {
		var boxHeight = 115;
		var boxWidth = 160;
		var boxLeft = this.borderPadding + 20;
		var boxTop = this.borderPadding;

		// Border
		this.context.strokeStyle = this.borderColour;
		this.context.lineWidth = 2;
		this.context.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);
		this.context.save();

		// {
		// Clip inside of border
		this.context.beginPath();
		this.context.rect(boxLeft + 1, boxTop + 1, boxWidth - 2, boxHeight - 2);
		this.context.clip();

		// Back colour
		this.context.fillStyle = this.backColour;
		this.context.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

		// Level
		this.context.font = "bold 26px Arial";
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "center";
		this.context.textBaseline = "top";
		this.context.fillText("LEVEL", boxLeft + boxWidth / 2, boxTop + this.borderPadding);
		this.context.font = "bold 48px Arial";
		this.context.textBaseline = "middle";
		this.context.fillText(level, boxLeft + boxWidth / 2, boxTop + this.borderPadding + 65);
		// }

		this.context.restore();
	}

	drawBlock(x, y, blockColour) {
		// Back
		this.context.fillStyle = blockColour.back;
		this.context.fillRect(x, y, this.blockWidth, this.blockHeight);

		// Front
		this.context.fillStyle = blockColour.front;
		this.context.fillRect(x + 1, y + 1, this.blockWidth - 2, this.blockHeight - 2);

		// Shine
		this.context.fillStyle = blockColour.shine;
		this.context.fillRect(x + 0.6 * this.blockWidth, y + 0.1 * this.blockHeight, 0.25 * this.blockWidth, 0.25 * this.blockHeight);
	}

	drawBlocks(x, y, blocks, colour) {
		for (var i = 0; i < blocks.length; i++) {
			this.drawBlock(x + ((blocks[i].colOffset - 1) * this.blockWidth),
				y + ((blocks[i].rowOffset - 1) * this.blockHeight),
				colour);
		}
	}

	drawWell(rows, columns, debris, fallingCol, fallingRow, fallingPiece, rowsToClear, state, gameOverStep) {
		// Well starting position
		var wellHeight = rows * this.blockHeight;
		var wellWidth = columns * this.blockHeight;
		var x = this.width / 2 - wellWidth / 2;
		var y = this.height / 2 - wellHeight / 2;

		// Border
		this.context.strokeStyle = this.borderColour;
		this.context.lineWidth = 2;
		this.context.strokeRect(x, y, wellWidth, wellHeight);
		this.context.save();

		// {
		// Clip inside of border
		this.context.beginPath();
		this.context.rect(x + 1, y + 1, wellWidth - 2, wellHeight - 2);
		this.context.clip();

		// Back colour
		this.context.fillStyle = this.backColour;
		this.context.fillRect(x, y, wellWidth, wellHeight);

		// Debris blocks
		for (var dx = 0; dx < columns; dx++) {
			for (var dy = 0; dy < rows; dy++) {
				var block = debris[dx][dy];
				if (block) {
					this.drawBlock(x + dx * this.blockWidth, y + dy * this.blockHeight, block.blockColour);
				}
			}
		}

		// Falling piece
		if (fallingPiece) {
			fallingPiece.draw(this, x + fallingCol * this.blockWidth, y + fallingRow * this.blockHeight);
		}

		// Cleared rows
		for (var row = 0; row < rowsToClear.length; row++) {
			// Get row index of cleared row
			var clearRow = rowsToClear[row];
			this.context.fillStyle = this.rowClearColour;
			this.context.fillRect(x, y + clearRow * this.blockHeight, wellWidth, this.blockHeight);
		}

		// Game over animation
		if (state == WellState.GAME_ENDING || state == WellState.GAME_OVER) {
			for (var goRow = 0; goRow < gameOverStep; goRow++) {
				var rowColour = GameOverColours[gameOverStep];
				for (var goCol = 0; goCol < columns; goCol++) {
					// From the top
					this.drawBlock(x + goCol * this.blockWidth, y + goRow * this.blockHeight, GameOverColours[goRow]);

					// From the bottom
					this.drawBlock(x + goCol * this.blockWidth, y + (rows - goRow - 1) * this.blockHeight, GameOverColours[goRow]);
				}
			}
		}
		// }

		this.context.restore();

		// Temporary numbering
		/*this.context.fillStyle = "#ffff00";
		this.context.font = "10px Arial";
		this.context.textAlign = "center";
		this.context.textBaseline = "bottom";
		for (var j = 0; j < WELL_COLUMNS; j++) {
		    for (var k = 0; k < WELL_ROWS; k++) {
		        this.context.fillText(j + ", " + k, x + j * this.blockWidth + (this.blockWidth / 2), y + k * this.blockHeight + (this.blockHeight / 2));
		    }
		}*/
	}

	drawNextBox(tetromino) {
		var boxHeight = 190;
		var boxWidth = 160;
		var boxLeft = this.width - this.borderPadding - boxWidth - 20;
		var boxTop = this.borderPadding;

		// Border
		this.context.strokeStyle = this.borderColour;
		this.context.lineWidth = 2;
		this.context.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);
		this.context.save();

		// {
		// Clip inside of border
		this.context.beginPath();
		this.context.rect(boxLeft + 1, boxTop + 1, boxWidth - 2, boxHeight - 2);
		this.context.clip();

		// Back colour
		this.context.fillStyle = this.backColour;
		this.context.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

		// Label
		this.context.font = "bold 26px Arial";
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "center";
		this.context.textBaseline = "top";
		this.context.fillText("NEXT", boxLeft + boxWidth / 2, boxTop + this.borderPadding);

		// Piece
		if (tetromino) {
			tetromino.draw(this, boxLeft + (boxWidth / 2) + ((4 - tetromino.columns) / 2) * this.blockWidth, boxTop + 20 + (boxHeight / 2) + ((4 - tetromino.rows) / 2) * this.blockHeight);
		}
		// }

		this.context.restore();
	}

	drawScoreBox(score, lines) {
		var boxHeight = 145;
		var boxWidth = 160;
		var boxLeft = this.width - this.borderPadding - boxWidth - 20;
		var boxTop = this.borderPadding + 220;

		// Border
		this.context.strokeStyle = this.borderColour;
		this.context.lineWidth = 2;
		this.context.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);
		this.context.save();

		// {
		// Clip inside of border
		this.context.beginPath();
		this.context.rect(boxLeft + 1, boxTop + 1, boxWidth - 2, boxHeight - 2);
		this.context.clip();

		// Back colour
		this.context.fillStyle = this.backColour;
		this.context.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

		// Score
		this.context.font = "bold 22px Arial";
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.fillText("SCORE", boxLeft + this.borderPadding, boxTop + this.borderPadding);
		this.context.font = "bold 26px Consolas";
		this.context.textAlign = "right";
		this.context.textBaseline = "middle";
		this.context.fillText(score, boxLeft + boxWidth - this.borderPadding, boxTop + this.borderPadding + 45);

		// Lines
		this.context.font = "bold 22px Arial";
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.fillText("LINES", boxLeft + this.borderPadding, boxTop + this.borderPadding + 65);
		this.context.font = "bold 26px Consolas";
		this.context.textAlign = "right";
		this.context.textBaseline = "middle";
		this.context.fillText(lines, boxLeft + boxWidth - this.borderPadding, boxTop + this.borderPadding + 110);
		// }

		this.context.restore();
	}

	drawStats(totals) {
		// TODO: Draw stats
	}

	drawMessageBox(message) {
		// Box borders
		var boxHeight = 90;
		var boxWidth = 240;
		var boxLeft = (this.width - boxWidth) / 2;
		var boxTop = (this.height - boxHeight) / 2;

		// Outer border
		this.context.strokeStyle = this.borderColour;
		this.context.lineWidth = 2;
		this.context.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);

		// Back colour
		this.context.fillStyle = this.backColour;
		this.context.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

		// Message
		this.context.font = "bold 26px Arial";
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.context.fillText(message, boxLeft + boxWidth / 2, boxTop + boxHeight / 2);
	}

	drawTitle(logo, noticeVisible) {
		// Frame borders
		var frameHeight = 15 * this.blockHeight;
		var frameWidth = 25 * this.blockWidth;
		var frameLeft = (this.width - frameWidth) / 2;
		var frameTop = (this.height - frameHeight) / 2;

		// Outer border
		this.context.strokeStyle = this.borderColour;
		this.context.lineWidth = 2;
		this.context.strokeRect(frameLeft, frameTop, frameWidth, frameHeight);
		this.context.save();

		// {
		// Clip inside of border
		this.context.beginPath();
		this.context.rect(frameLeft + 1, frameTop + 1, frameWidth - 2, frameHeight - 2);
		this.context.clip();

		// Back colour
		this.context.fillStyle = this.backColour;
		this.context.fillRect(frameLeft, frameTop, frameWidth, frameHeight);

		// Logo
		var logoLeft = (this.width - 23 * this.blockWidth) / 2;
		var logoTop = (this.height - 13 * this.blockHeight) / 2;
		for (var x = 0; x < logo.length; x++) {
			for (var y = 0; y < logo[x].length; y++) {
				if (logo[x][y]) {
					var blockX = logoLeft + x * this.blockWidth;
					var blockY = logoTop + y * this.blockHeight;
					this.drawBlock(blockX, blockY, logo[x][y]);
				}
			}
		}

		// Press any key
		if (noticeVisible) {
			this.context.fillStyle = this.textColour;
			this.context.font = "bold 32px Arial";
			this.context.textAlign = "center";
			this.context.textBaseline = "middle";
			this.context.fillText("PRESS THE 'X' KEY", this.width / 2, this.height / 2);
		}
		// }

		this.context.restore();
	}
}