class Interections {
    constructor() {
        this.mousepos = Vector.$();
        this.lastmousepos_up = Vector.$();
        this.lastmousepos_down = Vector.$();

        this.mousemoving = false;
        this.mousepressed = false;
        this.mousedown = false;
        this.mouseup = false;
        this.mouseleft = false;
        this.mouseright = false

        this.keydown = false;
        this.keyup = false
        this.lastkey = null;
        this.keycode = null;

        this.x = undefined;
        this.initEvents();
    }

    resetLoop(){
        this.mousedown = false;
        this.mouseup = false;
        this.mouseleft = this.mouseleft;
        this.mouseright = this.mouseright;

        this.mousepressed = this.mousepressed;

        this.keydown = false;
        this.keyup = false;

        this.lastkey = this.lastkey;

        this.mousepos = this.mousepos;

        this.lastmousepos_up = this.lastmousepos_up;
        
        // if( this.mousePressingDown() ){
        // }

        this.lastmousepos_down = this.lastmousepos_down;

        this.mousemoving = false;
        this.keycode = false;
    }

    mouseRelease(){
        if(  !this.mousepressed && this.mouseup ){
            return true;
        }

        return false;
    }

    mouseClickDown(){
        return ( this.mousepressed && this.mousedown );
    }

    mousePressingDown(){
        if(  this.mousepressed && !this.mouseup ){
            return true;
        }

        return false;
    }

    set(action, event) {
        var that = this;

        switch (action) {
            case 'mousemove':
                that.mousepos = Vector.$(event.pageX, event.pageY);
                that.mousemoving = true;
                break;

            case 'mouseup':
                that.mousepressed = false;
                that.mouseup = true;
                that.mousedown = false;
                that.lastmousepos_up = that.mousepos;
                break;

            case 'mousedown':
                that.mousepressed = true;
                that.mouseup = false;
                that.mousedown = true;
                that.lastmousepos_down = that.mousepos;
                break;

            case 'keydown':
                that.keydown = true;
                that.keyup = true;
                that.keycode = event.code;
                break;

            case 'keyup':
                that.keydown = false;
                that.keyup = true;
                that.lastkey = that.keycode;
                that.keycode = undefined;
                
                break;

            default:
                return false;

        }
    }
    initEvents() {
        var that = this;
        document.addEventListener('mousemove', function (e) {
            that.set('mousemove', e);

        }, false);

        canvas.addEventListener('mouseup', function (e) {
            that.set('mouseup', e);

        }, false);

        canvas.addEventListener('mousedown', function (e) {
            that.set('mousedown', e);
        }, false);

        document.addEventListener('keydown', (e) => {
            that.set('keydown', e);

        }, false);

        document.addEventListener('keyup', (e) => {
            that.set('keyup', e);

        }, false);
    }

    // update({ mousepos = 1 }) {
    //     // this.events = {mousepos
    // }

    get() {
        return {
            mousedown: this.mousedown,
            mouseup: this.mouseup,
            mouseleft: this.mouseleft,
            mouseright: this.mouseright,
            mousepressed: this.mousepressed,
            keydown: this.keydown,
            keyup: this.keyup,
            lastkey: this.lastkey,

            mousepos: this.mousepos,
            lastmousepos_up: this.lastmousepos_up,
            lastmousepos_down: this.lastmousepos_down,

            mousemoving: this.mousemoving,
            keycode: this.keycode
        }
    }
}
