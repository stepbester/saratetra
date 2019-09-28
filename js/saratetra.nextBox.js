/**
 * Saratetra next box class.
 */
module.exports = class NextBox {
	constructor() {
		this.tetromino = null;
	}
	draw(renderer) {
		renderer.drawNextBox(this.tetromino);
	}
};