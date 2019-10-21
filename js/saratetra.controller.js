/**
 * Saratetra action status enumeration.
 */
var ActionStatus = {
	OFF: 1,
	ON: 2
}

/**
 * Saratetra controller action class.
 */
class Action {
	constructor(onExecute, repeatable = false, repeatWait = 0) {
		this.onExecute = onExecute;
		this.status = ActionStatus.OFF;

		// These fields apply to repeatable actions only
		this.onRelease = null;
		this.repeatable = repeatable;
		this.waitTime = 0;
		this.repeatWait = repeatWait;

		// These fields are used to let repeatable actions fire at least once
		this.executed = false;
		this.cancelling = false; 
	}
	start() {
		this.status = ActionStatus.ON;
	}
	end() {
		this.status = ActionStatus.OFF;
		this.executed = false;
		this.cancelling = false;
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
	// Start an action
	startAction(userFunction) {
		var action = this.actions[userFunction];

		if (!action) {
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
				if (mutexAction && mutexAction.status == ActionStatus.ON) {
					// Clash with a mutually exclusive action, so release all buttons
					this.cancelActions();
					return;
				}
			}
		}

		// Start the action
		action.start();
	}
	// End an action
	endAction(userFunction) {
		var action = this.actions[userFunction];

		if (!action) {
			return;
		}

		// Only repeatable actions are ended manually
		if (!action.repeatable || action.status == ActionStatus.OFF) {
			return;
		}

		if (action.executed) {
			// Deactivate the action now
			action.end();

			// Trigger the onRelease event
			if (action.onRelease) {
				action.onRelease();
			}
		} else {
			// This action must be executed at least once before deactivation
			action.cancelling = true;
		}
	}
	// End all actions.
	cancelActions() {
		for (var key in this.actions) {
			if (this.actions.hasOwnProperty(key)) {
				var action = this.actions[key];

				// Only cancel actions that are ON
				if (action.status == ActionStatus.OFF) {
					continue;
				}

				// Trigger the onRelease event for repeatable actions
				if (action.repeatable && action.onRelease) {
					action.onRelease();
				}

				// End the action
				action.end();
			}
		}
	}
	// Update actions and execute as needed
	executeActions() {
		// Check all actions
		for (var key in this.actions) {
			if (this.actions.hasOwnProperty(key)) {
				var action = this.actions[key];

				// Only execute actions that are ON
				if (action.status != ActionStatus.ON) {
					continue;
				}

				if (action.repeatable) {
					// Repeatable actions continue until ended by EndAction()
					if (action.waitTime > 0) {
						// Wait for retrigger
						action.waitTime--;
					} else {
						// Repeatable actions trigger when the wait time is over
						if (action.onExecute) {
							action.onExecute();
						}

						// Action was executed at least once
						action.executed = true;

						if (action.cancelling) {
							// This action was ended too quickly, but has now executed and can end safely
							action.end();
							continue;
						}

						// Reset timer for repeat
						action.waitTime = action.repeatWait;
					}

					// Done with this repeatable action
					continue;
				}

				// Non-repeatable actions always execute
				if (action.onExecute) {
					action.onExecute();
				}

				// Non-repeatable actions end automatically and do not fire onRelease events
				action.status = ActionStatus.OFF;
			}
		}
	}
}

module.exports = {
	Controller: Controller,
	Action: Action,
	ActionStatus: ActionStatus
};