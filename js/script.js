let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;
let pontuacao = 0;
let pontuacaoMax = 0;
let change = 0;
let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
}
let direction;
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

/* Funções da página */
function changeMode(){
    if(change == 0){
        document.getElementById("wrapper").style.backgroundColor = "var(--branco)";
        document.getElementById("wrapper").style.color = "var(--preto)";
        document.getElementById("icone-modo").style.color = "var(--preto)";
        change++;
        console.log("Tema modificado para claro | Change = " + change);
    }else{
        document.getElementById("wrapper").style.backgroundColor = "var(--preto)";
        document.getElementById("wrapper").style.color = "var(--branco)";
        document.getElementById("icone-modo").style.color = "var(--branco)";
        change--;
        console.log("Tema modificado para escuro | Change = " + change);
    }
}

/* Funções do jogo da Cobrinha */
function criarBG(){
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha(){
    for(i = 0; i < snake.length; i++){
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood(){
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

function updateScore(){
    document.getElementById("pontuacao").innerHTML = "Pontuação: " + pontuacao;
    document.getElementById("pontuacaoMax").innerHTML = "Pontuação Máx: " + pontuacaoMax;
}

function endGame(){
    if(pontuacaoMax < pontuacao) pontuacaoMax = pontuacao;
         alert("Game Over :( | Pontuação: " + pontuacao + " | Pontuação Máxima: " + pontuacaoMax);
        pontuacao = 0;
        direction = 0;
        snake.length = 1;
        snake[0] = {
            x: 8 * box,
            y: 8 * box
        }
}

document.addEventListener('keydown', update);

function update(event){
    if(event.keyCode == 37 && direction != "right") direction = "left";
    if(event.keyCode == 38 && direction != "down") direction = "up";
    if(event.keyCode == 39 && direction != "left") direction = "right";
    if(event.keyCode == 40 && direction != "up") direction = "down";
}


function iniciarJogo(){
    if(snake[0].x > 15 * box) snake[0].x = 0;
    if(snake[0].x < 0) snake[0].x = 16 * box;
    if(snake[0].y > 15 * box) snake[0].y = 0;
    if(snake[0].y < 0) snake[0].y = 16 * box;

    for(i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            endGame();
        }
    }

    criarBG();
    criarCobrinha();
    drawFood();
    updateScore();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){
        snake.pop();
    }else{
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        pontuacao++;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);

}

let jogo = setInterval(iniciarJogo, 100);
