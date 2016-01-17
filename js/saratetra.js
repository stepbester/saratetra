// Game Objects
var engine;

// Game initialization
function init() {
	// Get references to document elements
	var canvas = document.getElementById("tetra-game");

	// Create game objects
	engine = new TetraEngine(canvas);
	engine.openView(new TitleView());
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
$(function() {
	init();
	
	$(this).on("keydown", onKeyDown);
	$(this).on("keyup", onKeyUp)
	
	setInterval(process, 1000 / SEC_FRAC);
});