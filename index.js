const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake, direction, food, gameOver, score, speed;
let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");

function startGame() {
  snake = [{ x: 100, y: 100 }];
  direction = "RIGHT";
  food = generateFood();
  score = 0;
  speed = 150;  // Velocidade inicial (em milissegundos)
  gameOver = false;
  scoreDisplay.textContent = score;
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  gameLoop();
}

function gameLoop() {
  if (gameOver) {
    restartBtn.style.display = "inline-block";
    return;
  }

  setTimeout(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();  // Desenha as linhas da grade
    moveSnake();
    checkCollisions();
    drawSnake();
    drawFood();
    adjustSpeed();  // Ajusta a velocidade da cobra
    gameLoop();
  }, speed);
}

function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case "LEFT":
      head.x -= gridSize;
      break;
    case "RIGHT":
      head.x += gridSize;
      break;
    case "UP":
      head.y -= gridSize;
      break;
    case "DOWN":
      head.y += gridSize;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score += 10;
    scoreDisplay.textContent = score; // Atualiza a pontuação
  } else {
    snake.pop();
  }
}

function checkCollisions() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver = true;
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#76ff03" : "#388e3c"; // Corpo da cobra estilizado
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    ctx.strokeStyle = "#1b5e20"; // Contorno da cobra
    ctx.lineWidth = 2;
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function generateFood() {
  let foodPosition;
  while (true) {
    foodPosition = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    };
    if (!snake.some((segment) => segment.x === foodPosition.x && segment.y === foodPosition.y)) {
      break;
    }
  }
  return foodPosition;
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function drawGrid() {
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.strokeStyle = "#d3d3d3";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "DOWN") direction = "UP";
      break;
    case "ArrowDown":
      if (direction !== "UP") direction = "DOWN";
      break;
    case "ArrowLeft":
      if (direction !== "RIGHT") direction = "LEFT";
      break;
    case "ArrowRight":
      if (direction !== "LEFT") direction = "RIGHT";
      break;
  }
}

function adjustSpeed() {
  // A cada 50 pontos, aumenta a velocidade, mas sem deixar muito rápido
  const newSpeed = Math.max(100, 150 - Math.floor(score / 50) * 10);
  if (newSpeed !== speed) {
    speed = newSpeed;
  }
}

function restartGame() {
  startGame();
  restartBtn.style.display = "none";
}

document.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
