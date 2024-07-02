let gameRunning = false;

class Game {
    init() {
        this.gameWorld = new GameWorld();
    }

    start() {
        gameRunning = true;
        poolGame.init();
        poolGame.mainLoop();
    }

    mainLoop() {
        canvas.clear();
        poolGame.gameWorld.update();
        if (gameRunning) {// check gameRunning after update(), because it is the only method that can alter that
            poolGame.gameWorld.draw();
            mouse.reset();

            requestAnimationFrame(poolGame.mainLoop);
        }
    }

    stop() {
        gameRunning = false;
        poolGame.gameWorld.draw(); // make a last draw, but without update
    }
}

let poolGame = new Game();