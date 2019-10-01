/**
 * UserFunctions enumeration.
 */
var UserFunctions = Object.freeze({
	ANY: 0,
	LEFT: 1,
	UP: 2,
	RIGHT: 3,
	DOWN: 4,
	PAUSE: 5,
	SELECT: 6,
	CANCEL: 7
});

module.exports = {
	UserFunctions: UserFunctions,

	/**
	 * Keyboard to user function mapping.
	 */
	KeyMappings: Object.freeze({
		37: UserFunctions.LEFT,
		38: UserFunctions.UP,
		39: UserFunctions.RIGHT,
		40: UserFunctions.DOWN,
		80: UserFunctions.PAUSE,
		88: UserFunctions.SELECT,
		90: UserFunctions.CANCEL
	})
};