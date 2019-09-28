/**
 * Saratetra stats class.
 */
module.exports = class Stats {
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