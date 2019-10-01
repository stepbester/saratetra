var View = require("../saratetra.view.js");
var PauseController = require("../controllers/saratetra.controller.pause.js");
var UserFunctions = require("../saratetra.input.js").UserFunctions;

/**
 * Saratetra pause view class.
 */
module.exports = class PauseView extends View {
	constructor(engine) {
		super(engine);
		this.controller = new PauseController(engine);
		this.blockInput = true;
		this.blockDraw = false;
	}
	tick() {
		View.prototype.tick.call(this);

		// Process actions
		if (this.controller.executeAction(UserFunctions.PAUSE)) {
			// Close this view
			this.close();
		}
	}
	draw(renderer) {
		renderer.drawMessageBox("PAUSE");
	}
}