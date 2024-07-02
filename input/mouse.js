handleMouseMove = (event) => {
    let x = event.pageX;
    let y = event.pageY;

    mouse.position = new Vector2(x, y);
};

handleMouseDown = (event) => {
    handleMouseMove(event);

    if (event.which === 1) {
        if (!mouse.left.down) {
            mouse.left.pressed = true;
        }
        mouse.left.down = true;
    } else if (event.which === 2) {
        if (!mouse.middle.down) {
            mouse.middle.pressed = true;
        }
        mouse.middle.down = true;
    } else if (event.which === 3) {
        if (!mouse.right.down) {
            mouse.right.pressed = true;
        }
        mouse.right.down = true;
    }
};

handleMouseUp = (event) => {
    handleMouseMove(event);

    if (event.which === 1) {
        mouse.left.down = false;
    } else if (event.which === 2) {
        mouse.middle.down = false;
    } else if (event.which === 3) {
        mouse.right.down = false;
    }
};

class mouseHandler {
    constructor() {
        this.left = new ButtonState();
        this.middle = new ButtonState();
        this.right = new ButtonState();

        this.position = new Vector2();

        document.onmousemove = handleMouseMove;
        document.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
    }

    reset() {
        this.left.pressed = false;
        this.middle.pressed = false;
        this.right.pressed = false;
    }
}

let mouse = new mouseHandler();