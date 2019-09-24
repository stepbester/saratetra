/**
 * Saratetra status box class.
 */
class LevelBox {
	constructor() {
		this.level = 1;
	}
	draw(context) {
		var boxHeight = 115;
		var boxWidth = 160;
		var boxLeft = BORDER_PADDING + 40;
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

		// Level
		context.font = "bold 26px Arial";
		context.fillStyle = COLOUR_TEXT;
		context.textAlign = "center";
		context.textBaseline = "top";
		context.fillText("LEVEL", boxLeft + boxWidth / 2, boxTop + BORDER_PADDING);
		context.font = "bold 48px Arial";
		context.textBaseline = "middle";
		context.fillText(this.level, boxLeft + boxWidth / 2, boxTop + BORDER_PADDING + 65);
		// }

		context.restore();
	}
}