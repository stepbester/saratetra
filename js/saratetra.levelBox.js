/**
 * Saratetra status box class.
 */
module.exports = class LevelBox {
	constructor() {
		this.level = 1;
	}
	draw(renderer) {
		renderer.drawLevelBox(this.level);
	}
};