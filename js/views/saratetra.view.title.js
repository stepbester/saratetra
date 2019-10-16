var View = require("../saratetra.view.js");
var Colours = require("../saratetra.blockColours.js").Colours;
var Action = require("../saratetra.controller.js").Action;
var UserFunctions = require("../saratetra.input.js").UserFunctions;

/**
 * Saratetra title view class.
 */
module.exports = class TitleView extends View {
    constructor(engine, flashRate) {
        super(engine);
        this.flashRate = flashRate;
        this.onStartGame = null;
        this.noticeVisible = false;
        this.logo = new Array(23);
        for (var i = 0; i < 23; i++) {
            this.logo[i] = new Array(13);
        }

        // S
        this.logo[0][0] = Colours.Red;
        this.logo[1][0] = Colours.Red;
        this.logo[2][0] = Colours.Red;
        this.logo[0][1] = Colours.Red;
        this.logo[0][2] = Colours.Red;
        this.logo[1][2] = Colours.Red;
        this.logo[2][2] = Colours.Red;
        this.logo[2][3] = Colours.Red;
        this.logo[0][4] = Colours.Red;
        this.logo[1][4] = Colours.Red;
        this.logo[2][4] = Colours.Red;

        // A
        this.logo[4][0] = Colours.Blue;
        this.logo[5][0] = Colours.Blue;
        this.logo[6][0] = Colours.Blue;
        this.logo[4][1] = Colours.Blue;
        this.logo[6][1] = Colours.Blue;
        this.logo[4][2] = Colours.Blue;
        this.logo[5][2] = Colours.Blue;
        this.logo[6][2] = Colours.Blue;
        this.logo[4][3] = Colours.Blue;
        this.logo[6][3] = Colours.Blue;
        this.logo[4][4] = Colours.Blue;
        this.logo[6][4] = Colours.Blue;

        // R
        this.logo[8][0] = Colours.Orange;
        this.logo[9][0] = Colours.Orange;
        this.logo[8][1] = Colours.Orange;
        this.logo[10][1] = Colours.Orange;
        this.logo[8][2] = Colours.Orange;
        this.logo[9][2] = Colours.Orange;
        this.logo[8][3] = Colours.Orange;
        this.logo[10][3] = Colours.Orange;
        this.logo[8][4] = Colours.Orange;
        this.logo[10][4] = Colours.Orange;

        // A
        this.logo[12][0] = Colours.Yellow;
        this.logo[13][0] = Colours.Yellow;
        this.logo[14][0] = Colours.Yellow;
        this.logo[12][1] = Colours.Yellow;
        this.logo[14][1] = Colours.Yellow;
        this.logo[12][2] = Colours.Yellow;
        this.logo[13][2] = Colours.Yellow;
        this.logo[14][2] = Colours.Yellow;
        this.logo[12][3] = Colours.Yellow;
        this.logo[14][3] = Colours.Yellow;
        this.logo[12][4] = Colours.Yellow;
        this.logo[14][4] = Colours.Yellow;

        // -
        this.logo[16][2] = Colours.Purple;
        this.logo[17][2] = Colours.Purple;
        this.logo[18][2] = Colours.Purple;

        // T
        this.logo[4][8] = Colours.Green;
        this.logo[5][8] = Colours.Green;
        this.logo[6][8] = Colours.Green;
        this.logo[5][9] = Colours.Green;
        this.logo[5][10] = Colours.Green;
        this.logo[5][11] = Colours.Green;
        this.logo[5][12] = Colours.Green;

        // E
        this.logo[8][8] = Colours.Cyan;
        this.logo[9][8] = Colours.Cyan;
        this.logo[10][8] = Colours.Cyan;
        this.logo[8][9] = Colours.Cyan;
        this.logo[8][10] = Colours.Cyan;
        this.logo[9][10] = Colours.Cyan;
        this.logo[10][10] = Colours.Cyan;
        this.logo[8][11] = Colours.Cyan;
        this.logo[8][12] = Colours.Cyan;
        this.logo[9][12] = Colours.Cyan;
        this.logo[10][12] = Colours.Cyan;

        // T
        this.logo[12][8] = Colours.Red;
        this.logo[13][8] = Colours.Red;
        this.logo[14][8] = Colours.Red;
        this.logo[13][9] = Colours.Red;
        this.logo[13][10] = Colours.Red;
        this.logo[13][11] = Colours.Red;
        this.logo[13][12] = Colours.Red;

        // R
        this.logo[16][8] = Colours.Blue;
        this.logo[17][8] = Colours.Blue;
        this.logo[16][9] = Colours.Blue;
        this.logo[18][9] = Colours.Blue;
        this.logo[16][10] = Colours.Blue;
        this.logo[17][10] = Colours.Blue;
        this.logo[16][11] = Colours.Blue;
        this.logo[18][11] = Colours.Blue;
        this.logo[16][12] = Colours.Blue;
        this.logo[18][12] = Colours.Blue;

        // A
        this.logo[20][8] = Colours.Orange;
        this.logo[21][8] = Colours.Orange;
        this.logo[22][8] = Colours.Orange;
        this.logo[20][9] = Colours.Orange;
        this.logo[22][9] = Colours.Orange;
        this.logo[20][10] = Colours.Orange;
        this.logo[21][10] = Colours.Orange;
        this.logo[22][10] = Colours.Orange;
        this.logo[20][11] = Colours.Orange;
        this.logo[22][11] = Colours.Orange;
        this.logo[20][12] = Colours.Orange;
        this.logo[22][12] = Colours.Orange;
    }
    defineActions() {
        var actions = [];
        actions[UserFunctions.SELECT] = new Action(false);
        return actions;
    }
    tick() {
        View.prototype.tick.call(this);

        // Flash notice
        if (this.time % this.flashRate == 0) {
            this.noticeVisible = !this.noticeVisible;
        }
        
        // Process actions
        if (this.controller.executeAction(UserFunctions.SELECT)) {
            if (this.onStartGame) {
                this.onStartGame();
            }
        }
    }
    draw(renderer) {
        renderer.drawBackground("title");
        renderer.drawTitle(this.logo, this.noticeVisible);
    }
}