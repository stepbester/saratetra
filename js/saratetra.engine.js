var TitleView = require("./views/saratetra.view.title.js");
var KeyMappings = require("./saratetra.input.js").KeyMappings;

/**
 * Saratetra game class.
 */
module.exports = class TetraEngine {
	constructor(renderer, timingOptions = {}) {
		this.renderer = renderer;
		this.views = [];

		// Set timing options
		this.rps = timingOptions.refreshPerSecond || 20; // The number of times the engine state is updated per second
		this.flashRate = timingOptions.flashRate || (this.rps / 2); // The rate at which the title hint text flashes
		this.moveRate = timingOptions.moveRate || (this.rps / 20); // The rate at which a tetromino can be moved laterally
		this.fallRate = timingOptions.fallRate || (this.rps / 1); // The rate at which the player can cause a tetromino to descend
		this.clearRate = timingOptions.clearRate || (this.rps / 10); // The rate at which cleared rows are removed from the well

		// Hack to get around event handlers losing context of "this"
		var engine = this;

		// Listen for input
		document.addEventListener("keydown", function (event) {
			engine.keyDown(event);
		});
		document.addEventListener("keyup", function (event) {
			engine.keyUp(event);
		});

		// Update and draw at intervals
		setInterval(function () {
			engine.tick();
			engine.draw();
		}, 1000 / this.rps);

		// Start by drawing the first view
		this.openStartingView();
		this.draw();
	}
	openStartingView() {
		this.openView(new TitleView(this, this.flashRate));
	}
	openView(view) {
		this.views.push(view);
	}
	closeView(targetView) {
		var index = this.views.indexOf(targetView);
		this.views.splice(index, 1);
	}
	tick() {
		// Process views from the top down until one of them blocks processing
		for (var i = this.views.length - 1; i >= 0; i--) {
			var currentView = this.views[i];

			// Advance this view
			currentView.tick();
			if (currentView.blockTick) {
				break;
			}
		}
	}
	draw() {
		// Clear canvas
		this.renderer.clearScreen();

		// Find the first view that blocks draw
		var start = 0;
		for (var i = this.views.length - 1; i >= 0; i--) {
			if (this.views[i].blockDraw) {
				start = i;
				break;
			}
		}

		// Draw the views from the bottom up
		for (var i = start; i < this.views.length; i++) {
			this.views[i].draw(this.renderer);
		}
	}
	keyDown(event) {
		// Map to user function
		var userFunction = KeyMappings[event.which];
		if (userFunction) {
			// Broadcast functions to views until one of them blocks input
			for (var i = this.views.length - 1; i >= 0; i--) {
				var currentView = this.views[i];

				// Feed function to controller
				currentView.controller.startAction(userFunction);
				if (currentView.blockInput) {
					break;
				}
			}
		}
	}
	keyUp(event) {
		// Map to user function
		var userFunction = KeyMappings[event.which];
		if (userFunction) {
			// Broadcast functions to views until one of them blocks input
			for (var i = this.views.length - 1; i >= 0; i--) {
				var currentView = this.views[i];

				// Feed user function to controller
				currentView.controller.endAction(userFunction);
				if (currentView.blockInput) {
					break;
				}
			}
		}
	}
}