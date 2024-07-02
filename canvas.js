class Canvas2D {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawImage(image, position, origin, rotation = 0) {
        if (!position) {
            position = new Vector2();
        }

        if (!origin) {
            origin = new Vector2();
        }

        this.ctx.save();
        this.ctx.translate(position.x, position.y);
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -origin.x, -origin.y);
        this.ctx.restore();
    }
}

let canvas = new Canvas2D();

// testing
/*let img = new Image();
img.src = './assets/sprites/spr_background4.png';

setTimeout(() => {
    canvas.drawImage(img, {x: 0, y: 0});
}, 1000);*/