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
class Action {
	constructor(repeatable) {
		this.status = ActionStatus.NOT_SCHEDULED;
		this.repeatable = repeatable;
		this.repeatWait = 0;
		this.waitTime = 0;
	}
}

/**
 * Saratetra controller base class.
 */
class Controller {
	constructor(engine) {
		this.engine = engine;
		this.actions = [];
	}
	// startAction(): Schedule an action for execution.
	startAction(userFunction) {
		var action = this.actions[userFunction];
		if (action) {
			if (action.status == ActionStatus.NOT_SCHEDULED) {
				action.status = ActionStatus.SCHEDULED;
			}
		}
	}
	// endAction(): Terminate a scheduled action.
	endAction(userFunction) {
		var action = this.actions[userFunction];
		if (action) {
			action.status = ActionStatus.NOT_SCHEDULED;
		}
	}
	// cancelActions(): Cancel all actions.
	cancelActions() {
		for (var key in this.actions) {
			if (this.actions.hasOwnProperty(key)) {
				this.actions[key].status = ActionStatus.NOT_SCHEDULED;
			}
		}
	}
	// executeAction(): Return whether an action is scheduled, and set to executed if so, assuming that the view will take care of it.
	executeAction(userFunction) {
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
}

module.exports = {
	Controller: Controller,
	Action: Action,
	ActionStatus: ActionStatus
};