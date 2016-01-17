/**
 * Saratetra view base class.
 */
function View(engine) {
	this.engine = engine;
	this.controller = new Controller(engine); // default controller
	this.time = 0;
	this.blockDraw = true;
	this.blockTick = true;
	this.blockInput = true;
	this.onClose = null;
}

View.prototype.tick = function() {
	this.time++;
}

View.prototype.draw = function(targetCanvas) {
	// ...
}

View.prototype.close = function() {
	this.engine.closeView(this);
	
	if (this.onClose) {
		this.onClose();
	}
}



/**
 * Saratetra gameplay view class.
 */
function GameplayView(engine) {
	View.call(this, engine);

	this.controller = new GameplayController();
	this.blockInput = true;
	
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

GameplayView.prototype = Object.create(View.prototype);

GameplayView.prototype.reset = function() {
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

GameplayView.prototype.draw = function(targetCanvas) {
	var context = targetCanvas.getContext("2d");
	
	// Draw background
	context.drawImage(this.background, 0, 0);
	
	// Draw components
	this.levelBox.draw(context);
	this.well.draw(context);
	this.nextBox.draw(context);
	this.stats.draw(context);
}

GameplayView.prototype.getLevelFallTime = function() {
	return FALL_TIME - (this.level * FALL_SPEED_PER_LEVEL);
}

GameplayView.prototype.tick = function() {
	View.prototype.tick.call(this);
	
	// Check state
	switch(this.well.state) {
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
				this.waitTime = ROW_CLEAR_TIME;
				
				// Update score
				// ...
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
			gameOver.onClose = function() {
				gameplay.close();
			}
			
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
			//this.well.
			break;
	}
}



/**
 * Saratetra game over view class.
 */
function GameOverView(engine) {
	View.call(this, engine);

	this.controller = new GameOverController(engine);
	
	this.blockInput = true;
	this.blockDraw = false;
}

GameOverView.prototype = Object.create(View.prototype);

GameOverView.prototype.tick = function() {
	View.prototype.tick.call(this);
	
	// Process actions
	if (this.controller.executeAction(UserFunctions.SELECT)) {
		// Close this view
		this.close();
	}
}

GameOverView.prototype.draw = function(targetCanvas) {
	var context = targetCanvas.getContext("2d");
	
	// Box borders
	var boxHeight = 90;
	var boxWidth = 240;
	var boxLeft = (SCREEN_WIDTH - boxWidth) / 2;
	var boxTop = (SCREEN_HEIGHT - boxHeight) / 2;
	
	// Outer border
	context.strokeStyle = COLOUR_BORDER;
	context.lineWidth = 2;
	context.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);
	
	// Back colour
	context.fillStyle = COLOUR_BACK;
	context.fillRect(boxLeft, boxTop, boxWidth, boxHeight);
	
	// Message
	context.font = "bold 26px Arial";
	context.fillStyle = COLOUR_TEXT;
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText("GAME OVER", boxLeft + boxWidth / 2, boxTop + boxHeight / 2);
}



/**
 * Saratetra title view class.
 */
function TitleView(engine) {
	View.call(this, engine);
	
	this.controller = new TitleController();
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

TitleView.prototype = Object.create(View.prototype);

TitleView.prototype.tick = function() {
	View.prototype.tick.call(this);
	
	// Flash notice
	if (this.time % FLASH_TIME == 0) {
		this.noticeVisible = !this.noticeVisible;
	}
	
	// Process actions
	if (this.controller.executeAction(UserFunctions.SELECT)) {
		// Go to character creation view
		this.engine.openView(new GameplayView());
	}
}

TitleView.prototype.draw = function(targetCanvas) {
	var context = targetCanvas.getContext("2d");
	
	// Frame borders
	var frameHeight = 15 * BLOCK_HEIGHT;
	var frameWidth = 25 * BLOCK_WIDTH;
	var frameLeft = (SCREEN_WIDTH - frameWidth) / 2;
	var frameTop = (SCREEN_HEIGHT - frameHeight) / 2;

	// Draw background
	context.drawImage(this.background, 0, 0);
	
	// Outer border
	context.strokeStyle = COLOUR_BORDER;
	context.lineWidth = 2;
	context.strokeRect(frameLeft, frameTop, frameWidth, frameHeight);
	
	context.save();
	// {
		// Clip inside of border
		context.beginPath();
		context.rect(frameLeft + 1, frameTop + 1, frameWidth - 2, frameHeight - 2);
		context.clip();
	
		// Back colour
		context.fillStyle = COLOUR_BACK;
		context.fillRect(frameLeft, frameTop, frameWidth, frameHeight);
		
		// Logo
		var logoLeft = (SCREEN_WIDTH - 23 * BLOCK_WIDTH) / 2;
		var logoTop = (SCREEN_HEIGHT - 13 * BLOCK_HEIGHT) / 2;
		for (var x = 0; x < this.logo.length; x++) {
			for (var y = 0; y < this.logo[x].length; y++) {
				if (this.logo[x][y]) {
					var blockX = logoLeft + x * BLOCK_WIDTH;
					var blockY = logoTop + y * BLOCK_HEIGHT;
					drawBlock(context, blockX, blockY, this.logo[x][y]);
				}
			}
		}
		
		// Press any key
		if (this.noticeVisible) {
			context.fillStyle = COLOUR_TEXT;
			context.font = "bold 32px Arial";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillText("PRESS THE 'X' KEY", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
		}
	// }
	context.restore();
}