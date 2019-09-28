var Controller = require("../saratetra.controller.js").Controller;
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;

module.exports = class TitleController extends Controller {
	constructor(engine) {
		super(engine);
		this.actions[UserFunctions.SELECT] = new Action(false);
	}
}