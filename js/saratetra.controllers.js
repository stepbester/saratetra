/**
 * Saratetra action status enumeration.
 */
var ActionStatus = {
	NOT_SCHEDULED: 1,
	SCHEDULED: 2,
	EXECUTED: 3
}



/**
 * Saratetra controller action class.
 */
function Action(repeatable) {
	this.status = ActionStatus.NOT_SCHEDULED;
	this.repeatable = repeatable;
	this.repeatWait = 0;
	this.waitTime = 0;
}



/**
 * Saratetra controller base class.
 */
function Controller(engine) {
	this.engine = engine;
	this.actions = [];
}

// startAction(): Schedule an action for execution.
Controller.prototype.startAction = function(userFunction) {
	var action = this.actions[userFunction];
	
	if (action) {
		if (action.status == ActionStatus.NOT_SCHEDULED){
			action.status = ActionStatus.SCHEDULED;
		}
	}
}

// endAction(): Terminate a scheduled action.
Controller.prototype.endAction = function(userFunction) {
	var action = this.actions[userFunction];
	
	if (action) {
		action.status = ActionStatus.NOT_SCHEDULED;
	}
}

// executeAction(): Return whether an action is scheduled, and set to executed if so, assuming that the view will take care of it.
Controller.prototype.executeAction = function(userFunction) {
	var action = this.actions[userFunction];
	var executeAction = action.status == ActionStatus.SCHEDULED;
	if (executeAction) {
		if (action.repeatable && (action.waitTime > 0)) {
			// Decrement waiting time
			action.waitTime--;
			
			// Do not execute, because we're waiting
			return false;
		}
		
		// Repeat if possible
		if (action.repeatable) {
			// Leave scheduled
			action.waitTime = action.repeatWait;
		} else {
			// Flag as executed so that it does not run again
			action.status = ActionStatus.EXECUTED;
		}
	}
	return executeAction;
}



/**
 * Saratetra game over controller class.
 */
function GameOverController(engine) {
	Controller.call(this, engine);
	
	this.actions[UserFunctions.SELECT] = new Action(false);
}

GameOverController.prototype = Object.create(Controller.prototype);



/**
 * Saratetra title controller class.
 */
function TitleController(engine) {
	Controller.call(this, engine);
	
	this.actions[UserFunctions.SELECT] = new Action(false);
}

TitleController.prototype = Object.create(Controller.prototype);



/**
 * Saratetra gameplay controller class.
 */
function GameplayController(engine) {
	Controller.call(this, engine);
	
	// Move the falling piece left
	this.actions[UserFunctions.LEFT] = new Action(true);
	this.actions[UserFunctions.LEFT].repeatWait = MOVE_TIME;
	
	// Rotate the falling piece
	this.actions[UserFunctions.UP] = new Action(false);
	
	// Rotate the falling piece right
	this.actions[UserFunctions.RIGHT] = new Action(true);
	this.actions[UserFunctions.RIGHT].repeatWait = MOVE_TIME;
	
	// Force the falling piece lower
	this.actions[UserFunctions.DOWN] = new Action(true);
	
	// Pause the game
	this.actions[UserFunctions.PAUSE] = new Action(false);
}

GameplayController.prototype = Object.create(Controller.prototype);