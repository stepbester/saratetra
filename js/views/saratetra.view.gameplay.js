var View = require("../saratetra.view.js");
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;
var TetrominoGenerator = require("../saratetra.generator");
var WellComponents = require("../saratetra.well.js");
var HudComponents = require("../saratetra.hud.js");

/**
 * Saratetra gameplay view class.
 */
module.exports = class GameplayView extends View {
    constructor(onClose, options) {
        super(onClose, options);
        this.fallRate = options.fallRate;
        this.clearRate = options.clearRate;

        this.onGameOver = null;
        this.onPause = null;
        this.blockInput = true;
        this.fallSpeedPerLevel = 2;
        this.rowsPerLevel = 10;
        this.waitTime = 0;
        this.gravityActive = true;

        this.generator = new TetrominoGenerator();
        this.well = new WellComponents.Well();
        this.levelBox = new HudComponents.LevelBox();
        this.scoreBox = new HudComponents.ScoreBox();
        this.nextBox = new HudComponents.NextBox();
        this.stats = new HudComponents.Stats();
        this.reset();

        // Actions
        var view = this; // this hack
        this.controller.defineAction(UserFunctions.LEFT, new Action(() => {
            // Move the falling piece left
            view.well.steerPieceLeft();
        }, true, options.moveRate));

        this.controller.defineAction(UserFunctions.RIGHT, new Action(() => {
            // Move the falling piece right
            view.well.steerPieceRight();
        }, true, options.moveRate));

        this.controller.defineAction(UserFunctions.UP, new Action(() => {
            // Rotate the falling piece
            view.well.rotatePiece();
        }));

        var dropAction = new Action(() => {
            // Disable gravity
            view.gravityActive = false;

            // Force the falling piece lower
            view.well.dropPiece();
        }, true);
        dropAction.onRelease = () => {
            view.gravityActive = true;
        };
        this.controller.defineAction(UserFunctions.DOWN, dropAction);

        this.controller.defineAction(UserFunctions.PAUSE, new Action(() => {
            // Cannot pause during or after game over animation
            if (this.well.state == WellComponents.WellState.GAME_ENDING || this.well.state == WellComponents.WellState.GAME_OVER) {
                return;
            }

            // Pause the game
            if (view.onPause) {
                view.onPause();
            }

            // Cancel all actions so keys don't get "stuck"
            view.controller.cancelActions();
            return;
        }));

        this.controller.defineMutex([UserFunctions.LEFT, UserFunctions.RIGHT]);
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
        return this.fallRate - (this.level * this.fallSpeedPerLevel);
    }
    tick() {
        View.prototype.tick.call(this);

        // Check state
        switch (this.well.state) {
            case WellComponents.WellState.PIECE_FALLING:
                if (this.waitTime > 0) {
                    // Perform waiting
                    this.waitTime--;
                } else {
                    if (this.gravityActive) {
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
                    this.waitTime = this.clearRate;

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