/**
 * Saratetra status box class.
 */
class LevelBox {
	constructor() {
		this.level = 1;
	}
	draw(renderer) {
		renderer.drawLevelBox(this.level);
	}
}