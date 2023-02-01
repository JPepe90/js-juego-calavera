const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', canvasResize);
window.addEventListener('resize', canvasResize);

function canvasResize() {
    let canvasSize;

    if (window.innerHeight > innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    } 

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    startGame(canvasSize);
}

function startGame(canvas) {
    //game.fillRect(0,0,100,100) // { x inicio, y inicio, x fin, y fin }
    // xxxxRect --> para Rectangulos pero pueden ser lineas.  clearRect
    // game.font = '25px Verdana';
    // game.fillStyle = 'purple';
    // game.textAlign = 'center';
    // game.fillText('Platzi', 25, 25);

    let canvasSize = canvas;
    const canvasElement = (canvasSize/10) - 1;

    game.font = canvasElement + 'px Verdana';

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            
            game.fillText(emojis['X'], canvasElement * (0 + i), (canvasElement * (1 + j)) - 5, canvasElement);
        }
    } 
}