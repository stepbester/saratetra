var View = require("../saratetra.view.js");
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;

/**
 * Saratetra pause view class.
 */
module.exports = class PauseView extends View {
	constructor(onClose) {
		super(onClose);
		this.blockInput = true;
		this.blockDraw = false;

		// Actions
        var view = this; // this hack
        this.controller.defineAction(UserFunctions.PAUSE, new Action(function() {
			// Close this view
            view.close();
        }));
	}
	tick() {
		View.prototype.tick.call(this);
	}
	draw(renderer) {
		renderer.drawMessageBox("PAUSE");
	}
}