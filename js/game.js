const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#arriba');
const btnDown = document.querySelector('#abajo');
const btnLeft = document.querySelector('#izquierda');
const btnRight = document.querySelector('#derecha');
const vidas = document.querySelector('#vidas');
const tiempo = document.querySelector('#tiempo');
const record = document.querySelector('#record');

let canvasSize;
let playerPos = [0,9];
let cElem;
let mapaActual = 0;
let vidasPlayer = 3;
let timeStart;
let timeInterval;
let timePlayer;
let recordSaved;

if (localStorage.getItem('recordCalavera')) {
    recordSaved = localStorage.getItem('recordCalavera');
} else {
    recordSaved = 20000;
    localStorage.setItem('recordCalavera', recordSaved);
}
record.innerText = String(recordSaved);

// ----- EVENTOS ----- //
loadVidas();
window.addEventListener('load', canvasResize);
window.addEventListener('resize', canvasResize);
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
document.addEventListener('keydown', function(event) {
    // console.log(event);
    if (event.key === 'ArrowLeft') {
        moveLeft();
    } else if (event.key === 'ArrowUp') {
        moveUp();
    } else if (event.key === 'ArrowRight') {
        moveRight();
    } else if (event.key === 'ArrowDown') {
        moveDown();
    } else {
        return;
    }

    guardarInicioTiempo();
});

// ----- FUNCIONES ----- //
function canvasResize() {
    if (window.innerHeight > innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    } 

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    startGame();
}

function startGame() {
    cElem = (canvasSize/10) - 1;
    game.font = cElem + 'px Verdana';
    const filasArray = maps[mapaActual].split("\n");

    for (let i = 0; i < 10; i++) {
        let fila = filasArray[i];
        for (let j = 0; j < 10; j++) {
            game.fillText(emojis[fila[j]], cElem * (0 + j), (cElem * (1 + i)) - 2, cElem);
        }
    } 
    moverJugador();
}

function moverJugador() {
    game.fillText(emojis['PLAYER'], cElem * playerPos[0], (cElem * (1 + playerPos[1])) - 2, cElem);
}

function bombCollision() {
    const colision = playerPos;
    descontarVida();
    game.clearRect(0, 0, canvasSize, canvasSize);
    mapaActual = 0;
    playerPos = [0,9];
    startGame();

    game.fillText(emojis['BOMB_COLLISION'], cElem * colision[0], (cElem * (1 + colision[1])) - 2, cElem);
}

function winLevel() {
    game.fillText(emojis['WIN'], cElem * playerPos[0], (cElem * (1 + playerPos[1])) - 2, cElem);
}

function moveUp() {
    // Detectar si hay posicion superiori o si la posicion superior es una bomba 
    if (playerPos[1] > 0) {
        const mapRows = maps[mapaActual].split('\n');
        const mapRowCols = mapRows.map(row => row.split(''));
        playerPos = [playerPos[0],playerPos[1]-1];

        if (mapRowCols[playerPos[1]][playerPos[0]] == 'X') {
            // BOMB COLLISION 
            bombCollision();
        } else if (mapRowCols[playerPos[1]][playerPos[0]] == 'I') {
            // WIN, GO TO NEXT LEVEL AFTER A FEW SEC OR RESTART IF LAST MAP
            winLevel()
            nextMapLoad();
        } else {
            game.clearRect(0, 0, canvasSize, canvasSize);
            startGame();
        }

        guardarInicioTiempo();
    }
}

function moveDown() {
    if (playerPos[1] < 9) {
        const mapRows = maps[mapaActual].split('\n');
        const mapRowCols = mapRows.map(row => row.split(''));
        playerPos = [playerPos[0],playerPos[1]+1];

        if (mapRowCols[playerPos[1]][playerPos[0]] == 'X') {
            // BOMB COLLISION 
            bombCollision();
        } else if (mapRowCols[playerPos[1]][playerPos[0]] == 'I') {
            // WIN, GO TO NEXT LEVEL AFTER A FEW SEC OR RESTART IF LAST MAP
            winLevel()
            nextMapLoad();
        } else {
            game.clearRect(0, 0, canvasSize, canvasSize);
            startGame();
        }

        guardarInicioTiempo();
    }
}

function moveLeft() {
    if (playerPos[0] > 0) {
        const mapRows = maps[mapaActual].split('\n');
        const mapRowCols = mapRows.map(row => row.split(''));
        playerPos = [playerPos[0]-1,playerPos[1]];

        if (mapRowCols[playerPos[1]][playerPos[0]] == 'X') {
            // BOMB COLLISION 
            bombCollision();
        } else if (mapRowCols[playerPos[1]][playerPos[0]] == 'I') {
            // WIN, GO TO NEXT LEVEL AFTER A FEW SEC OR RESTART IF LAST MAP
            winLevel()
            nextMapLoad();
        } else {
            game.clearRect(0, 0, canvasSize, canvasSize);
            startGame();
        }

        guardarInicioTiempo();
    }
}

function moveRight() {
    if (playerPos[0] < 9) {
        const mapRows = maps[mapaActual].split('\n');
        const mapRowCols = mapRows.map(row => row.split(''));
        playerPos = [playerPos[0]+1,playerPos[1]];

        if (mapRowCols[playerPos[1]][playerPos[0]] == 'X') {
            // BOMB COLLISION 
            bombCollision();
        } else if (mapRowCols[playerPos[1]][playerPos[0]] == 'I') {
            // WIN, GO TO NEXT LEVEL AFTER A FEW SEC OR RESTART IF LAST MAP
            winLevel()
            nextMapLoad();
        } else {
            game.clearRect(0, 0, canvasSize, canvasSize);
            startGame();
        }

        guardarInicioTiempo();
    }
}

function nextMapLoad() {
    if (mapaActual == maps.length-1) {
        mapaActual = 0;
        playerPos = [0,9];
        lastWin();
    } else {
        mapaActual++;
    }
    game.clearRect(0, 0, canvasSize, canvasSize);
    startGame();
}

function descontarVida() {
    vidasPlayer--;

    if (vidasPlayer == 0) {
        vidasPlayer = 3;
        clearInterval(timeInterval);
        timeStart = undefined; 
    }

    loadVidas();
}

function loadVidas() {
    let stringVidas = '';
    const arrayVidas = Array(vidasPlayer).fill(emojis['HEART']);
    for (life of arrayVidas) { stringVidas += life }
    vidas.innerText = stringVidas;
}

function guardarInicioTiempo() {
    if (timeStart == undefined) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
    }
}

function showTime() {
    tiempo.innerText = String((Date.now() - timeStart) / 1000);
}

function lastWin() {
    timePlayer = Date.now();
    clearInterval(timeInterval);
    const tiempoJugador = timePlayer - timeStart;

    if (tiempoJugador < recordSaved) {
        recordSaved = tiempoJugador;
        localStorage.setItem('recordCalavera', recordSaved);
        record.innerText = String(recordSaved / 1000);
    }
}