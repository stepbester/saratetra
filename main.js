var Images = require("./js/saratetra.images.js");
var CanvasRenderer = require("./js/saratetra.canvas.js");
var TetraEngine = require("./js/saratetra.engine.js");

document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById("tetra-game");

    var images = [
        new Images.ImageDefinition("title", "img/title_stars.jpg"),
        new Images.ImageDefinition("lv01", "img/01_thrusters.jpg"),
        new Images.ImageDefinition("lv02", "img/02_launch.jpg"),
        new Images.ImageDefinition("lv03", "img/03_earth.jpg"),
        new Images.ImageDefinition("lv04", "img/04_moon.jpg"),
        new Images.ImageDefinition("lv05", "img/05_space.jpg"),
        new Images.ImageDefinition("lv06", "img/06_nebula.jpg"),
        new Images.ImageDefinition("lv07", "img/07_danger.jpg"),
        new Images.ImageDefinition("lv08", "img/08_galaxy.jpg"),
        new Images.ImageDefinition("lv09", "img/09_flare.jpg"),
        new Images.ImageDefinition("lv10", "img/10_astronaut.jpg"),
    ];

    var cache = new Images.ImageCache(images);
    var renderer = new CanvasRenderer(canvas, 800, 600, cache);
    new TetraEngine(renderer, cache);
});