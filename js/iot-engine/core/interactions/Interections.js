class Interactions {
    constructor(canvas) {
        this.canvas = canvas;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.mouseDown = false;
        this.mousePressed = false;
        this.keyCode = null;
        this.mouseInside = true;
        this.activeMode = null; 
        this.scrollDelta = 0;

        this.initEvents();
    }

    initEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e), false);
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e), false);
        this.canvas.addEventListener('mouseenter', (e) => this.handleMouseEnter(e), false);
        this.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e), false);
        document.addEventListener('keydown', (e) => this.handleKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.handleKeyUp(e), false);
    }

    handleMouseMove(event) {
        this.mousePos = { x: event.clientX, y: event.clientY };
        if (this.mouseInside) {
            if (this.mouseDown && !this.activeMode) {
                if (this.keyCode === 'Space') {
                    this.activeMode = 'move';
                } else if (this.keyCode === 'ShiftLeft' || this.keyCode === 'ShiftRight') {
                    this.activeMode = 'scale';
                } else {
                    this.activeMode = 'rotate';
                }
            }
        }
    }

    handleMouseDown(event) {
        this.mouseDown = true;
        this.mousePressed = true;
        this.lastMousePos = { ...this.mousePos };
        if (!this.activeMode) {
            if (this.keyCode === 'Space') {
                this.activeMode = 'move';
            } else if (this.keyCode === 'ShiftLeft' || this.keyCode === 'ShiftRight') {
                this.activeMode = 'scale';
            } else {
                this.activeMode = 'rotate';
            }
        }
    }

    handleMouseUp(event) {
        this.mouseDown = false;
        this.activeMode = null; 
    }

    handleMouseLeave(event) {
        this.mouseInside = false;
        this.mouseDown = false;
        this.activeMode = null; 
    }

    handleMouseEnter(event) {
        this.mouseInside = true;
        this.lastMousePos = { x: event.clientX, y: event.clientY };
        this.mousePos = { x: event.clientX, y: event.clientY };
    }

    handleMouseWheel(event) {
        this.scrollDelta = event.deltaY;
    }

    handleKeyDown(event) {
        this.keyCode = event.code;

        if (this.mouseDown && !this.activeMode) {
            if (event.code === 'Space') {
                this.activeMode = 'move';
            } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.activeMode = 'scale';
            } else {
                this.activeMode = 'rotate';
            }
        }
    }

    handleKeyUp(event) {
        if (this.keyCode === event.code) {
            this.keyCode = null;
            this.activeMode = null; 
        }
    }

    mousePressingDown() {
        return this.mouseDown;
    }

    mouseClickDown() {
        return this.mousePressed;
    }

    mouseRelease() {
        return !this.mouseDown && this.mousePressed;
    }

    getState() {
        return {
            mousePos: this.mousePos,
            lastMousePos: this.lastMousePos,
            mouseDown: this.mouseDown,
            mousePressed: this.mousePressed,
            keyCode: this.keyCode,
            mouseInside: this.mouseInside,
            activeMode: this.activeMode,
            scrollDelta: this.scrollDelta,
        };
    }

    resetLoop() {
        this.lastMousePos = { ...this.mousePos };
        this.mousePressed = false;
        this.scrollDelta = 0; 
    }
}
