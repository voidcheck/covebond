
class Board {
    constructor(x, y, w, h, fill) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.clr = fill;
    }

    show() {
        stroke(0);
        fill(this.clr);
        rect(this.x, this.y, this.w, this.h);
    }

}