/**
 * Tetromino block colour scheme class.
 */
class BlockColour {
	constructor(front, back, shine) {
		this.front = front;
		this.back = back;
		this.shine = shine;
	}
}

/**
 * Seratetra standard colours.
 */
var colours = {
    Red: new BlockColour("#ff0033", "#cc0000", "#ff6699"),
    Blue: new BlockColour("#1e90ff", "#0b60cc", "#7ff6ff"),
    Orange: new BlockColour("#ff8800", "#cc5500", "#ffee66"),
    Yellow: new BlockColour("#ffd700", "#cca400", "#fffd66"),
    Purple: new BlockColour("#da70d6", "#a740a3", "#ffd6fc"),
    Green: new BlockColour("#00ff44", "#00cc11", "#99ffaa"), // breaking the rules on the shine colour because otherwise it's too blue
    Cyan: new BlockColour("#b0e0e6", "#7dadb3", "#f6f6fc")
}

module.exports = {
    BlockColour: BlockColour,
    Colours: colours
};