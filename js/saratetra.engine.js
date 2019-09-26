/**
 * Saratetris game class.
 */
class TetraEngine {
	constructor(renderer, refreshPerSecond, flashRate, moveRate, fallRate, clearRate) {
		this.renderer = renderer;
		this.rps = refreshPerSecond;
		this.flashRate = flashRate;
		this.moveRate = moveRate;
		this.fallRate = fallRate;
		this.clearRate = clearRate;
		this.views = [];
	}
	openStartingView() {
		this.openView(new TitleView(engine, this.flashRate));
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

				// Feed user functionto controller
				currentView.controller.endAction(userFunction);
				if (currentView.blockInput) {
					break;
				}
			}
		}
	}
}