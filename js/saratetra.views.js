/**
 * Saratetra view base class.
 */
class View {
	constructor(engine) {
		this.engine = engine;
		this.controller = new Controller(engine); // default controller
		this.time = 0;
		this.blockDraw = true;
		this.blockTick = true;
		this.blockInput = true;
		this.onClose = null;
	}
	tick() {
		this.time++;
	}
	draw(renderer) {
		// ...
	}
	close() {
		this.engine.closeView(this);
		if (this.onClose) {
			this.onClose();
		}
	}
}

/**
 * Saratetra gameplay view class.
 */
class GameplayView extends View {
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
		this.generator = new TetrominoGenerator();
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
				var gameOver = new GameOverView(engine);

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

/**
 * Saratetra game over view class.
 */
class GameOverView extends View {
	constructor(engine) {
		super(engine);
		this.controller = new GameOverController(engine);
		this.blockInput = true;
		this.blockDraw = false;
	}
	tick() {
		View.prototype.tick.call(this);
		
		// Process actions
		if (this.controller.executeAction(UserFunctions.SELECT)) {
			// Close this view
			this.close();
		}
	}
	draw(renderer) {
		renderer.drawGameOver();
	}
}

/**
 * Saratetra title view class.
 */
class TitleView extends View {
	constructor(engine, flashRate) {
		super(engine);
		this.flashRate = flashRate;
		this.controller = new TitleController(engine);
		this.noticeVisible = false;
		this.background = new Image();
		this.background.src = "img/stars.jpg";
		this.logo = new Array(23);
		for (var i = 0; i < 23; i++) {
			this.logo[i] = new Array(13);
		}

		// S
		this.logo[0][0] = BLOCK_RED;
		this.logo[1][0] = BLOCK_RED;
		this.logo[2][0] = BLOCK_RED;
		this.logo[0][1] = BLOCK_RED;
		this.logo[0][2] = BLOCK_RED;
		this.logo[1][2] = BLOCK_RED;
		this.logo[2][2] = BLOCK_RED;
		this.logo[2][3] = BLOCK_RED;
		this.logo[0][4] = BLOCK_RED;
		this.logo[1][4] = BLOCK_RED;
		this.logo[2][4] = BLOCK_RED;

		// A
		this.logo[4][0] = BLOCK_BLUE;
		this.logo[5][0] = BLOCK_BLUE;
		this.logo[6][0] = BLOCK_BLUE;
		this.logo[4][1] = BLOCK_BLUE;
		this.logo[6][1] = BLOCK_BLUE;
		this.logo[4][2] = BLOCK_BLUE;
		this.logo[5][2] = BLOCK_BLUE;
		this.logo[6][2] = BLOCK_BLUE;
		this.logo[4][3] = BLOCK_BLUE;
		this.logo[6][3] = BLOCK_BLUE;
		this.logo[4][4] = BLOCK_BLUE;
		this.logo[6][4] = BLOCK_BLUE;

		// R
		this.logo[8][0] = BLOCK_ORANGE;
		this.logo[9][0] = BLOCK_ORANGE;
		this.logo[8][1] = BLOCK_ORANGE;
		this.logo[10][1] = BLOCK_ORANGE;
		this.logo[8][2] = BLOCK_ORANGE;
		this.logo[9][2] = BLOCK_ORANGE;
		this.logo[8][3] = BLOCK_ORANGE;
		this.logo[10][3] = BLOCK_ORANGE;
		this.logo[8][4] = BLOCK_ORANGE;
		this.logo[10][4] = BLOCK_ORANGE;

		// A
		this.logo[12][0] = BLOCK_YELLOW;
		this.logo[13][0] = BLOCK_YELLOW;
		this.logo[14][0] = BLOCK_YELLOW;
		this.logo[12][1] = BLOCK_YELLOW;
		this.logo[14][1] = BLOCK_YELLOW;
		this.logo[12][2] = BLOCK_YELLOW;
		this.logo[13][2] = BLOCK_YELLOW;
		this.logo[14][2] = BLOCK_YELLOW;
		this.logo[12][3] = BLOCK_YELLOW;
		this.logo[14][3] = BLOCK_YELLOW;
		this.logo[12][4] = BLOCK_YELLOW;
		this.logo[14][4] = BLOCK_YELLOW;

		// -
		this.logo[16][2] = BLOCK_PURPLE;
		this.logo[17][2] = BLOCK_PURPLE;
		this.logo[18][2] = BLOCK_PURPLE;

		// T
		this.logo[4][8] = BLOCK_GREEN;
		this.logo[5][8] = BLOCK_GREEN;
		this.logo[6][8] = BLOCK_GREEN;
		this.logo[5][9] = BLOCK_GREEN;
		this.logo[5][10] = BLOCK_GREEN;
		this.logo[5][11] = BLOCK_GREEN;
		this.logo[5][12] = BLOCK_GREEN;

		// E
		this.logo[8][8] = BLOCK_CYAN;
		this.logo[9][8] = BLOCK_CYAN;
		this.logo[10][8] = BLOCK_CYAN;
		this.logo[8][9] = BLOCK_CYAN;
		this.logo[8][10] = BLOCK_CYAN;
		this.logo[9][10] = BLOCK_CYAN;
		this.logo[10][10] = BLOCK_CYAN;
		this.logo[8][11] = BLOCK_CYAN;
		this.logo[8][12] = BLOCK_CYAN;
		this.logo[9][12] = BLOCK_CYAN;
		this.logo[10][12] = BLOCK_CYAN;

		// T
		this.logo[12][8] = BLOCK_RED;
		this.logo[13][8] = BLOCK_RED;
		this.logo[14][8] = BLOCK_RED;
		this.logo[13][9] = BLOCK_RED;
		this.logo[13][10] = BLOCK_RED;
		this.logo[13][11] = BLOCK_RED;
		this.logo[13][12] = BLOCK_RED;

		// R
		this.logo[16][8] = BLOCK_BLUE;
		this.logo[17][8] = BLOCK_BLUE;
		this.logo[16][9] = BLOCK_BLUE;
		this.logo[18][9] = BLOCK_BLUE;
		this.logo[16][10] = BLOCK_BLUE;
		this.logo[17][10] = BLOCK_BLUE;
		this.logo[16][11] = BLOCK_BLUE;
		this.logo[18][11] = BLOCK_BLUE;
		this.logo[16][12] = BLOCK_BLUE;
		this.logo[18][12] = BLOCK_BLUE;

		// A
		this.logo[20][8] = BLOCK_ORANGE;
		this.logo[21][8] = BLOCK_ORANGE;
		this.logo[22][8] = BLOCK_ORANGE;
		this.logo[20][9] = BLOCK_ORANGE;
		this.logo[22][9] = BLOCK_ORANGE;
		this.logo[20][10] = BLOCK_ORANGE;
		this.logo[21][10] = BLOCK_ORANGE;
		this.logo[22][10] = BLOCK_ORANGE;
		this.logo[20][11] = BLOCK_ORANGE;
		this.logo[22][11] = BLOCK_ORANGE;
		this.logo[20][12] = BLOCK_ORANGE;
		this.logo[22][12] = BLOCK_ORANGE;
	}
	tick() {
		View.prototype.tick.call(this);

		// Flash notice
		if (this.time % this.flashRate == 0) {
			this.noticeVisible = !this.noticeVisible;
		}
		// Process actions
		if (this.controller.executeAction(UserFunctions.SELECT)) {
			// Go to character creation view
			this.engine.openView(new GameplayView(this.engine));
		}
	}
	draw(renderer) {
		renderer.drawBackground(this.background);
		renderer.drawTitle(this.logo, this.noticeVisible);
	}
}