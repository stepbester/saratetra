/**
 * Saratetra stats class.
 */
function Stats() {
	this.resetTotals();
}

Stats.prototype.resetTotals = function() {
	this.totals = {
		i: 0,
		o: 0,
		t: 0,
		j: 0,
		l: 0,
		s: 0,
		z: 0
	}
}

Stats.prototype.clear = function() {
	this.resetTotals();
}

Stats.prototype.draw = function(context) {
	
}