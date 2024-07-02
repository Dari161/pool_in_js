let sprites = {};
let assetsStillLoading = 0;

assetsLoadingLoop = (callback) => {
    if (assetsStillLoading) { // true if assetsStillLoading > 0
        requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
    } else {
        callback();
    }
};

loadAssets = (callback) => {

    loadSprite = (fileName) => {
        ++assetsStillLoading;

        let spriteImage = new Image();
        spriteImage.src = './assets/sprites/' + fileName;

        /*spriteImage.onload = function() {
            --assetsStillLoading;
        }*/
        spriteImage.onload = () => --assetsStillLoading;

        return spriteImage;
    };
    
    sprites.background = loadSprite('greenBackground.png');
    sprites.stick = loadSprite('stick.png');
    sprites.whiteBall = loadSprite('whiteBall.png');
    sprites.redBall = loadSprite('redBall.png');
    sprites.yellowBall = loadSprite('yellowBall.png');
    sprites.blackBall = loadSprite('blackBall.png');

    assetsLoadingLoop(callback);
};

getBallSpriteByColor = (color) => {
    switch (color) {
        case COLOR.RED:
            return sprites.redBall;
        case COLOR.YELLOW:
            return sprites.yellowBall;
        case COLOR.BLACK:
            return sprites.blackBall;
        case COLOR.WHITE:
            return sprites.whiteBall;
    }
};