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
    }

    update() {

        // testing
        //++this.position.x;

        // testing
        /*this.position = mouse.position;

        if (mouse.left.pressed) {
            console.log('pressed left');
        }*/


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
        if (this.power > MAX_POWER) {
            return;
        }

        this.power += 120;
        this.origin.x += 5;
    }

    shoot() {
        this.onShoot(this.power, this.rotation);
        this.power = 0;
        this.origin = STICK_SHOT_ORIGIN.copy();
        this.shot = true;
    }

    reposition(position) {
        this.position = position.copy();
        this.origin = STICK_ORIGIN.copy();
        this.shot = false;
    }
}