var Tetrominoes = require("./saratetra.tetromino.js");

/**
 * Saratetra status box class.
 */
class LevelBox {
	constructor(endless) {
		this.level = 1;
		this.endless = endless;
	}
	draw(renderer) {
		if (this.endless) {
			renderer.drawLevelBox(0);
		} else {
			renderer.drawLevelBox(this.level);
		}
	}
};

/**
 * Saratetra next box class.
 */
class NextBox {
	constructor() {
		this.tetromino = null;
	}
	draw(renderer) {
		renderer.drawNextBox(this.tetromino);
	}
};

/**
 * Saratetra score box class.
 */
class ScoreBox {
	constructor() {
		this.score = 0;
		this.lines = 0;
	}
	draw(renderer) {
		renderer.drawScoreBox(this.score, this.lines);
	}
}

/**
 * Saratetra stats class.
 */
class Stats {
	constructor() {
		this.resetTotals();
		this.templates = {
			"i": new Tetrominoes.I(),
			"o": new Tetrominoes.O(),
			"t": new Tetrominoes.T(),
			"j": new Tetrominoes.J(),
			"l": new Tetrominoes.L(),
			"s": new Tetrominoes.S(),
			"z": new Tetrominoes.Z()
		}
	}
	resetTotals() {
		this.totals = {
			"i": 0,
			"o": 0,
			"t": 0,
			"j": 0,
			"l": 0,
			"s": 0,
			"z": 0,
			"sum": 0
		};
	}
	clear() {
		this.resetTotals();
	}
	draw(renderer) {
		renderer.drawStats(this.totals, this.templates);
	}
};

module.exports = {
	LevelBox: LevelBox,
	ScoreBox: ScoreBox,
	NextBox: NextBox,
	Stats: Stats
};