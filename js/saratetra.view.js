var Controller = require("./saratetra.controller.js").Controller;

/**
 * Saratetra view base class.
 */
module.exports = class View {
	constructor(onClose, options = null) {
		this.onClose = onClose;
		this.controller = new Controller(this.defineActions(options));
		this.time = 0;
		this.blockDraw = true;
		this.blockTick = true;
		this.blockInput = true;
	}
	defineActions(options) {
		return [];
	}
	tick() {
		this.time++;
	}
	draw(renderer) {
		// ...
	}
	close() {
		if (this.onClose) {
			this.onClose(this);
		}
	}
}