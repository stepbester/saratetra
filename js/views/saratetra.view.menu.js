var View = require("../saratetra.view.js");
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;

/**
 * Saratetra menu view class.
 */
module.exports = class MenuView extends View {
    constructor(onClose, items) {
        super(onClose);
        this.blockInput = true;
        this.blockDraw = true;
        this.index = 0;
        this.items = items;

        // Actions
        var view = this; // this hack
        this.controller.defineAction(UserFunctions.UP, new Action(() => {
            // Move up
            view.index = Math.max(0, view.index - 1);
        }));

        this.controller.defineAction(UserFunctions.DOWN, new Action(() => {
            // Move up
            view.index = Math.min(view.items.length - 1, view.index + 1);
        }));

        this.controller.defineAction(UserFunctions.SELECT, new Action(() => {
            // Close this view
            view.close();
        }));
    }
    tick() {
		View.prototype.tick.call(this);
	}
    draw(renderer) {
        // Draw background
        renderer.drawBackground("title");
        
        // Draw menu
        renderer.drawMainMenu(this.items, this.index);
    }
}