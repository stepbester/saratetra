/**
 * Saratetris game class.
 */
function TetraEngine(canvas) {
	this.views = [];
	this.canvas = canvas;
}

TetraEngine.prototype.openView = function(view) {
	view.engine = this;
	this.views.push(view);
}

TetraEngine.prototype.closeView = function(targetView) {
	var index = this.views.indexOf(targetView);
	this.views.splice(index, 1);
}

TetraEngine.prototype.tick = function() {
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

TetraEngine.prototype.draw = function() {
	// Clear canvas
	var context = this.canvas.getContext("2d");
	context.fillStyle = "#000000";
	context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
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
		this.views[i].draw(this.canvas);
	}
}

TetraEngine.prototype.keyDown = function(event) {
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

TetraEngine.prototype.keyUp = function(event) {
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