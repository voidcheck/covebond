let board1, board2, button, play;
let circles = {};
let elem1 = [];
let bonds = {};
let isComplete = false;
let currentScene;
let popup;
let span;
let quiz = {
    "quizDetails": "Chemistry quiz details",
    "elements": [
        {
            "key": "C",
            "val": 6
        },
        {
            "key": "O",
            "val": 8
        },
        {
            "key": "H",
            "val": 10
        },
        {
            "key": "N",
            "val": 4
        }
    ]
};

let equation = {
    "eq1":{
        "bond": "CH4",
        "eq": [
            {
                "key": "C",
                "pos": "center",
                "val": 1
            },
            {
                "key": "H",
                "pos": "top",
                "val": 1
            },
            {
                "key": "H",
                "pos": "bottom",
                "val": 1
            },
            {
                "key": "H",
                "pos": "left",
                "val": 1
            },
            {
                "key": "H",
                "pos": "right",
                "val": 1
            }
        ]
    },
    "eq2":{
        "bond": "O2",
        "eq": [
            {
                "key": "O",
                "pos": "left",
                "val": 1
            },
            {
                "key": "O",
                "pos": "right",
                "val": 1
            }
        ]
    },
    "eq3":{
        "bond": "NH3",
        "eq": [
            {
                "key": "N",
                "pos": "center",
                "val": 1
            },
            {
                "key": "H",
                "pos": "top",
                "val": 1
            },
            {
                "key": "H",
                "pos": "left",
                "val": 1
            },
            {
                "key": "H",
                "pos": "right",
                "val": 1
            }
        ]
    }
}

// function preload() {
// //    loadJSON('quiz.json', getData, 'jsonp');
// }

function getData(val) {
    quiz = val;
    console.log(quiz)
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    dragEnd = loadSound('assets/drag.mp3');
    submitSound = loadSound('assets/submit.wav');
    landingScreen();

    popup = document.getElementById('popup-wrapper');
    span = document.getElementById("close");
    span.onclick = function() {
        location.reload();
    }

}

function landingScreen(){
    currentScene = "landing";
    play = createButton("Play");
    play.mouseClicked(playGame);
    play.size(100,50);
    play.position(windowWidth/2 - 100/2,windowHeight/2 - 50/2);
    play.style("font-family", "Bodoni");
    play.style("font-size", "20px");
}


function InstructionsScreen(){
    currentScene = "instruction";
}

function GameScreen(){
    currentScene = "game";
    board1 = new Board(
        (windowWidth/2) - (windowWidth - (windowWidth*10)/100)/2,
        (windowHeight/2)/2 - ((windowHeight/2)/2)/2,
        (windowWidth - (windowWidth*10)/100),
        (windowHeight/2)/2, color('hsba(160, 100%, 50%, 0.5)')
    );

    board2 = new Board(
        (windowWidth/2) - (windowWidth - (windowWidth*10)/100)/2,
        (windowHeight/2) + ((windowHeight/2)/2)/2,
        (windowWidth - (windowWidth*10)/100),
        (windowHeight/2)/2, color('hsb(160, 100%, 50%)')
    );
    makeSets();
    makeEqations();

    button = createButton("SUBMIT");
    button.mouseClicked(submitAnswer);
    button.size((windowWidth/20)*5,50);
    button.position((windowWidth/20)*10 - ((windowWidth/20)*5)/2, windowHeight - 50);
    button.style("font-family", "Bodoni");
    button.style("font-size", "20px");
}

function returnCircle( x, y, rad, name, num, occupied, dragchk, bool ) {
    return new Circle(x, y, rad, name, num, occupied, dragchk, bool);
}

function makeArrSet() { //dragable set of stack.
    for(let i in circles.bond) {
        let obj = returnCircle(
            circles.bond[i].x,
            circles.bond[i].y,
            circles.bond[i].d,
            circles.bond[i].name,
            circles.bond[i].num,
            false, 'drag', false);
            elem1.push(obj);
    }
}

function makeSets() { // Default set of stacks.
    let arr = [];
    for(let i = 0; i < quiz.elements.length; i++) {
        for(let k = 1; k <= 1; k++){ 
            let obj = returnCircle(
                (board1.x + 137.5) + (i* board1.w/4),
                (board1.y + 110),
                60,
                quiz.elements[i].key,
                quiz.elements[i].val,
                false, 'nodrag', false);
            arr.push(obj);
        }
        circles['bond'] = arr;
    }
    console.log(circles);
    makeArrSet();
}

function makeEqations() {
    for(let i in equation) {
        let arr = [];
        for(let j = 0; j < equation[i].eq.length; j++){
            let obj =  returnCircle(
                posX(i, equation[i].eq[j].pos),
                posY(equation[i].eq[j].pos),
                60, equation[i].eq[j].key,
                '', false, 'nodrag', true);
            arr.push(obj);
        }
        bonds[equation[i].bond] = arr;
    }

    function posX(i, data) {
        let x;
        if(i == 'eq1') { x = ((board2.w/2)/2)/2 + board2.x; }
        else if( i == 'eq2') { x = (board2.w/2) + board2.x; }
        else { x = (board2.w/1.6) + ((board2.w/2)/2) + board2.x; }
        switch(data) {
            case 'top':
            case 'bottom':
                break;
            case 'left':
                x = x - 50;
                break;
            case 'right':
                x = x + 50;
                break;
        }
        return x;
    }

    function posY(data) {
        let y = (board2.h/2) + board2.y;
        switch(data) {
            case 'top':
                y = y - 55;
                break;
            case 'bottom':
                y = y + 55;
                break;
            case 'left':
            case 'right':
                break;
        }
        return y;
    }
}

// Main draw method where all the rendering is done
function draw() {
    if(currentScene == "game"){
        background(220);
        board1.show();
        board2.show();
        for(let i = 0; i < circles.bond.length; i++){
            circles.bond[i].over();
            circles.bond[i].update();
            circles.bond[i].show();
        }
    
        for(let i = 0; i < elem1.length; i++) {
            elem1[i].reposition();
            elem1[i].over();
            elem1[i].update();
            elem1[i].show();
        } 
        
        for(let obj in bonds){
            for(let i = 0; i < bonds[obj].length; i++){
                bonds[obj][i].over();
                bonds[obj][i].update();
                bonds[obj][i].show();
            }
        }
    }
}

function mousePressed() { 
    for(let i = 0; i < elem1.length; i++) {
        elem1[i].pressed();
    }   
}

function mouseReleased() {
    for(let i = 0; i < elem1.length; i++) {
        elem1[i].released();
    } 
}

function checkBond(i, obj) {
    for(let j in bonds) {
        if( j == i) {
            for(let k = 0 ; k < bonds[j].length; k++) {
                if(bonds[j][k].defaultName === obj.name  && (bonds[j][k].occupied === false || bonds[j][k].occupied === undefined)){ 
                    obj.updateAxis(bonds[j][k].x, bonds[j][k].y);
                    bonds[j][k].occupied = true;
                    obj.occupied = true;
                    obj.updateNum('');
                    removeAddIndex(obj);
                    dragEnd.play();
                    return;
                } else {   /* return; */ }
            }
        } else { obj.updateAxis(obj.defaultX, obj.defaultY);}
    }
}

function removeAddIndex(obj) {
    for(let i in circles.bond) {
        if(obj.name === circles.bond[i].name){
            circles.bond[i].num -= 1;
            let obj = returnCircle(
                circles.bond[i].x,
                circles.bond[i].y,
                circles.bond[i].d,
                circles.bond[i].name,
                circles.bond[i].num, false, 'drag', false);
                elem1.push(obj);
        }
    }
    chkForTextComplete();

}

function chkForTextComplete() {
    let comp = false;
    for(let i in bonds) {
        for(let j = 0; j < bonds[i].length; j++){
            if(bonds[i][j].occupied) {
                comp = true;
            } else {
                comp = false;
                return;
            }
        }
    }
    if(comp) {
        isComplete = true;
        console.log('set complete');
        let col = color(205, 52, 19);
        button.style('background-color', col);
    }
}

function submitAnswer() {
    if(isComplete) {
        currentScene = "resultScreen";
        popup.classList.add('show');
        submitSound.play();
        console.log('perform operations');
    }
}

function playGame() {
    play.hide();
    GameScreen();
}
