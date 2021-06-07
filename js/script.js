// Variáveis para montar e manipular o canvas
let canvas = document.getElementById("snake"); 
let context = canvas.getContext("2d");
const box = 32; // Tamanho padrão de cada "caixa" do jogo
let snake = [];
snake[0] = { // Inicializa o array da cobra no meio do canvas
    x: 8 * box,
    y: 8 * box
}
let direction; // Direção da cobra
let food = { // Inicializa a comida em algum ponto do canvas
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}
// Variáveis de pontuação e tema do site
let score = 0;
let highscore;
// Pegar a pontuação máxima, se ela não estiver no localStorage usar zero
if(getScore() == null || getScore() == "null"){ 
    highscore = 0;
}else{
    highscore = getScore();
}
let theme = 0;
// Variáveis de outras funções do jogo
let directionBeforePause;
let pause = false;
let check;

/* Funções da página */
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

function updateScore(){ // Atualiza a pontuação
    document.getElementById("pontuacao").innerHTML = "Pontuação: " + score; 
    document.getElementById("pontuacaoMax").innerHTML = "Pontuação Máx: " + highscore; 
}

function saveScore(hs){
    localStorage.setItem('highscore', hs);
}

function getScore(){
    let hs = localStorage.getItem('highscore');
    return hs;
}

/* Funções do jogo da Cobrinha */
function drawBG(){ // Desenha o canvas completo em verde a cada execução
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function drawSnake(){ // Desenha a cobra a cada execução
    for(i = 0; i < snake.length; i++){
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood(){ // Desenha a comida a cada execução
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

function endGame(){ // Encerra o jogo e reinicia todas as configurações necessárias
    if(highscore < score){
        highscore = score;
        saveScore(highscore)
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

function checkFood(){ // Função pra checar se a comida não está sendo criada dentro da cobra
    do{
        check = 0;
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        for(i = 0; i < snake.length; i++){
            if(food.x == snake[i].x && food.y == snake[i].y){check++;}
        }
    }while(check);
}

function update(event){
    if(event.keyCode == 37 && direction != "right") direction = "left";
    if(event.keyCode == 38 && direction != "down") direction = "up";
    if(event.keyCode == 39 && direction != "left") direction = "right";
    if(event.keyCode == 40 && direction != "up") direction = "down";
    if(event.keyCode == 32) { // Se pressionar o espaço salva a direção que estava indo e pausa
        if(pause == false){
            directionBeforePause = direction;
            direction = 0; pause = true;
        }else{
            direction = directionBeforePause; pause = false;
        }
    } 
}

function runGame(){
    // Primeiro verifica se o jogo está pausado para rodá-lo
    if(pause == false){
        // Condicionais pra definir o teleporte da cobrinha nas extremidades no mapa
        if(snake[0].x > 15 * box) snake[0].x = 0; 
        if(snake[0].x < 0) snake[0].x = 16 * box;
        if(snake[0].y > 15 * box) snake[0].y = 0;
        if(snake[0].y < 0) snake[0].y = 16 * box;

        // Verifica se a cobrinha está colidindo com o próprio corpo e encerra o jogo se estiver
        for(i = 1; i < snake.length; i++){
            if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
                endGame();
            }
        }

        // Roda todas as funções essenciais pro jogo
        drawBG();
        drawSnake();
        drawFood();
        updateScore();

        // Define as variáveis com o valor da cabeça da cobrinha pra incrementá-la
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        // Adiciona uma caixa pra direção que está indo
        if(direction == "right") snakeX += box; 
        if(direction == "left") snakeX -= box;
        if(direction == "up") snakeY -= box;
        if(direction == "down") snakeY += box;

        // Exclui a última caixa se não tiver pegado comida
        if(snakeX != food.x || snakeY != food.y){ 
            snake.pop();
        }else{
            // Se tiver pegado comida, aleatoriza a comida até ela não estar dentro da cobra
            checkFood();
            score++;
        }

        // Cria uma variável pra passar o valor da nova cabeça pro array
        let newHead = { 
            x: snakeX,
            y: snakeY
        }

        snake.unshift(newHead); // Adiciona na primeira posição a nova cabeça calculada
    }
}

document.addEventListener('keydown', update); // Escuta as teclas clicadas
let game = setInterval(runGame, 100); //Roda a função do jogo a cada 100 milisegundos
