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
    
    writeText(text) {
        // Set text properties
        this.ctx.font = '80px Arial'; // Font size and family
        this.ctx.fillStyle = 'black'; // Fill color
        this.ctx.textAlign = 'center'; // Horizontal alignment
        this.ctx.textBaseline = 'middle'; // Vertical alignment

        // Write text on the canvas
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        console.log(text);
    }
}

let canvas = new Canvas2D();