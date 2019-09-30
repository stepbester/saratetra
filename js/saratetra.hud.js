/**
 * Saratetra status box class.
 */
class LevelBox {
	constructor() {
		this.level = 1;
	}
	draw(renderer) {
		renderer.drawLevelBox(this.level);
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
	}
	resetTotals() {
		this.totals = {
			i: 0,
			o: 0,
			t: 0,
			j: 0,
			l: 0,
			s: 0,
			z: 0
		};
	}
	clear() {
		this.resetTotals();
	}
	draw(renderer) {
		renderer.drawStats(this.totals);
	}
};

module.exports = {
	LevelBox: LevelBox,
	ScoreBox: ScoreBox,
    NextBox: NextBox,
    Stats: Stats
};