const STICK_ORIGIN = new Vector2(970, 11);
const STICK_SHOT_ORIGIN = new Vector2(950, 11);
const MAX_POWER = 7500;

class Stick {
    constructor(position, onShoot) {
        this.position = position;
        this.rotation = 0;
        this.origin = STICK_ORIGIN.copy();
        this.power = 0;
        this.onShoot = onShoot;
        this.shot = false;
        this.turn = PLAYER.RED;
        this.yellowWentInHoleThisTurn = false;
        this.redWentInHoleThisTurn = false;
    }

    update() {
        if (mouse.left.down) {
            this.increasePower();
        } else if (this.power > 0) {
            this.shoot()
        }
        
        this.updateRotation();

    }

    draw() {
        canvas.drawImage(sprites.stick, this.position, this.origin, this.rotation);
    }

    updateRotation() {
        let opposite = mouse.position.y - this.position.y;
        let adjacent = mouse.position.x - this.position.x;

        this.rotation = Math.atan2(opposite, adjacent);
    }

    increasePower() {
        if ((this.power > MAX_POWER) || this.shot) {
            return;
        }

        this.power += 120;
        this.origin.x += 5;
    }

    shoot() {
        if (this.shot) {
            return;
        }
        this.onShoot(this.power, this.rotation);
        this.power = 0;
        this.origin = STICK_SHOT_ORIGIN.copy();
        this.shot = true;
    }

    reposition(position) {
        this.position = position.copy();
        this.origin = STICK_ORIGIN.copy();
        this.shot = false;

        if (this.turn === PLAYER.RED) {
            this.turn = PLAYER.YELLOW; // yellow comes after red...
            if (this.redWentInHoleThisTurn) { // ...except if a red ball goes into a hole...
                this.turn = PLAYER.RED;
            }
            if (this.yellowWentInHoleThisTurn) { // ...except if a yellow ball goes into a hole too
                this.turn = PLAYER.YELLOW;
            }
        } else { // player yellow
            this.turn = PLAYER.RED; // red comes after yellow...
            if (this.yellowWentInHoleThisTurn) { // ...except if a yellow ball goes into a hole...
                this.turn = PLAYER.YELLOW;
            }
            if (this.redWentInHoleThisTurn) { // ...except if a red ball goes into a hole too
                this.turn = PLAYER.RED;
            }
        }

        this.yellowWentInHoleThisTurn = false;
        this.redWentInHoleThisTurn = false;
    }
}