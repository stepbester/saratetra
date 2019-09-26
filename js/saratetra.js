// Game Objects
var engine;

// Game initialization
function init() {
	// Get references to document elements
	var canvas = document.getElementById("tetra-game");

	// Create game objects
	var renderer = new CanvasRenderer(canvas, 800, 600); 
	engine = new TetraEngine(renderer, 20, (20/2), (20/20), (20/1), (20/10)); // TODO: Make timing options more readable
	engine.openStartingView();
	engine.draw();
}

// When a key has been pressed
function onKeyDown(event) {
	engine.keyDown(event);
}

// When a key has been released
function onKeyUp(event) {
	engine.keyUp(event);
}

// Progress the game
function process() {
	engine.tick();
	engine.draw();
}

// When the document is ready
document.addEventListener("DOMContentLoaded", function (event) {
	init();

	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);

	setInterval(process, 1000 / engine.rps);
});