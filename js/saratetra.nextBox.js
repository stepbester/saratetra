/**
 * Saratetra next box class.
 */
class NextBox {
	constructor() {
		this.tetromino = null;
	}
	draw(context) {
		var boxHeight = 190;
		var boxWidth = 160;
		var boxLeft = SCREEN_WIDTH - BORDER_PADDING - boxWidth - 40;
		var boxTop = BORDER_PADDING;

		// Border
		context.strokeStyle = COLOUR_BORDER;
		context.lineWidth = 2;
		context.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);
		context.save();

		// {
		// Clip inside of border
		context.beginPath();
		context.rect(boxLeft + 1, boxTop + 1, boxWidth - 2, boxHeight - 2);
		context.clip();

		// Back colour
		context.fillStyle = COLOUR_BACK;
		context.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

		// Label
		context.font = "bold 26px Arial";
		context.fillStyle = COLOUR_TEXT;
		context.textAlign = "center";
		context.textBaseline = "top";
		context.fillText("NEXT", boxLeft + boxWidth / 2, boxTop + BORDER_PADDING);

		// Piece
		if (this.tetromino) {
			var pieceWidth = 4 * BLOCK_WIDTH;
			var pieceHeight = 4 * BLOCK_HEIGHT;
			this.tetromino.draw(context, boxLeft + (boxWidth / 2) + ((4 - this.tetromino.columns) / 2) * BLOCK_WIDTH, boxTop + 20 + (boxHeight / 2) + ((4 - this.tetromino.rows) / 2) * BLOCK_HEIGHT);
		}
		// }

		context.restore();
	}
}