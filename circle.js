//Circles structure
class Circle {
    constructor(x, y, rad, name, num, occupied, dragchk, equation){
        this.draggable = false; // Is the object being dragged
        this.rollover = false; // Is the mouse over the ellipse
        this.defaultName = name;
        this.defaultEq = equation;
        this.name = (equation) ? '' : name;
        this.num = this.defaultNum = num;
        this.x = this.defaultX = x;
        this.y = this.defaultY = y;
        this.d = rad;
        this.offsetX = 0;
        this.offsetY = 0;
        this.occupied = (occupied != undefined) ? occupied : false;
        this.dragchk = dragchk;
    }

    show() {
        stroke(0);
        if( this.draggable ) {
            fill(50);
        } else if ( this.rollover ) {
            fill(100);
        } else {
            if(this.defaultEq) { noFill(); }
            else { fill(175, 200); }
        }

        ellipse(this.x, this.y, this.d, this.d);
        textAlign(CENTER, CENTER);
        textSize(this.d/2);
        text(this.name, this.x, this.y);
        textSize(this.d/6);
        text(this.num, this.x - this.d/6, this.y + this.d/4);
    }

    updateNum(num) {
        this.num = this.defaultNum = num;
    }
    updateAxis(x, y, offsetX, offsetY) {
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    update() {
        // Adjust location while dragging 
        if( this.draggable && this.dragchk != 'nodrag' && !this.occupied) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }

    over() {
        // Is cursor over
        if(dist(this.x, this.y, mouseX, mouseY)< this.d/2) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    pressed() {
        // circle clicked in 
        if(dist(mouseX, mouseY,this.x, this.y ) < this.d/2) {
            this.num = '';
            this.draggable = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
    }

    released() {
        // Quit dragging
        this.draggable = false;
    }

    reposition() {
        if(!this.draggable && !this.occupied){
            if((this.x  > board2.w/3+board2.x && this.x < board2.x+board2.w/1.5)  && this.y > board2.y) { 
                checkBond('O2', this);
            }
            else if(this.x  > board2.x && this.x < board2.w/3+board2.x && this.y > board2.y) { 
                checkBond('CH4', this);
            }
            else if ( this.x  > this.x < board2.x+board2.w/1.5 && this.x <board2.w+board2.x && this.y > board2.y ) { 
                checkBond('NH3', this);
            }
            else { 
                if(this.occupied != true){
                    // swipe.play();
                    this.num = this.defaultNum;
                    this.x = this.defaultX;
                    this.y = this.defaultY;
                }
            }
        }
    }

    getOccupied() {
        return this.occupied; 
    }

    setOccuppied(flat) {
        this.occupied = flat; 
    }

}