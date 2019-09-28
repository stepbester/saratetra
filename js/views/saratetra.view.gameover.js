var View = require("../saratetra.view.js");
var GameOverController = require("../controllers/saratetra.controller.gameover.js");
var UserFunctions = require("../saratetra.input.js").UserFunctions;

/**
 * Saratetra game over view class.
 */
module.exports = class GameOverView extends View {
	constructor(engine) {
		super(engine);
		this.controller = new GameOverController(engine);
		this.blockInput = true;
		this.blockDraw = false;
	}
	tick() {
		View.prototype.tick.call(this);
		
		// Process actions
		if (this.controller.executeAction(UserFunctions.SELECT)) {
			// Close this view
			this.close();
		}
	}
	draw(renderer) {
		renderer.drawGameOver();
	}
}