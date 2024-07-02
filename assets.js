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
    
    sprites.background = loadSprite('spr_background4.png');
    sprites.stick = loadSprite('spr_stick.png');
    sprites.whiteBall = loadSprite('spr_Ball2.png');
    sprites.redBall = loadSprite('spr_redBall2.png');
    sprites.yellowBall = loadSprite('spr_yellowBall2.png');
    sprites.blackBall = loadSprite('spr_blackBall2.png');

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