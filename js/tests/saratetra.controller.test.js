var UserFunctions = require("../saratetra.input.js").UserFunctions;
var Controllers = require("../saratetra.controller.js");

test("an action defined as SELECT can be triggered by SELECT", () => {
    var triggered = false;
    var action = new Controllers.Action(function() {
        triggered = true;
    }, false);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.SELECT, action);
    controller.startAction(UserFunctions.SELECT);
    controller.executeActions();

    expect(triggered).toBe(true);
});

test("an action defined as SELECT cannot be triggered by PAUSE", () => {
    var triggered = false;
    var action = new Controllers.Action(function() {
        triggered = true;
    }, false);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.SELECT, action);
    controller.startAction(UserFunctions.PAUSE);
    controller.executeActions();

    expect(triggered).toBe(false);
});

test("a non-repeatable action is only triggered once in 3 cycles", () => {
    var triggerCount = 0;
    var action = new Controllers.Action(function() {
        triggerCount++;
    });

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action);
    controller.startAction(UserFunctions.UP);
    controller.executeActions(); // 1
    controller.executeActions();
    controller.executeActions();

    expect(triggerCount).toBe(1);
});

test("a non-repeatable action can be retriggered after the action has ended", () => {
    var triggerCount = 0;
    var action = new Controllers.Action(function() {
        triggerCount++;
    });

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action);
    controller.startAction(UserFunctions.UP);
    controller.executeActions(); // 1
    controller.executeActions();
    controller.executeActions();
    controller.endAction(UserFunctions.UP);
    controller.startAction(UserFunctions.UP);
    controller.executeActions(); // 2

    expect(triggerCount).toBe(2);
});

test("a repeatable action is triggered once every cycle", () => {
    var triggerCount = 0;
    var action = new Controllers.Action(function() {
        triggerCount++;
    }, true);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action);
    controller.startAction(UserFunctions.UP);
    controller.executeActions(); // 1
    controller.executeActions(); // 2
    controller.executeActions(); // 3

    expect(triggerCount).toBe(3);
});

test("a repeatable action is no longer triggered after the action has ended", () => {
    var triggerCount = 0;
    var action = new Controllers.Action(function() {
        triggerCount++;
    }, true);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action);
    controller.startAction(UserFunctions.UP);
    controller.executeActions(); // 1
    controller.executeActions(); // 2
    controller.endAction(UserFunctions.UP)
    controller.executeActions();

    expect(triggerCount).toBe(2);
});

test("a repeatable action with a wait time of 2 is only retriggered after 2 cycles", () => {
    var triggerCount = 0;
    var action = new Controllers.Action(function() {
        triggerCount++;
    }, true, 2);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action);
    controller.startAction(UserFunctions.UP);
    controller.executeActions(); // 1
    controller.executeActions();
    controller.executeActions();
    controller.executeActions(); // 2
    controller.executeActions();
    controller.executeActions();

    expect(triggerCount).toBe(2);
});

test("two actions can be triggered simultaneously", () => {
    var triggered1 = false;
    var action1 = new Controllers.Action(function() {
        triggered1 = true;
    }, false);

    var triggered2 = false;
    var action2 = new Controllers.Action(function() {
        triggered2 = true;
    }, false);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action1);
    controller.defineAction(UserFunctions.DOWN, action2);
    controller.startAction(UserFunctions.UP);
    controller.startAction(UserFunctions.DOWN);
    controller.executeActions();

    expect(triggered1).toBe(true);
    expect(triggered2).toBe(true);
});

test("when attempting to start two mutually exclusive actions, no actions are triggered", () => {
    var triggered1 = false;
    var action1 = new Controllers.Action(function() {
        triggered1 = true;
    }, false);

    var triggered2 = false;
    var action2 = new Controllers.Action(function() {
        triggered2 = true;
    }, false);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action1);
    controller.defineAction(UserFunctions.DOWN, action2);
    controller.defineMutex([UserFunctions.UP, UserFunctions.DOWN]);
    controller.startAction(UserFunctions.UP);
    controller.startAction(UserFunctions.DOWN);
    controller.executeActions();

    expect(triggered1).toBe(false);
    expect(triggered2).toBe(false);
});

test("when all actions are ended, none are triggered", () => {
    var triggered1 = false;
    var action1 = new Controllers.Action(function() {
        triggered1 = true;
    }, false);

    var triggered2 = false;
    var action2 = new Controllers.Action(function() {
        triggered2 = true;
    }, false);

    var controller = new Controllers.Controller();
    controller.defineAction(UserFunctions.UP, action1);
    controller.defineAction(UserFunctions.DOWN, action2);
    controller.startAction(UserFunctions.UP);
    controller.startAction(UserFunctions.DOWN);
    controller.cancelActions();
    controller.executeActions();

    expect(triggered1).toBe(false);
    expect(triggered2).toBe(false);
});