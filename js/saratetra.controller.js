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
	constructor(onExecute, repeatable = false, repeatWait = 0) {
		this.onExecute = onExecute;
		this.onRelease = null;
		this.status = ActionStatus.NOT_SCHEDULED;
		this.repeatable = repeatable;
		this.repeatWait = repeatWait;
		this.waitTime = 0;
	}
}

/**
 * Mutually exclusive relationship between user functions.
 */
class MutexRelationship {
	constructor(userFunctions) {
		this.userFunctions = userFunctions;
	}
}

/**
 * Saratetra controller base class.
 */
class Controller {
	constructor() {
		this.actions = [];
		this.mutexes = [];
	}
	defineAction(userFunction, action) {
		this.actions[userFunction] = action;
	}
	// Define a mutually exclusive relationship
	defineMutex(userFunctions) {
		this.mutexes.push(new MutexRelationship(userFunctions));
	}
	// Schedule an action for execution
	startAction(userFunction) {
		var action = this.actions[userFunction];

		if (!action) {
			return;
		}

		if (action.status != ActionStatus.NOT_SCHEDULED) {
			return;
		}

		// Check for mutual exclusivity
		for (var i = 0; i < this.mutexes.length; i++) {
			var mutexRelationship = this.mutexes[i];

			// Skip over mutexes that don't apply
			if (!this.mutexes[i].userFunctions.includes(userFunction)) {
				continue;
			}

			for (var j = 0; j < mutexRelationship.userFunctions.length; j++) {
				var func = mutexRelationship.userFunctions[j];

				// Skip the requested function itself
				if (func == userFunction) {
					continue;
				}

				var mutexAction = this.actions[func];
				if (mutexAction && mutexAction.status == ActionStatus.SCHEDULED) {
					// Clash with a mutually exclusive action, so release all buttons
					this.cancelActions();
					return;
				}
			}
		}

		// Schedule the action
		action.status = ActionStatus.SCHEDULED;
	}
	// Terminate a scheduled action
	endAction(userFunction) {
		var action = this.actions[userFunction];

		if (action) {
			action.status = ActionStatus.NOT_SCHEDULED;

			if (action.onRelease) {
				action.onRelease();
			}
		}
	}
	// Cancel all actions.
	cancelActions() {
		for (var key in this.actions) {
			if (this.actions.hasOwnProperty(key)) {
				this.actions[key].status = ActionStatus.NOT_SCHEDULED;
			}
		}
	}
	executeActions() {
		// Perform callbacks for every scheduled action
		for (var key in this.actions) {
			if (this.actions.hasOwnProperty(key)) {
				var action = this.actions[key];

				if (action.status == ActionStatus.SCHEDULED) {
					// Is action waiting to repeat?
					if (action.repeatable && action.waitTime > 0) {
						// Decrement waiting time
						action.waitTime--;

						// Do not execute, because we're waiting
						continue;
					}

					// Trigger callback
					if (action.onExecute) {
						action.onExecute();
					}

					if (action.repeatable) {
						// Leave scheduled
						action.waitTime = action.repeatWait;
					} else {
						// Instant action has been executed and must first be released
						action.status = ActionStatus.EXECUTED;
					}
				}
			}
		}
	}
}

module.exports = {
	Controller: Controller,
	Action: Action,
	ActionStatus: ActionStatus
};