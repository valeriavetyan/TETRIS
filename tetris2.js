let main = document.querySelector('.main');
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");


let x = 10;
let y = 20;
playfield = (new Array(y)).fill(null).map(row => (new Array(x)).fill(null).map(asd => 0))


let score = 0;
let currentLevel = 1;
let gameTimerID;
let isPaused = false;

let possibleLevels = {
    1: {
        scorePerLine: 10,
        speed: 900,
        nextLevel: 30,
    },
    2: {
        scorePerLine: 15,
        speed: 700,
        nextLevel: 100,
    },
    3: {
        scorePerLine: 20,
        speed: 500,
        nextLevel: 300,
    },
    4: {
        scorePerLine: 30,
        speed: 300,
        nextLevel: 400,
    },
    5: {
        scorePerLine: 50,
        speed: 100,
        nextLevel: Infinity,
    },
}


let figurnery = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ]
}

// let colors = {
//     I: 'red',
//     J: 'crismon',
//     L: 'brown',
//     T: 'yellow',
//     S: 'white',
//     Z: 'aqua',
//     O: 'green'
// }

let activeTetro = getNewRandomTetro();

function draw() {
    let mianInnerHTML = '';
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                mianInnerHTML += '<div class="cell movingCell"></div>';
            } else if (playfield[y][x] === 2) {
                mianInnerHTML += '<div class="cell fixedCell"></div>';
            } else {
                mianInnerHTML += '<div class="cell"></div>';
            }
        }
    }
    main.innerHTML = mianInnerHTML;
}


//  FIGURY IJNUMA NERQEV
function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollisions()) {
        activeTetro.y -= 1;
        fixTetro();
        removeFullLines();
        activeTetro = getNewRandomTetro();
        if (hasCollisions()) {
            restartGame();
        }
    }
}


function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
}


function addActiveTetro() {
    removePrevActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x]) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

// SHRJUM ENQ FIGURY
function rotateTetro() {
    const prevTetroState = activeTetro.shape;

    activeTetro.shape = activeTetro.shape[0].map((val, index) =>
        activeTetro.shape.map((row) => row[index]).reverse()
    );

    if (hasCollisions()) {
        activeTetro.shape = prevTetroState;
    }
}

// KAN BAXUMNER
function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] && (playfield[activeTetro.y + y] === undefined || playfield[activeTetro.y + y][activeTetro.x + x] === undefined || playfield[activeTetro.y + y][activeTetro.x + x] === 2)) {
                return true;
            }
        }
    }
    return false;
}


//JNJUMENQ FULL TOXERY
function removeFullLines() {
    let canRemoveLine = true;
    let filledLines = 0;
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playfield.splice(y, 1);
            playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            filledLines += 1;
        }
        canRemoveLine = true;
    }

    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 3;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 6;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 12;
            break;
    }
    scoreElem.innerHTML = score;

    if (score >= possibleLevels[currentLevel].nextLevel) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}


// STANAL RANDOM FIGUR
function getNewRandomTetro() {
    const possibleFigures = 'IOLJTSZ';
    const random = Math.floor(Math.random() * 7);
    const newTetro = figurnery[possibleFigures[random]];
    return {
        x: Math.floor((10 - newTetro[0].length) / 2),
        y: 0,
        shape: newTetro,
    }
}

function fixTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2;
            }
        }
    }
}


//GAME OVER-ic heto xaxy beruma nuyn vichakin
function restartGame() {
    isPaused = true;
    alert('GAME OVER')
    clearTimeout(gameTimerID);
    x = 10;
    y = 20;
    playfield = (new Array(y)).fill(null).map(row => (new Array(x)).fill(null).map(asd => 0))
    draw();
}


document.onkeydown = function (e) {
    if (!isPaused) {
        if (e.keyCode === 37) {
            activeTetro.x -= 1;
            if (hasCollisions()) {
                activeTetro.x += 1;
            }
        } else if (e.keyCode === 39) {
            activeTetro.x += 1;
            if (hasCollisions()) {
                activeTetro.x -= 1;
            }
        } else if (e.keyCode === 40) {
            moveTetroDown();
        } else if (e.keyCode === 38) {
            rotateTetro();
        }

        updateGameState();
    }
}


function updateGameState() {
    if (!isPaused) {
        addActiveTetro();
        draw();
    }
}

// PAUSE-i knopken
pauseButton.addEventListener('click', (e) => {
    if (e.target.innerHTML === "Pause") {
        e.target.innerHTML = "Play";
        clearTimeout(gameTimerID);
    } else {
        e.target.innerHTML = "Pause"
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
    isPaused = !isPaused; //ete true-er sarqumenq false,ete false er sarqum enq true
})

// START-i knopken
startButton.addEventListener('click', (e) => {
    isPaused = false;
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
})


scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

draw();

function startGame() {
    //debugger
    moveTetroDown();
    if (!isPaused) {
        updateGameState();
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
}