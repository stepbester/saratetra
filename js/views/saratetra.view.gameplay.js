var View = require("../saratetra.view.js");
var Action = require("../saratetra.controller.js").Action;
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
        this.onGameOver = null;
        this.onPause = null;
        this.blockInput = true;
        this.fallSpeedPerLevel = 2;
        this.rowsPerLevel = 10;
        this.generator = new Tetrominoes.Generator();
        this.waitTime = 0;
        this.well = new WellComponents.Well();
        this.levelBox = new HudComponents.LevelBox();
        this.scoreBox = new HudComponents.ScoreBox();
        this.nextBox = new HudComponents.NextBox();
        this.stats = new HudComponents.Stats();
        this.reset();
    }
    defineActions() {
        var actions = [];
        
        // Move the falling piece left
        actions[UserFunctions.LEFT] = new Action(true);
        actions[UserFunctions.LEFT].repeatWait = this.engine.moveRate;

        // Rotate the falling piece
        actions[UserFunctions.UP] = new Action(false);

        // Rotate the falling piece right
        actions[UserFunctions.RIGHT] = new Action(true);
        actions[UserFunctions.RIGHT].repeatWait = this.engine.moveRate;

        // Force the falling piece lower
        actions[UserFunctions.DOWN] = new Action(true);

        // Pause the game
        actions[UserFunctions.PAUSE] = new Action(false);

        return actions;
    }
    setLevel(value) {
        this.level = value;
        this.levelBox.level = value;
    }
    setScore(value) {
        this.score = value;
        this.scoreBox.score = value;
    }
    setLines(value) {
        this.lines = value;
        this.scoreBox.lines = value;
    }
    reset() {
        this.setLevel(1);
        this.setScore(0);
        this.setLines(0);
        this.waitTime = this.getLevelFallTime();
        this.well.clear();
        this.stats.clear();
        this.levelBox.level = this.level;
        this.scoreBox.score = this.score;
        this.well.insertPiece(this.generator.pop());
        this.nextBox.tetromino = this.generator.peek();
    }
    draw(renderer) {
        // Draw background
        var backgroundKey = "lv10";
        if (this.level < 10) {
            backgroundKey = "lv0" + this.level;
        }
        renderer.drawBackground(backgroundKey);

        // Draw components
        this.levelBox.draw(renderer);
        this.scoreBox.draw(renderer);
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
                // Pause
                if (this.controller.executeAction(UserFunctions.PAUSE)) {
                    if (this.onPause) {
                        this.onPause();
                    }

                    // Cancel all actions so keys don't get "stuck"
                    this.controller.cancelActions();
                    return;
                }

                // Get actions
                var left = this.controller.executeAction(UserFunctions.LEFT);
                var right = this.controller.executeAction(UserFunctions.RIGHT);
                var up = this.controller.executeAction(UserFunctions.UP);
                var down = this.controller.executeAction(UserFunctions.DOWN);

                // Process actions
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
                // Update totals
                this.stats.totals[this.well.fallingPiece.key] = this.stats.totals[this.well.fallingPiece.key] + 1;
                this.stats.totals.sum = this.stats.totals.sum + 1;

                // After wait, freeze the stuck piece
                this.well.freezePiece();

                // Check for rows
                this.well.eliminateRows();
                var clearedRows = this.well.getClearRowCount();
                if (clearedRows > 0) {
                    // Clearing rows introduce a pause for the player to see what is happening
                    this.waitTime = this.engine.clearRate;

                    // Update lines
                    this.setLines(this.lines + clearedRows);

                    // Update score
                    var bonus = 0;
                    switch (clearedRows) {
                        case 1:
                            bonus = 10;
                            break;
                        case 2:
                            bonus = 25;
                            break;
                        case 3:
                            bonus = 75;
                            break;
                        case 4:
                            bonus = 300;
                            break;
                    }
                    this.setScore(this.score + this.level * bonus);
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

                    // Update level
                    this.setLevel(1 + Math.floor(this.lines / this.rowsPerLevel));
                }
                break;
        }
    }
}