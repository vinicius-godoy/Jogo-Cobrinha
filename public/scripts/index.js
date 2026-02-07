// Game Constants
const BOX_SIZE_IN_PX = 32;
const GRID_SIZE = 16;
const TOUCH_THRESHHOLD_IN_PX = 15;
const TICK_INTERVAL_IN_MS = 100;
const KEY_BUFFER_MAX_LENGTH = 10;
const THEMES = [
  {
    type: "solid",
    colors: ["green"],
    code: "8076657378"
  },
  {
    type: "stripe",
    colors: ["green", "darkgreen"],
    code: "8378657569"
  },
  {
    type: "head",
    colors: ["orange", "white"],
    code: "677371658269848469"
  },
  {
    type: "rainbow",
    code: "82657378667987"
  },
  {
    type: "trailing",
    colors: ['brown', '#ffa52f'],
    code: "776984697982"
  }
];
let SNAKE_THEME = THEMES[0];

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
const hurt = new Audio('public/audio/hurt.wav');
const eat = new Audio('public/audio/eat.wav');
const pause = new Audio('public/audio/pause.wav');

const KEY_BUFFER = [];
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const pauseIcon = document.getElementById("pause-icon");
canvas.width = GRID_SIZE * BOX_SIZE_IN_PX;
canvas.height = GRID_SIZE * BOX_SIZE_IN_PX;

let isStartMenu = true;
let isMoving = false;
let score = 0;
let highscore = 0;
let direction = NONE;
let directionBuffer;
let directionBeforePause;
let isPaused = false;
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;
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
  document.getElementById("score").innerHTML = score; 
  document.getElementById("highscore").innerHTML = highscore;
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
    switch (SNAKE_THEME.type) {
      case "solid":
        context.fillStyle = SNAKE_THEME.colors[0];
        break;
      case "stripe":
        context.fillStyle = SNAKE_THEME.colors[i % SNAKE_THEME.colors.length];
        break;
      case "head":
        context.fillStyle = i === 0 ? SNAKE_THEME.colors[0] : SNAKE_THEME.colors[1];
        break;
      case "rainbow":
        context.fillStyle = i === 0 ? 'white' : `hsl(${(i - 1) * 360 / snake.length}, 100%, 50%)`;
        break;
      case "trailing":
        const baseValue = Math.floor(255 * (1 - i / snake.length));
        const randomVariation = Math.floor(Math.random() * 100);
        const totalValue = Math.max(Math.min(baseValue + randomVariation, 255), 10);
        const hexValue = totalValue.toString(16).padStart(2, '0');
        context.fillStyle = i === 0 ? SNAKE_THEME.colors[0] : SNAKE_THEME.colors[1] + hexValue;
        break;
    }
    context.fillRect(snake[i].x, snake[i].y, BOX_SIZE_IN_PX, BOX_SIZE_IN_PX);
  }
}

function drawFood() {
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, BOX_SIZE_IN_PX, BOX_SIZE_IN_PX);
}

function resetGame() {
  direction = NONE;
  directionBuffer = NONE;
  score = 0;
  isMoving = false;
  isPaused = false;
  snake.length = 1;
  snake[0] = {
    x: (GRID_SIZE / 2) * BOX_SIZE_IN_PX,
    y: (GRID_SIZE / 2) * BOX_SIZE_IN_PX
  };
}

function endGame() {
  if (score > highscore) {
    highscore = score;
    saveHighscore(highscore);
  }
  alert("Game Over :( | Pontuação: " + score + " | Pontuação Máxima: " + highscore);

  resetGame();
}

function winGame() {
  alert("PARABÉNS!!! VOCÊ GANHOU O JOGO!");
  highscore = score;
  saveHighscore(highscore);
  
  resetGame();
}

function spawnFood() {
  let isFoodInsideSnake = false;

  do {
    isFoodInsideSnake = false;
    food.x = Math.floor(Math.random() * (GRID_SIZE - 1) + 1) * BOX_SIZE_IN_PX;
    food.y = Math.floor(Math.random() * (GRID_SIZE - 1) + 1) * BOX_SIZE_IN_PX;
    isFoodInsideSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
  } while (isFoodInsideSnake);
}

function deactivateStartMenu() {
  isStartMenu = false;
  document.querySelector(".start-message.desktop").setAttribute("data-startup", "false");
  document.querySelector(".start-message.mobile").setAttribute("data-startup", "false");
  document.querySelector("#game-scoreboard").setAttribute("data-startup", "false");
}

function handleKeydown(event) {
  if (event.keyCode === LEFT_ARROW && direction !== RIGHT) {directionBuffer = LEFT; isMoving = true;}
  if (event.keyCode === UP_ARROW && direction !== DOWN) {directionBuffer = UP; isMoving = true;}
  if (event.keyCode === RIGHT_ARROW && direction !== LEFT) {directionBuffer = RIGHT; isMoving = true;}
  if (event.keyCode === DOWN_ARROW && direction !== UP) {directionBuffer = DOWN; isMoving = true;}
  if (event.keyCode === SPACE_BAR && !isStartMenu) {
    pause.play();
    pauseIcon.style.display = isPaused ? "none" : "flex";
    canvas.style.filter = isPaused ? "none" : "blur(2px) grayscale(50%)";
    directionBeforePause = isPaused ? NONE : direction;
    direction = isPaused ? directionBeforePause : NONE;
    isPaused = !isPaused;
  }
  if (isStartMenu && isMoving) deactivateStartMenu();
}

function checkDirection() {
  if (isStartMenu) return;
  const movementX = touchendX - touchstartX;
  const movementY = touchendY - touchstartY;

  if (Math.abs(movementX) >= Math.abs(movementY)) {
    if (movementX > TOUCH_THRESHHOLD_IN_PX && direction !== LEFT) {directionBuffer = RIGHT; isMoving = true;}
    if (movementX < -TOUCH_THRESHHOLD_IN_PX && direction !== RIGHT) {directionBuffer = LEFT; isMoving = true;}
  } else {
    if (movementY > TOUCH_THRESHHOLD_IN_PX && direction !== UP) {directionBuffer = DOWN; isMoving = true;}
    if (movementY < -TOUCH_THRESHHOLD_IN_PX && direction !== DOWN) {directionBuffer = UP; isMoving = true;}
  }
}

function gameTick() {
  if (isPaused) return;

  if (snake[0].x > (GRID_SIZE - 1) * BOX_SIZE_IN_PX) snake[0].x = 0; 
  if (snake[0].x < 0) snake[0].x = GRID_SIZE * BOX_SIZE_IN_PX;
  if (snake[0].y > (GRID_SIZE - 1) * BOX_SIZE_IN_PX) snake[0].y = 0;
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
    score++;
    eat.play();
    if (score === GRID_SIZE * GRID_SIZE) return winGame();
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
  document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
    touchstartY = e.changedTouches[0].screenY
  })
  document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    touchendY = e.changedTouches[0].screenY
    checkDirection()
  })
  document.addEventListener('click', () => {
    const isMobile = matchMedia('(pointer:coarse)').matches
    if (isMobile && isStartMenu) {
      isMoving = true;
      directionBuffer = RIGHT;
      deactivateStartMenu();
    }
  })
  document.addEventListener('keydown', e => {
    const value = e.keyCode;
    const isCharacterLetter = (value >= 65 && value <= 90);
    if (!isCharacterLetter) return;
    
    KEY_BUFFER.push(value);
    if (KEY_BUFFER.length > KEY_BUFFER_MAX_LENGTH) KEY_BUFFER.shift();
    for (const theme of THEMES) {
      if (KEY_BUFFER.join("").includes(theme.code)) {
        SNAKE_THEME = theme;
      }
    }
  })
  setInterval(gameTick, TICK_INTERVAL_IN_MS);
}

main();

