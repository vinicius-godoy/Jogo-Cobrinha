// Game Constants
const BOX_SIZE_IN_PX = 32;
const GRID_SIZE = 16;

// Directions
const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

// Event KeyCodes
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const SPACE_BAR = 32;

// Audio Files
const hurt = new Audio('../assets/audio/hurt.wav');
const eat = new Audio('../assets/audio/eat.wav');

const canvas = document.getElementById("snake"); 
const context = canvas.getContext("2d");

let score = 0;
let highscore = 0;
let direction = NONE;
let directionBuffer;
let directionBeforePause;
let isPaused = false;
const snake = [];

snake[0] = {
    x: (GRID_SIZE / 2) * BOX_SIZE_IN_PX,
    y: (GRID_SIZE / 2) * BOX_SIZE_IN_PX
}
const food = {
    x: Math.floor(Math.random() * (GRID_SIZE - 1) + 1) * BOX_SIZE_IN_PX,
    y: Math.floor(Math.random() * (GRID_SIZE - 1) + 1) * BOX_SIZE_IN_PX
}

function updateScore() {
    document.getElementById("pontuacao").innerHTML = "Pontuação: " + score; 
    document.getElementById("pontuacaoMax").innerHTML = "Pontuação Máx: " + highscore; 
}

function saveHighscore(newHighscore) {
    if (typeof +newHighscore === 'number') localStorage.setItem('highscore', newHighscore);
}

function getHighscore() {
    const highscore = localStorage.getItem('highscore');
    if (typeof +highscore === 'number') return +highscore;
    return null;
}

function drawBackground() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, GRID_SIZE * BOX_SIZE_IN_PX, GRID_SIZE * BOX_SIZE_IN_PX);
}

function drawSnake() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, BOX_SIZE_IN_PX, BOX_SIZE_IN_PX);
    }
}

function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, BOX_SIZE_IN_PX, BOX_SIZE_IN_PX);
}

function endGame() {
    if (score > highscore) {
        highscore = score;
        saveHighscore(highscore);
    }
    alert("Game Over :( | Pontuação: " + score + " | Pontuação Máxima: " + highscore);

    direction = NONE;
    directionBuffer = NONE;
    score = 0;
    snake.length = 1;
    snake[0] = {
        x: 8 * BOX_SIZE_IN_PX,
        y: 8 * BOX_SIZE_IN_PX
    };
}

function winGame() {
    if (snake.length === GRID_SIZE * GRID_SIZE) {
        alert("PARABÉNS!!! VOCÊ GANHOU O JOGO!");
        highscore = score;
        saveHighscore(highscore);
        
        score = 0;
        direction = NONE;
        directionBuffer = NONE;
        snake.length = 1;
        snake[0] = {
            x: 8 * BOX_SIZE_IN_PX,
            y: 8 * BOX_SIZE_IN_PX
        }
    }
}

function spawnFood() {
    let isFoodInsideSnake = false;

    do {
        isFoodInsideSnake = false;
        food.x = Math.floor(Math.random() * 15 + 1) * BOX_SIZE_IN_PX;
        food.y = Math.floor(Math.random() * 15 + 1) * BOX_SIZE_IN_PX;
        isFoodInsideSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    } while (isFoodInsideSnake);
}

function handleKeydown(event) {
    if (event.keyCode === LEFT_ARROW && direction !== RIGHT) directionBuffer = LEFT;
    if (event.keyCode === UP_ARROW && direction !== DOWN) directionBuffer = UP;
    if (event.keyCode === RIGHT_ARROW && direction !== LEFT) directionBuffer = RIGHT;
    if (event.keyCode === DOWN_ARROW && direction !== UP) directionBuffer = DOWN;
    if (event.keyCode === SPACE_BAR) {
        directionBeforePause = isPaused ? NONE : direction;
        direction = isPaused ? directionBeforePause : NONE;
        isPaused = !isPaused;
    } 
}

function gameTick() {
    if (isPaused) return;

    if (snake[0].x > 15 * BOX_SIZE_IN_PX) snake[0].x = 0; 
    if (snake[0].x < 0) snake[0].x = GRID_SIZE * BOX_SIZE_IN_PX;
    if (snake[0].y > 15 * BOX_SIZE_IN_PX) snake[0].y = 0;
    if (snake[0].y < 0) snake[0].y = GRID_SIZE * BOX_SIZE_IN_PX;

    for (i = 1; i < snake.length; i++) {
        const isSelfColliding = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
        if (isSelfColliding) {
            hurt.play();
            return endGame();
        }
    }

    drawBackground();
    drawSnake();
    drawFood();
    updateScore();

    let snakeHeadX = snake[0].x;
    let snakeHeadY = snake[0].y;

    if (directionBuffer) direction = directionBuffer;

    if (direction === LEFT) snakeHeadX -= BOX_SIZE_IN_PX;
    if (direction === RIGHT) snakeHeadX += BOX_SIZE_IN_PX;
    if (direction === UP) snakeHeadY -= BOX_SIZE_IN_PX;
    if (direction === DOWN) snakeHeadY += BOX_SIZE_IN_PX;

    const isCollidingWithFood = snakeHeadX === food.x && snakeHeadY === food.y;

    if (isCollidingWithFood) {
        eat.play();
        score++;
        spawnFood();
    } else {
        snake.pop();
    }

    const newHead = {
        x: snakeHeadX,
        y: snakeHeadY
    }

    snake.unshift(newHead);
}

function main() {
    if(getHighscore()) highscore = getHighscore();
    document.addEventListener('keydown', handleKeydown);
    let game = setInterval(gameTick, 100);
}

main();

