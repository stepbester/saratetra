var CanvasRenderer = require("./js/saratetra.canvas.js");
var TetraEngine = require("./js/saratetra.engine.js");

document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById("tetra-game");
    var renderer = new CanvasRenderer(canvas, 800, 600);
    var engine = new TetraEngine(renderer);
});