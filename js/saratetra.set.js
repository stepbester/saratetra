/**
 * Generic set class.
 */
function Set() {
	this.values = {};
}

Set.prototype.clear = function() {
	this.values = {};
}

Set.prototype.add = function(value) {
	this.values[value] = true;
}

Set.prototype.remove = function(value) {
	delete this.values[value];
}

Set.prototype.contains = function(value) {
	return Object.prototype.hasOwnProperty.call(this.values, value);
}