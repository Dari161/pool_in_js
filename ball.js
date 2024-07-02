const BALL_ORIGIN = new Vector2(25, 25);
const BALL_DIAMETER = 38;
const BALL_RADIUS = BALL_DIAMETER / 2;

class Ball {
    constructor(position, color) {
        this.position = position;
        this.velocity = new Vector2();
        this.moving = false;
        this.sprite = getBallSpriteByColor(color);
    }

    update(delta) {
        this.position.addTo(this.velocity.mult(delta));

        // apply friction
        this.velocity = this.velocity.mult(0.984);

        if (this.velocity.length() < 5) {
            this.velocity = new Vector2();
            this.moving = false;
        }
    }

    draw() {
        canvas.drawImage(this.sprite, this.position, BALL_ORIGIN);
    }

    shoot(power, rotation) {
        this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation));
        this.moving = true;
    }

    collideWithBall(ball) {
        // elastic collition (in 2D)

        // find a normal vector
        const n = this.position.subtract(ball.position);

        // find distance
        const dist = n.length();

        if (dist > BALL_DIAMETER) {
            return; // no collision occoured
        }

        // find minimum translation distance
        const mtd = n.mult((BALL_DIAMETER - dist) / dist);

        // push-pull balls apart
        this.position = this.position.add(mtd.mult(0.5));
        ball.position = ball.position.subtract(mtd.mult(0.5));

        // find unit normal vector
        const un = n.mult(1 / dist);

        // find unit tangent vector
        const ut = new Vector2(-un.y, un.x);

        // project velocities onto the unit normal and unit tangetn vectors
        const v1n = un.dot(this.velocity);
        const v1t = ut.dot(this.velocity);
        const v2n = un.dot(ball.velocity);
        const v2t = ut.dot(ball.velocity);

        // find new normal velocities
        let v1nTag = v2n;
        let v2nTag = v1n;

        // convert the scalar normal and the tangental velocities into vectors
        v1nTag = un.mult(v1nTag);
        const v1tTag = ut.mult(v1t);
        v2nTag = un.mult(v2nTag);
        const v2tTag = ut.mult(v2t);

        // update velocities
        this.velocity = v1nTag.add(v1tTag);
        ball.velocity = v2nTag.add(v2tTag);

        this.moving = true;
        ball.moving = true;
    }

    collideWithTable(table) {
        if (!this.moving) {
            return;
        }

        /*let collided = false;

        if ((this.position.y <= table.topY + BALL_RADIUS) ||
            (this.position.y >= table.bottomY - BALL_RADIUS)) {
            this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
            collided = true;
        }

        if ((this.position.x <= table.leftX + BALL_RADIUS) ||
            (this.position.x >= table.rightX - BALL_RADIUS)) {
            this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
            collided = true;
        }

        if (collided) {
            this.velocity = this.velocity.mult(0.98);
        }*/

        if ((this.position.y <= table.topY + BALL_RADIUS) ||
            (this.position.y >= table.bottomY - BALL_RADIUS)) {
            this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
            this.velocity = this.velocity.mult(0.98);
        }

        if ((this.position.x <= table.leftX + BALL_RADIUS) ||
            (this.position.x >= table.rightX - BALL_RADIUS)) {
            this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
            this.velocity = this.velocity.mult(0.98);
        }
    }

    /*collideWith(object) {
        if (object instanceof Ball) {
            this.collideWithBall(object);
        } else {
            this.collideWithTable(object);
        }
    }*/
}