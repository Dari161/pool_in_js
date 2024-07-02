const DELTA = 1/177;

class GameWorld {

    constructor() {

        this.balls = [
            [new Vector2(1022, 413), COLOR.YELLOW],//1
            [new Vector2(1056, 393), COLOR.YELLOW],//2
            [new Vector2(1056, 433), COLOR.RED],//3
            [new Vector2(1090, 374), COLOR.RED],//4
            [new Vector2(1090, 413), COLOR.BLACK],//5
            [new Vector2(1090, 452), COLOR.YELLOW],//6
            [new Vector2(1126, 354), COLOR.YELLOW],//7
            [new Vector2(1126, 393), COLOR.RED],//8
            [new Vector2(1126, 433), COLOR.YELLOW],//9
            [new Vector2(1126, 472), COLOR.RED],//10
            [new Vector2(1162, 335), COLOR.RED],//11
            [new Vector2(1162, 374), COLOR.RED],//12
            [new Vector2(1162, 413), COLOR.YELLOW],//13
            [new Vector2(1162, 452), COLOR.RED],//14
            [new Vector2(1162, 491), COLOR.YELLOW],//15
            [new Vector2(413, 413), COLOR.WHITE]
        ].map(params => new Ball(params[0], params[1]));

        this.whiteBall = this.balls[this.balls.length - 1];
        this.stick = new Stick(new Vector2(413, 413), this.whiteBall.shoot.bind(this.whiteBall));
    
        this.table = {
            topY: 57,
            rightX: 1443,
            bottomY: 768,
            leftX: 57
        };

    }

    handleCollisions() {
        for (let i = 0; i < this.balls.length; ++i) {
            //this.balls[i].collideWith(table);
            this.balls[i].collideWithTable(this.table);
            for (let j = i + 1; j < this.balls.length; ++j) {
                const ballA = this.balls[i];
                const ballB = this.balls[j];
                //ballA.collideWith(ballB/*, DELTA*/);
                ballA.collideWithBall(ballB);
            }
        }

        /*this.balls.forEach((ballA, i) =>
            this.balls.slice(i + 1).forEach(ballB =>
                ballA.collideWith(ballB, DELTA)
            )
        );*/
    }

    update() {

        this.handleCollisions();

        this.stick.update();

        /*for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].update(DELTA);
        }*/
        this.balls.forEach(ball => ball.update(DELTA));

        if (!this.ballsMoving() && this.stick.shot) {
            this.stick.reposition(this.whiteBall.position);
        }
    }

    draw() {
        canvas.drawImage(sprites.background, {x: 0, y: 0});

        this.stick.draw();
        this.balls.forEach(ball => ball.draw());
    }

    ballsMoving() {
        /*let moving = false;
        this.balls.forEach(ball => {if (ball.moving) {moving = true; break;}});
        return moving;*/

        return this.balls.some(ball => ball.moving);
    }
}