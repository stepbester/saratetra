var GameOverColours = require("./saratetra.well.js").GameOverColours;
var WellState = require("./saratetra.well.js").WellState;

/**
 * Saratetra canvas renderer.
 */
module.exports = class CanvasRenderer {
	constructor(canvas, screenWidth, screenHeight, imageCache) {
		this.context = canvas.getContext("2d");
		this.width = screenWidth;
		this.height = screenHeight;
		this.imageCache = imageCache;

		// Derived sizes
		this.blockWidth = 29 / 800 * screenWidth;
		this.blockHeight = 29 / 600 * screenHeight;
		this.borderPadding = 10 / 29 * this.blockWidth;

		// Colours
		this.textColour = "#ffffff";
		this.selectedColour = "#ff00ff";
		this.borderColour = "#ffffff";
		this.backColour = "#000000";
		this.rowClearColour = "#ffffff";
	}

	clearScreen() {
		this.context.fillStyle = "#000000";
		this.context.fillRect(0, 0, this.width, this.height);
	}

	drawProgress(step, total) {
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "center";
		this.context.font = "bold 20px Arial";
		this.context.textBaseline = "middle";
		this.context.fillText("loading...", this.width / 2, this.height / 2);
	}

	drawBackground(key) {
		if (!this.imageCache.isFullyLoaded()) {
			return;
		}

		var image = this.imageCache.images[key];
		if (!image) {
			return;
		}

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

		if (level == 0) {
			// Endless
			this.context.font = "bold 26px Arial";
			this.context.fillStyle = this.textColour;
			this.context.textAlign = "center";
			this.context.textBaseline = "middle";
			this.context.fillText("ENDLESS", boxLeft + boxWidth / 2, boxTop + boxHeight / 4);
			this.context.font = "bold 42px Arial";
			this.context.fillText("MODE", boxLeft + boxWidth / 2, boxTop + 75);
		} else {
			// Level
			this.context.font = "bold 26px Arial";
			this.context.fillStyle = this.textColour;
			this.context.textAlign = "center";
			this.context.textBaseline = "top";
			this.context.fillText("LEVEL", boxLeft + boxWidth / 2, boxTop + this.borderPadding);
			this.context.font = "bold 48px Arial";
			this.context.textBaseline = "middle";
			this.context.fillText(level, boxLeft + boxWidth / 2, boxTop + this.borderPadding + 65);
		}
		// }

		this.context.restore();
	}

	drawBlock(x, y, blockColour, scale = 1) {
		var scaledWidth = this.blockWidth * scale;
		var scaledHeight = this.blockHeight * scale;

		// Back
		this.context.fillStyle = blockColour.back;
		this.context.fillRect(x, y, scaledWidth, scaledHeight);

		// Front
		this.context.fillStyle = blockColour.front;
		this.context.fillRect(x + 1, y + 1, scaledWidth - 2, scaledHeight - 2);

		// Shine
		this.context.fillStyle = blockColour.shine;
		this.context.fillRect(x + 0.6 * scaledWidth, y + 0.1 * scaledHeight, 0.25 * scaledWidth, 0.25 * scaledHeight);
	}

	drawBlocks(x, y, blocks, colour, scale = 1) {
		var scaledWidth = this.blockWidth * scale;
		var scaledHeight = this.blockHeight * scale;

		for (var i = 0; i < blocks.length; i++) {
			this.drawBlock(x + ((blocks[i].colOffset - 1) * scaledWidth),
				y + ((blocks[i].rowOffset - 1) * scaledHeight),
				colour, scale);
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
	}

	drawNextBox(tetromino) {
		var boxHeight = 145;
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
			tetromino.draw(this,
				boxLeft + (boxWidth / 2) + ((4 - tetromino.columns) / 2) * this.blockWidth,
				boxTop + 100 + ((4 - tetromino.rows) / 2) * this.blockHeight);
		}
		// }

		this.context.restore();
	}

	drawScoreBox(score, lines) {
		var boxHeight = 125;
		var boxWidth = 160;
		var boxLeft = this.width - this.borderPadding - boxWidth - 20;
		var boxTop = this.borderPadding + 175;

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
		this.context.font = "bold 22px Consolas";
		this.context.textAlign = "right";
		this.context.textBaseline = "middle";
		this.context.fillText(score, boxLeft + boxWidth - this.borderPadding, boxTop + this.borderPadding + 40);

		// Lines
		this.context.font = "bold 22px Arial";
		this.context.fillStyle = this.textColour;
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.fillText("LINES", boxLeft + this.borderPadding, boxTop + this.borderPadding + 55);
		this.context.font = "bold 22px Consolas";
		this.context.textAlign = "right";
		this.context.textBaseline = "middle";
		this.context.fillText(lines, boxLeft + boxWidth - this.borderPadding, boxTop + this.borderPadding + 95);
		// }

		this.context.restore();
	}

	drawStats(totals, templates) {
		var boxHeight = 250;
		var boxWidth = 160;
		var boxLeft = this.width - this.borderPadding - boxWidth - 20;
		var boxTop = this.borderPadding + 330;
		var rowHeight = 30; // 250 div 8 = 30 remainder 10
		var miniScale = 0.3;

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

		var totalRow = 0;
		for (var key in totals) {
			if (totals.hasOwnProperty(key)) {
				// Setup font
				this.context.font = "bold 22px Consolas";
				this.context.textBaseline = "top";

				var tetromino = templates[key];
				if (tetromino) {
					// Draw mini tetromino
					tetromino.draw(this,
						boxLeft + this.borderPadding + 15 + ((4 - tetromino.columns) / 2) * this.blockWidth * miniScale,
						boxTop + totalRow * rowHeight + 7 + (rowHeight / 2) + ((4 - tetromino.rows) / 2) * this.blockWidth * miniScale,
						miniScale);

					// Use tetromino colour for total
					this.context.fillStyle = tetromino.colour.front;
				} else {
					// Write total symbol
					this.context.fillStyle = this.textColour;
					this.context.textAlign = "left";
					this.context.fillText("Σ", boxLeft + this.borderPadding + 8, boxTop + totalRow * rowHeight + this.borderPadding);
				}

				// Write total
				this.context.textAlign = "right";
				this.context.fillText(totals[key], boxLeft + boxWidth - this.borderPadding, boxTop + totalRow * rowHeight + this.borderPadding);

				totalRow++;
			}
		}
		// }

		this.context.restore();
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

	drawMainMenu(items, index) {
		// Box borders
		var boxHeight = 120;
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

		// Menu items
		this.context.font = "bold 26px Arial";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";

		var itemHeight = boxHeight / items.length;
		for (var i = 0; i < items.length; i++) {
			if (i == index) {
				this.context.fillStyle = this.selectedColour;
			} else {
				this.context.fillStyle = this.textColour;
			}

			this.context.fillText(items[i], boxLeft + boxWidth / 2, boxTop + i * itemHeight + itemHeight / 2);
		}
	}
}