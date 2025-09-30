const canvas = document.getElementById("snake"); 
const context = canvas.getContext("2d");
let directionBuffer;
const box = 32;
const snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
}
let direction;
const food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}
let score = 0;
let highscore;
if(getHighscore() == null || getHighscore() == "null"){ 
    highscore = 0;
}else{
    highscore = getHighscore();
}
let theme = 0;
let directionBeforePause;
let pause = false;
let check;

function changeTheme(){
    if(theme == 0){
        document.documentElement.style
            .setProperty('--cor-primaria', 'rgb(216, 216, 216)');
        document.documentElement.style
            .setProperty('--cor-secundaria', 'rgba(0, 0, 0, 0.85)');
        theme++;
    }else{
        document.documentElement.style
            .setProperty('--cor-primaria', 'rgba(0, 0, 0, 0.85)');
        document.documentElement.style
            .setProperty('--cor-secundaria', 'rgb(216, 216, 216)');
        theme--;
    }
}

function updateScore(){
    document.getElementById("pontuacao").innerHTML = "Pontuação: " + score; 
    document.getElementById("pontuacaoMax").innerHTML = "Pontuação Máx: " + highscore; 
}

function saveHighscore(hs){
    localStorage.setItem('highscore', hs);
}

function getHighscore(){
    let hs = localStorage.getItem('highscore');
    return hs;
}

function drawBackground(){
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function drawSnake(){
    for(i = 0; i < snake.length; i++){
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood(){
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

function endGame(){
    if(highscore < score){
        highscore = score;
        saveHighscore(highscore)
    } 
    alert("Game Over :( | Pontuação: " + score + " | Pontuação Máxima: " + highscore);
    score = 0;
    direction = 0;
    snake.length = 1;
    snake[0] = {
        x: 8 * box,
        y: 8 * box
    }
}

function winGame(){
    if(snake.length == 256){
        alert("PARABÉNS!!! VOCÊ GANHOU O JOGO!");
        highscore = score;
        saveHighscore(highscore);
        
        score = 0;
        direction = 0;
        snake.length = 1;
        snake[0] = {
        x: 8 * box,
        y: 8 * box
        }
    }
}

function checkFood(){
    do{
        check = 0;
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        for(i = 0; i < snake.length; i++){
            if(food.x == snake[i].x && food.y == snake[i].y){check++;}
        }
    }while(check);
}

function handleKeydown(event){
    if(event.keyCode == 37 && direction != "right") directionBuffer = "left";
    if(event.keyCode == 38 && direction != "down") directionBuffer = "up";
    if(event.keyCode == 39 && direction != "left") directionBuffer = "right";
    if(event.keyCode == 40 && direction != "up") directionBuffer = "down";
    if(event.keyCode == 32) {
        if(pause == false){
            directionBeforePause = direction;
            direction = 0; pause = true;
        }else{
            direction = directionBeforePause; pause = false;
        }
    } 
}

function gameTick(){
    if(pause == false){
        if(snake[0].x > 15 * box) snake[0].x = 0; 
        if(snake[0].x < 0) snake[0].x = 16 * box;
        if(snake[0].y > 15 * box) snake[0].y = 0;
        if(snake[0].y < 0) snake[0].y = 16 * box;

        for(i = 1; i < snake.length; i++){
            if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
                endGame();
            }
        }

        drawBackground();
        drawSnake();
        drawFood();
        updateScore();

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if(directionBuffer) direction = directionBuffer;

        if(direction == "right") snakeX += box; 
        if(direction == "left") snakeX -= box;
        if(direction == "up") snakeY -= box;
        if(direction == "down") snakeY += box;

        if(snakeX != food.x || snakeY != food.y){ 
            snake.pop();
        }else{
            checkFood();
            score++;
        }

        let newHead = { 
            x: snakeX,
            y: snakeY
        }

        snake.unshift(newHead);
    }
}

document.addEventListener('keydown', handleKeydown);
let game = setInterval(gameTick, 100);
