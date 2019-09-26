/**
 * Saratetra next box class.
 */
class NextBox {
	constructor() {
		this.tetromino = null;
	}
	draw(renderer) {
		renderer.drawNextBox(this.tetromino);
	}
}