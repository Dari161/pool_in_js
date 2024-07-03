class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    addTo(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    mult(scalar) {
        return new Vector2(scalar * this.x, scalar * this.y);
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    squaredLength() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
}