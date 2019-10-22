var MenuView = require("../views/saratetra.view.menu.js");
var UserFunctions = require("../saratetra.input.js").UserFunctions;

test("menu starts with an index of 0", () => {
    var view = new MenuView(null);
    expect(view.index).toBe(0);
});

test("pressing DOWN moves the index to the next item", () => {
    var view = new MenuView(null, ["ONE", "TWO"]);

    view.controller.startAction(UserFunctions.DOWN);
    view.controller.executeActions();

    expect(view.index).toBe(1);
});

test("pressing DOWN cannot take the index down further than the total items", () => {
    var view = new MenuView(null, ["ONE", "TWO", "THREE"]);

    for (var i = 0; i < 10; i++) {
        view.controller.startAction(UserFunctions.DOWN);
        view.controller.executeActions();
    }

    expect(view.index).toBe(2);
});

test("pressing UP moves the index back to the previous item", () => {
    var view = new MenuView(null, ["ONE", "TWO"]);

    view.controller.startAction(UserFunctions.DOWN);
    view.controller.executeActions();

    expect(view.index).toBe(1);

    view.controller.startAction(UserFunctions.UP);
    view.controller.executeActions();

    expect(view.index).toBe(0);
});

test("pressing UP cannot take the index up further than 0", () => {
    var view = new MenuView(null, ["ONE", "TWO"]);

    for (var i = 0; i < 10; i++) {
        view.controller.startAction(UserFunctions.UP);
        view.controller.executeActions();
    }

    expect(view.index).toBe(0);
});