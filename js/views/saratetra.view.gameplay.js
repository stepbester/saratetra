var View = require("../saratetra.view.js");
var GameplayController = require("../controllers/saratetra.controller.gameplay.js");
var UserFunctions = require("../saratetra.input.js").UserFunctions;
var Tetrominoes = require("../saratetra.tetrominoes.js");
var WellComponents = require("../saratetra.well.js");
var HudComponents = require("../saratetra.hud.js");

/**
 * Saratetra gameplay view class.
 */
module.exports = class GameplayView extends View {
    constructor(engine) {
        super(engine);
        this.controller = new GameplayController(engine);
        this.onGameOver = null;
        this.blockInput = true;
        this.fallSpeedPerLevel = 1;
        this.level = 1;
        this.score = 0;
        this.lines = 0;
        this.background = new Image();
        this.background.src = "img/earth.jpg";
        this.generator = new Tetrominoes.Generator();
        this.waitTime = 0;
        this.well = new WellComponents.Well();
        this.levelBox = new HudComponents.LevelBox();
        this.nextBox = new HudComponents.NextBox();
        this.stats = new HudComponents.Stats();
        this.reset();
    }
    reset() {
        this.level = 1;
        this.score = 0;
        this.lines = 0;
        this.waitTime = this.getLevelFallTime();
        this.well.clear();
        this.stats.clear();
        this.levelBox.level = this.level;
        this.well.insertPiece(this.generator.pop());
        this.nextBox.tetromino = this.generator.peek();
    }
    draw(renderer) {
        // Draw background
        renderer.drawBackground(this.background);

        // Draw components
        this.levelBox.draw(renderer);
        this.well.draw(renderer);
        this.nextBox.draw(renderer);
        this.stats.draw(renderer);
    }
    getLevelFallTime() {
        return this.engine.fallRate - (this.level * this.fallSpeedPerLevel);
    }
    tick() {
        View.prototype.tick.call(this);
        // Check state
        switch (this.well.state) {
            case WellComponents.WellState.PIECE_FALLING:
                // Process actions
                var left = this.controller.executeAction(UserFunctions.LEFT);
                var right = this.controller.executeAction(UserFunctions.RIGHT);
                var up = this.controller.executeAction(UserFunctions.UP);
                var down = this.controller.executeAction(UserFunctions.DOWN);
                if ((!left) != (!right)) { // XOR
                    if (left) {
                        this.well.steerPieceLeft();
                    } else if (right) {
                        this.well.steerPieceRight();
                    }
                }
                if (up) {
                    this.well.rotatePiece();
                } else if (down) {
                    this.well.dropPiece();
                }
                if (this.waitTime > 0) {
                    // Perform waiting
                    this.waitTime--;
                } else {
                    // Do not apply gravity while the player is forcing the piece down
                    if (!down) {
                        this.well.applyGravity();
                        // Gravity wait varies by level
                        this.waitTime = this.getLevelFallTime();
                    }
                }
                break;
            case WellComponents.WellState.PIECE_STUCK:
                // After wait, freeze the stuck piece
                this.well.freezePiece();

                // Check for rows
                this.well.eliminateRows();
                var clearedRows = this.well.getClearRowCount();
                if (clearedRows > 0) {
                    // Clearing rows introduce a pause for the player to see what is happening
                    this.waitTime = this.engine.clearRate;

                    // TODO: Update score
                }
                break;
            case WellComponents.WellState.PENDING_NEXT_PIECE:
                if (this.well.isLandingClear(this.generator.peek())) {
                    // Insert a new piece
                    this.well.insertPiece(this.generator.pop());

                    // Update the next piece
                    this.nextBox.tetromino = this.generator.peek();

                    // Reset step time
                    this.waitTime = this.getLevelFallTime();
                } else {
                    // Blocked
                    this.well.endGame();

                    // Give game over animation time to finish
                    this.waitTime = 10;
                }
                break;
            case WellComponents.WellState.GAME_ENDING:
                if (this.waitTime > 0) {
                    // Lessen wait time
                    this.waitTime--;

                    // Progress game over animation
                    this.well.animateEnding(10 - this.waitTime);
                }
                break;
            case WellComponents.WellState.GAME_OVER:
                if (this.onGameOver) {
                    this.onGameOver(this);
                }
                break;
            case WellComponents.WellState.CLEARING_ROWS:
                if (this.waitTime > 0) {
                    // Perform waiting
                    this.waitTime--;
                } else {
                    // Adjust blocks for missing rows
                    this.well.collapseDebris();
                }
                break;
            case WellComponents.WellState.ROWS_CLEARED:
                // TODO: Nothing?
                break;
        }
    }
}