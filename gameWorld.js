const DELTA = 1/177;
const HOLE_RADIUS = 50;

const TWO_PI = Math.PI * 2;

getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
}

class GameWorld {

    constructor() {

        this.middleX = Math.ceil(canvas.canvas.height / 2);

        const startXCoord = 1022;
        const XCoordGap = 35;
        /*this.xCoords = new Array(5);
        for (let i = 0; i < this.xCoords.length; ++i) {
            this.xCoords[i] = startXCoord + i * XCoordGap;
        }*/
        this.xCoords = Array.from({ length: 5 }, (_, i) => startXCoord + i * XCoordGap);            
        //const xCoords = [startXCoord, startXCoord + 35, startXCoord + 2 * 35, startXCoord + 3 * 35, startXCoord + 4 * 35];

        this.balls = [
            [new Vector2(this.middleX, this.middleX), COLOR.WHITE],//0 white
            [new Vector2(this.xCoords[0], 413), COLOR.YELLOW],//1
            [new Vector2(this.xCoords[1], 393), COLOR.YELLOW],//2
            [new Vector2(this.xCoords[1], 433), COLOR.RED],//3
            [new Vector2(this.xCoords[2], 374), COLOR.RED],//4
            [new Vector2(this.xCoords[2], 413), COLOR.BLACK],//5
            [new Vector2(this.xCoords[2], 452), COLOR.YELLOW],//6
            [new Vector2(this.xCoords[3], 354), COLOR.YELLOW],//7
            [new Vector2(this.xCoords[3], 393), COLOR.RED],//8
            [new Vector2(this.xCoords[3], 433), COLOR.YELLOW],//9
            [new Vector2(this.xCoords[3], 472), COLOR.RED],//10
            [new Vector2(this.xCoords[4], 335), COLOR.RED],//11
            [new Vector2(this.xCoords[4], 374), COLOR.RED],//12
            [new Vector2(this.xCoords[4], 413), COLOR.YELLOW],//13
            [new Vector2(this.xCoords[4], 452), COLOR.RED],//14
            [new Vector2(this.xCoords[4], 491), COLOR.YELLOW]//15
        ].map(params => new Ball(params[0], params[1]));

        this.whiteBall = this.balls[0];
        this.stick = new Stick(new Vector2(this.middleX, this.middleX), this.whiteBall.shoot.bind(this.whiteBall));
    
        this.rimThicness = 57;
        this.outterRimThicness = 30;

        this.table = {
            topY: this.rimThicness,
            rightX: canvas.canvas.width - this.rimThicness,
            bottomY: canvas.canvas.height - this.rimThicness,
            leftX: this.rimThicness
        };

        this.tableWidth = this.table.rightX - this.table.leftX;
        this.tableHeight = this.table.bottomY - this.table.topY;

        this.outterTableWidth = canvas.canvas.width - 2 * this.outterRimThicness;
        this.outterTableHeight = canvas.canvas.height - 2* this.outterRimThicness;

        this.leftRandomWHiteBallBound = this.table.leftX + HOLE_RADIUS + BALL_DIAMETER;
        this.rightRandomWhiteBallBound = this.table.rightX + HOLE_RADIUS + BALL_DIAMETER;
        this.topRandomWhiteBallBound = this.table.topY - HOLE_RADIUS - BALL_DIAMETER;
        this.bottomRandomWhiteBallBound = this.table.bottomY - HOLE_RADIUS - BALL_DIAMETER;

        const middleX = (this.table.leftX + this.table.rightX) / 2;

        this.holes = [
            new Vector2(this.table.leftX, this.table.topY),
            new Vector2(this.table.leftX, this.table.bottomY),

            new Vector2(middleX, this.table.topY),
            new Vector2(middleX, this.table.bottomY),

            new Vector2(this.table.rightX, this.table.topY),
            new Vector2(this.table.rightX, this.table.bottomY)
        ];

        this.redCount = 7;
        this.yellowCount = 7;

        this.repositionWhiteBallNeeded = false;
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

            // TODO: dont reposition the ball, while other balls are moving
            if (ballToRemove.color === COLOR.WHITE) {
                this.repositionWhiteBallNeeded = true;
            } else if (ballToRemove.color === COLOR.RED) {
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

    isWhiteBallSpaceOccupied(whiteBallNewPlace) {
        return this.balls.some(ball => 
            ball.position.subtract(whiteBallNewPlace).length() <= BALL_DIAMETER
        );
    }    

    update() {

        this.handleCollisions();

        this.stick.update();

        this.balls.forEach(ball => ball.update(DELTA));

        this.handleHoles();

        if (!this.ballsMoving() && this.stick.shot) {
            // white ball get added back when nothing is moving
            if (this.repositionWhiteBallNeeded) {
                this.repositionWhiteBallNeeded = false;

                let whiteBallNewPlace = new Vector2(this.middleX, this.middleX); // if this place is occupied generate new ones at random locations, until one is not occupied
                while (isWhiteBallSpaceOccupied(whiteBallNewPlace)) {
                    whiteBallNewPlace = new Vector2(
                        getRandomFloat(leftRandomWHiteBallBound, rightRandomWhiteBallBound),
                        getRandomFloat(topRandomWhiteBallBound, bottomRandomWhiteBallBound)
                    );
                }
                    
                this.balls.unshift(new Ball(whiteBallNewPlace, COLOR.WHITE)); // unsift pushes an element to the beginning of an array
                this.whiteBall = this.balls[0];
                this.stick.onShoot = this.whiteBall.shoot.bind(this.whiteBall); // redeclare onShoot in stick with new whiteBall
            }
            this.stick.reposition(this.whiteBall.position);
        }
    }

    draw() {
        if (this.stick.turn === PLAYER.YELLOW) { // based on whos turn it is
            canvas.ctx.fillStyle = 'rgb(210, 210, 0)';
        } else { // red player
            canvas.ctx.fillStyle = 'rgb(210, 0, 0)';
        }
        canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

        canvas.ctx.fillStyle = 'rgb(95, 55, 23)';
        canvas.ctx.fillRect(this.outterRimThicness, this.outterRimThicness, this.outterTableWidth, this.outterTableHeight);

        canvas.ctx.fillStyle = '#136902';
        canvas.ctx.fillRect(this.table.leftX, this.table.topY, this.tableWidth, this.tableHeight);

        this.holes.forEach(hole => this.drawHole(hole));

        this.balls.forEach(ball => ball.draw());
        this.stick.draw();
    }

    drawHole(hole) {
        canvas.ctx.beginPath();
        canvas.ctx.arc(hole.x, hole.y, HOLE_RADIUS, 0, TWO_PI);
        canvas.ctx.fillStyle = 'black'; // Fill color
        canvas.ctx.fill(); // Fill the circle with the current fill color
    }

    ballsMoving() {
        return this.balls.some(ball => ball.moving);
    }

    yellowWin() {
        poolGame.stop();
        canvas.writeText('A sárga nyert!');
    }

    redWin() {
        poolGame.stop();
        canvas.writeText('A piros nyert!');
    }
}