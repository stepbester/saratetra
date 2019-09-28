var Controller = require("./saratetra.controller.js").Controller;

/**
 * Saratetra view base class.
 */
module.exports = class View {
	constructor(engine) {
		this.engine = engine;
		this.controller = new Controller(engine); // default controller
		this.time = 0;
		this.blockDraw = true;
		this.blockTick = true;
		this.blockInput = true;
		this.onClose = null;
	}
	tick() {
		this.time++;
	}
	draw(renderer) {
		// ...
	}
	close() {
		this.engine.closeView(this);
		if (this.onClose) {
			this.onClose();
		}
	}
}