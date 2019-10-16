var View = require("../saratetra.view.js");
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;

/**
 * Saratetra pause view class.
 */
module.exports = class PauseView extends View {
	constructor(engine) {
		super(engine);
		this.blockInput = true;
		this.blockDraw = false;
	}
	defineActions() {
		var actions = [];
		actions[UserFunctions.PAUSE] = new Action(false);
		return actions;
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