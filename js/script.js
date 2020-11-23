let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;
let pontuacao = 0;
let pontuacaoMax = 0;
let check;
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
    context.fillStyle = "lightgreen"; //Define a cor do preenchimento do canvas como verde-claro
    context.fillRect(0, 0, 16 * box, 16 * box); //Preenche o canvas desde tal coordenadas (0, 0) mais tantos números (16 * box, 16 * box) em verde-claro
}

function criarCobrinha(){
    for(i = 0; i < snake.length; i++){
        context.fillStyle = "green"; //Define a cor do preenchimento da cobrinha como verde
        context.fillRect(snake[i].x, snake[i].y, box, box); //Preenche o canvas desde tal coordenadas (x e y da cobrinha) mais tantos números (box, box) em verde
    }
}

function drawFood(){
    context.fillStyle = "red"; //Define a cor do preenchimento da comida como vermelho
    context.fillRect(food.x, food.y, box, box); //Preenche o canvas desde tal coordenadas (x e y da comida) mais tantos números (box, box) em vermelho
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
    //If statements pra definir o loop da cobrinha
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

    //Adiciona uma caixa pra direção que está indo
    if(direction == "right") snakeX += box; 
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){ //Exclui a última caixa se não tiver pegado comida
        snake.pop();
    }else{
        do{
            check = 0;
            food.x = Math.floor(Math.random() * 15 + 1) * box;
            food.y = Math.floor(Math.random() * 15 + 1) * box;
            for(i = 0; i < snake.length; i++){
                if(food.x == snake[i].x && food.y == snake[i].y){check++;}
            }
        }while(check);
        pontuacao++;
    }

    let newHead = { 
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead); //Define a última posição calculada como a cabeça da cobra

}

let jogo = setInterval(iniciarJogo, 100); //Roda a função do jogo a cada 100 milisegundos
