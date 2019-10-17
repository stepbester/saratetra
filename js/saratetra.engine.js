var TitleView = require("./views/saratetra.view.title.js");
var GameplayView = require("./views/saratetra.view.gameplay.js");
var GameOverView = require("./views/saratetra.view.gameover.js");
var PauseView = require("./views/saratetra.view.pause.js");
var UserFunctions = require("./saratetra.input.js").UserFunctions;
var KeyMappings = require("./saratetra.input.js").KeyMappings;

var EngineStates = Object.freeze({
	LOADING: 0,
	RUNNING: 1,
});

/**
 * Saratetra game class.
 */
module.exports = class TetraEngine {
	constructor(renderer, imageCache, timingOptions = {}) {
		this.renderer = renderer;
		this.imageCache = imageCache;
		this.views = [];
		this.state = EngineStates.LOADING;

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
		this.draw();
	}
	startGame() {
		var engine = this; // this hack

		// Standard close
		var viewClose = function (view) {
			engine.closeView(view);
		};

		// Show the title view first
		var titleView = new TitleView(viewClose, {
			flashRate: engine.flashRate
		});

		// Start a new game with the gameplay view
		titleView.onStartGame = function () {
			var gameplayView = new GameplayView(viewClose, {
				moveRate: engine.moveRate,
				fallRate: engine.fallRate,
				clearRate: engine.clearRate
			});

			// When the game is over, show the game over view
			gameplayView.onGameOver = function () {
				var gameOverClose = function () {
					engine.closeView(this);

					// When game over view is closed, return to title
					gameplayView.close();
				}
				var gameOver = new GameOverView(gameOverClose);
				engine.openView(gameOver);
			};

			// Display pause message
			gameplayView.onPause = function () {
				engine.openView(new PauseView(viewClose));
			};

			// Go to gameplay view
			engine.openView(gameplayView);
		}
		// Go to title view
		this.openView(titleView);
	}
	openView(view) {
		this.views.push(view);
	}
	closeView(targetView) {
		var index = this.views.indexOf(targetView);
		this.views.splice(index, 1);
	}
	tick() {
		if (this.state == EngineStates.LOADING) {
			// Wait until image cache is ready
			if (this.imageCache.isFullyLoaded()) {
				this.startGame();
				this.state = EngineStates.RUNNING;
			}
		}

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

		if (this.state == EngineStates.LOADING) {
			// Draw progress
			this.renderer.drawProgress(this.imageCache.totalLoaded, this.imageCache.totalImages);

			// Don't draw anything else until images have loaded
			return;
		}

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
			event.preventDefault();

			// Broadcast functions to views until one of them blocks input
			for (var i = this.views.length - 1; i >= 0; i--) {
				var currentView = this.views[i];

				// Feed function to controller
				currentView.controller.startAction(userFunction);
				currentView.controller.startAction(UserFunctions.ANY);
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
			event.preventDefault();

			// Broadcast functions to views until one of them blocks input
			for (var i = this.views.length - 1; i >= 0; i--) {
				var currentView = this.views[i];

				// Feed user function to controller
				currentView.controller.endAction(userFunction);
				currentView.controller.startAction(UserFunctions.ANY);
				if (currentView.blockInput) {
					break;
				}
			}
		}
	}
}