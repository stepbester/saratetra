/**
 * UserFunctions enumeration.
 */
var UserFunctions = Object.freeze({
	LEFT: 1,
	UP: 2,
	RIGHT: 3,
	DOWN: 4,
	PAUSE: 5,
	SELECT: 6,
	CANCEL: 7
});


/**
 * Keyboard to user function mapping.
 */
var KeyMappings = Object.freeze({
	37: UserFunctions.LEFT,
	38: UserFunctions.UP,
	39: UserFunctions.RIGHT,
	40: UserFunctions.DOWN,
	80: UserFunctions.PAUSE,
	88: UserFunctions.SELECT,
	90: UserFunctions.CANCEL
})



/**
 * Button class.
 */
function Button(userFunction, label) {
	this.userFunction = userFunction;
	this.label = label;
	this.down = false;
}



/**
 * Gamepad class.
 */
function Gamepad() {
	// All buttons on the gamepad
	this.buttons = [
		new Button(UserFunctions.LEFT, "Left"),
		new Button(UserFunctions.UP, "Up"),
		new Button(UserFunctions.RIGHT, "Right"),
		new Button(UserFunctions.DOWN, "Down:"),
		new Button(UserFunctions.PAUSE, "Pause"),
		new Button(UserFunctions.SELECT, "Select"),
		new Button(UserFunctions.CANCEL, "Cancel")
	];
	
	// Mapping of keyboard keys to buttons
	this.mappings = {
		37: this.buttons[0],
		38: this.buttons[1],
		39: this.buttons[2],
		40: this.buttons[3],
		80: this.buttons[4],
		88: this.buttons[5],
		90: this.buttons[6]
	}
}