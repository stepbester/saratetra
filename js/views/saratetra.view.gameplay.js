var View = require("../saratetra.view.js");
var GameplayController = require("../controllers/saratetra.controller.gameplay.js");
var UserFunctions = require("../saratetra.input.js").UserFunctions;
var Tetromino = require("../saratetra.tetrominoes.js");
var LevelBox = require("../saratetra.levelBox.js");
var Well = require("../saratetra.well.js").Well;
var WellState = require("../saratetra.well.js").WellState;
var NextBox = require("../saratetra.nextBox.js");
var Stats = require("../saratetra.stats.js");
var GameOverView = require("./saratetra.view.gameover.js");

/**
 * Saratetra gameplay view class.
 */
module.exports = class GameplayView extends View {
    constructor(engine) {
        super(engine);
        this.controller = new GameplayController(engine);
        this.blockInput = true;
        this.fallSpeedPerLevel = 1;
        this.level = 1;
        this.score = 0;
        this.lines = 0;
        this.background = new Image();
        this.background.src = "img/earth.jpg";
        this.generator = new Tetromino.Generator();
        this.waitTime = 0;
        this.levelBox = new LevelBox();
        this.well = new Well();
        this.nextBox = new NextBox();
        this.stats = new Stats();
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
            case WellState.PIECE_FALLING:
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
            case WellState.PIECE_STUCK:
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
            case WellState.PENDING_NEXT_PIECE:
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
            case WellState.GAME_ENDING:
                if (this.waitTime > 0) {
                    // Lessen wait time
                    this.waitTime--;

                    // Progress game over animation
                    this.well.animateEnding(10 - this.waitTime);
                }
                break;
            case WellState.GAME_OVER:
                var gameOver = new GameOverView(this.engine);

                // When game over view is closed, return to title
                var gameplay = this;
                gameOver.onClose = function () {
                    gameplay.close();
                };

                // Display game over message
                this.engine.openView(gameOver);
                break;
            case WellState.CLEARING_ROWS:
                if (this.waitTime > 0) {
                    // Perform waiting
                    this.waitTime--;
                } else {
                    // Adjust blocks for missing rows
                    this.well.collapseDebris();
                }
                break;
            case WellState.ROWS_CLEARED:
                // TODO: Nothing?
                break;
        }
    }
}