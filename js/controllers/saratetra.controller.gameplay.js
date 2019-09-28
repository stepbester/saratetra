var Controller = require("../saratetra.controller.js").Controller;
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;

module.exports = class GameplayController extends Controller {
    constructor(engine) {
        super(engine);

        // Move the falling piece left
        this.actions[UserFunctions.LEFT] = new Action(true);
        this.actions[UserFunctions.LEFT].repeatWait = engine.moveRate;

        // Rotate the falling piece
        this.actions[UserFunctions.UP] = new Action(false);

        // Rotate the falling piece right
        this.actions[UserFunctions.RIGHT] = new Action(true);
        this.actions[UserFunctions.RIGHT].repeatWait = engine.moveRate;

        // Force the falling piece lower
        this.actions[UserFunctions.DOWN] = new Action(true);

        // Pause the game
        this.actions[UserFunctions.PAUSE] = new Action(false);
    }
}