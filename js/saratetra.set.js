/**
 * Generic set class.
 */
class Set {
	constructor() {
		this.values = {};
	}
	clear() {
		this.values = {};
	}
	add(value) {
		this.values[value] = true;
	}
	remove(value) {
		delete this.values[value];
	}
	contains(value) {
		return Object.prototype.hasOwnProperty.call(this.values, value);
	}
}