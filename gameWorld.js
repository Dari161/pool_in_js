const DELTA = 1/177;
const HOLE_RADIUS = 54;

class GameWorld {

    constructor() {

        this.balls = [
            [new Vector2(413, 413), COLOR.WHITE],//0 white
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
            [new Vector2(1162, 491), COLOR.YELLOW]//15
        ].map(params => new Ball(params[0], params[1]));

        this.whiteBall = this.balls[0];
        this.stick = new Stick(new Vector2(413, 413), this.whiteBall.shoot.bind(this.whiteBall));
    
        this.table = {
            topY: 57,
            rightX: 1443,
            bottomY: 768,
            leftX: 57
        };

        this.holes = [
            new Vector2(58, 58),
            new Vector2(58, 767),

            new Vector2(750, 23),
            new Vector2(750, 802),

            new Vector2(1442, 58),
            new Vector2(1442, 767)
        ];

        this.redCount = 7;
        this.yellowCount = 7;
    }

    handleHoles() {
        const ballsToRemove = [];
    
        this.balls.forEach(ball => {
            if (ball.moving) { // no need to check against every holl, if the ball isn't even moving
                this.holes.forEach(hole => {
                    const dist = ball.position.subtract(hole).length();
                    if (dist <= HOLE_RADIUS) {
                        // Mark ball for removal
                        ballsToRemove.push(ball);
                    }
                });
            }
        });
    
        // Remove marked balls from this.balls
        ballsToRemove.forEach(ballToRemove => {
            const index = this.balls.indexOf(ballToRemove);

            if (ballToRemove.color === COLOR.WHITE) { // white ball never gets removed
                // it get repositioned
                // TODO: But what if there is a ball on the place it will be repositioned to
                ballToRemove.position = new Vector2(413, 413);
                ballToRemove.velocity = new Vector2();
                ballToRemove.moving = false;
            } else {
                if (ballToRemove.color === COLOR.RED) {
                    --this.redCount;
                    this.stick.redWentInHoleThisTurn = true;
                } else if (ballToRemove.color === COLOR.YELLOW) {
                    --this.yellowCount;
                    this.stick.yellowWentInHoleThisTurn = true;
                } else if (ballToRemove.color === COLOR.BLACK) {
                    if (this.stick.turn === PLAYER.RED) {
                        if (this.redCount === 0) {
                            this.redWin();
                        } else {
                            this.yellowWin();
                        }
                    } else { // yellow player
                        if (this.yellowCount === 0) {
                            this.yellowWin();
                        } else {
                            this.redWin();
                        }
                    }
                }
                this.balls.splice(index, 1);
                //console.log('Ball removed from this.balls');
            }
        });
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
    }

    update() {

        this.handleCollisions();

        this.stick.update();

        this.balls.forEach(ball => ball.update(DELTA));

        this.handleHoles();

        if (!this.ballsMoving() && this.stick.shot) {
            this.stick.reposition(this.whiteBall.position);
        }
    }

    draw() {
        if (this.stick.turn === PLAYER.YELLOW) { // based on whos turn it is
            canvas.ctx.fillStyle = 'rgb(210, 210, 0)';
        } else { // red player
            canvas.ctx.fillStyle = 'rgb(210, 0, 0)';
        }
        canvas.ctx.fillRect(0, 0, 1500, 825);

        canvas.ctx.fillStyle = 'rgb(95, 55, 23)';
        canvas.ctx.fillRect(30, 30, 1440, 765);

        canvas.ctx.fillStyle = '#136902';
        canvas.ctx.fillRect(57, 57, 1386, 711);

        this.holes.forEach(hole => this.drawHole(hole));

        this.balls.forEach(ball => ball.draw());
        this.stick.draw();
    }

    drawHole(hole) {
        canvas.ctx.beginPath();
        canvas.ctx.arc(hole.x, hole.y, HOLE_RADIUS, 0, 2 * Math.PI);
        canvas.ctx.fillStyle = 'black'; // Fill color
        canvas.ctx.fill(); // Fill the circle with the current fill color
    }

    ballsMoving() {
        return this.balls.some(ball => ball.moving);
    }

    yellowWin() {
        poolGame.stop();
        canvas.writeText('A sárga nyert!');
        console.log('sarga');
    }

    redWin() {
        poolGame.stop();
        canvas.writeText('A piros nyert!');
        console.log('piros');
    }
}