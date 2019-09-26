/**
 * Saratetra canvas renderer.
 */
class CanvasRenderer {
    constructor(canvas, screenWidth, screenHeight) {
        this.context = canvas.getContext("2d");
        this.width = screenWidth;
        this.height = screenHeight;

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
		var boxLeft = BORDER_PADDING + 40;
		var boxTop = BORDER_PADDING;

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
		this.context.fillText("LEVEL", boxLeft + boxWidth / 2, boxTop + BORDER_PADDING);
		this.context.font = "bold 48px Arial";
		this.context.textBaseline = "middle";
		this.context.fillText(level, boxLeft + boxWidth / 2, boxTop + BORDER_PADDING + 65);
		// }

		this.context.restore();
    }

    drawBlock(x, y, blockColour) {
        // Back
        this.context.fillStyle = blockColour.back;
        this.context.fillRect(x, y, BLOCK_WIDTH, BLOCK_WIDTH);

        // Front
        this.context.fillStyle = blockColour.front;
        this.context.fillRect(x + 1, y + 1, BLOCK_WIDTH - 2, BLOCK_HEIGHT - 2);

        // Shine
        this.context.fillStyle = blockColour.shine;
        this.context.fillRect(x + 0.6 * BLOCK_WIDTH, y + 0.1 * BLOCK_HEIGHT, 0.25 * BLOCK_WIDTH, 0.25 * BLOCK_HEIGHT);
    }

    drawWell(rows, columns, debris, fallingCol, fallingRow, fallingPiece, rowsToClear, state, gameOverStep) {
        // Well starting position
        var wellHeight = rows * BLOCK_HEIGHT;
        var wellWidth = columns * BLOCK_HEIGHT;
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
					this.drawBlock(x + dx * BLOCK_WIDTH, y + dy * BLOCK_HEIGHT, block.blockColour);
				}
			}
		}

		// Falling piece
		if (fallingPiece) {
			fallingPiece.draw(this, x + fallingCol * BLOCK_WIDTH, y + fallingRow * BLOCK_HEIGHT);
		}

		// Cleared rows
		for (var row = 0; row < rowsToClear.length; row++) {
			// Get row index of cleared row
			var clearRow = rowsToClear[row];
			this.context.fillStyle = this.rowClearColour;
			this.context.fillRect(x, y + clearRow * BLOCK_HEIGHT, wellWidth, BLOCK_HEIGHT);
		}

		// Game over animation
		if (state == WellState.GAME_ENDING || state == WellState.GAME_OVER) {
			for (var goRow = 0; goRow < gameOverStep; goRow++) {
				var rowColour = gameOverColours[gameOverStep];
				for (var goCol = 0; goCol < columns; goCol++) {
					// From the top
					this.drawBlock(x + goCol * BLOCK_WIDTH, y + goRow * BLOCK_HEIGHT, gameOverColours[goRow]);

					// From the bottom
					this.drawBlock(x + goCol * BLOCK_WIDTH, y + (rows - goRow - 1) * BLOCK_HEIGHT, gameOverColours[goRow]);
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
		        this.context.fillText(j + ", " + k, x + j * BLOCK_WIDTH + (BLOCK_WIDTH / 2), y + k * BLOCK_HEIGHT + (BLOCK_HEIGHT / 2));
		    }
		}*/
    }

    drawNextBox(tetromino) {
        var boxHeight = 190;
		var boxWidth = 160;
		var boxLeft = SCREEN_WIDTH - BORDER_PADDING - boxWidth - 40;
		var boxTop = BORDER_PADDING;

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
		this.context.fillText("NEXT", boxLeft + boxWidth / 2, boxTop + BORDER_PADDING);

		// Piece
		if (tetromino) {
			tetromino.draw(this, boxLeft + (boxWidth / 2) + ((4 - tetromino.columns) / 2) * BLOCK_WIDTH, boxTop + 20 + (boxHeight / 2) + ((4 - tetromino.rows) / 2) * BLOCK_HEIGHT);
		}
		// }

		this.context.restore();
    }

    drawStats(totals) {
        // TODO: Draw stats
    }

    drawGameOver() {
        // Box borders
		var boxHeight = 90;
		var boxWidth = 240;
		var boxLeft = (SCREEN_WIDTH - boxWidth) / 2;
		var boxTop = (SCREEN_HEIGHT - boxHeight) / 2;

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
		this.context.fillText("GAME OVER", boxLeft + boxWidth / 2, boxTop + boxHeight / 2);
    }

    drawTitle(logo, noticeVisible) {
        // Frame borders
		var frameHeight = 15 * BLOCK_HEIGHT;
		var frameWidth = 25 * BLOCK_WIDTH;
		var frameLeft = (SCREEN_WIDTH - frameWidth) / 2;
		var frameTop = (SCREEN_HEIGHT - frameHeight) / 2;

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
		var logoLeft = (SCREEN_WIDTH - 23 * BLOCK_WIDTH) / 2;
		var logoTop = (SCREEN_HEIGHT - 13 * BLOCK_HEIGHT) / 2;
		for (var x = 0; x < logo.length; x++) {
			for (var y = 0; y < logo[x].length; y++) {
				if (logo[x][y]) {
					var blockX = logoLeft + x * BLOCK_WIDTH;
					var blockY = logoTop + y * BLOCK_HEIGHT;
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
			this.context.fillText("PRESS THE 'X' KEY", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
		}
		// }
		
		this.context.restore();
    }
}