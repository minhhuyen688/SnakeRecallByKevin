const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const box = 20;
const canvasSize = 400;

// Snake
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction = null;
let score = 0;

// Food position
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

// Load images
const logoImg = new Image();
logoImg.src = 'RECALL.png';  // Logo nền lớn

const foodImg = new Image();
foodImg.src = 'food.png';    // Logo làm thức ăn

// Listen to keyboard events to change direction
document.addEventListener('keydown', directionHandler);

function directionHandler(event) {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

// Draw game
function draw() {
  // Draw black background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw large logo in center (about 200x100)
  const logoWidth = 200;
  const logoHeight = 100;
  const logoX = (canvasSize - logoWidth) / 2;
  const logoY = (canvasSize - logoHeight) / 2;

  if (logoImg.complete) {
    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
  }

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'lightgreen' : 'green';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food with image
  if (foodImg.complete) {
    ctx.drawImage(foodImg, food.x, food.y, box, box);
  } else {
    // fallback: draw red square
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
  }

  // Old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Update head position based on direction
  if (direction === 'LEFT') snakeX -= box;
  else if (direction === 'UP') snakeY -= box;
  else if (direction === 'RIGHT') snakeX += box;
  else if (direction === 'DOWN') snakeY += box;

  // Check if snake eats food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = score;

    // Generate new food position
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    // Remove tail
    snake.pop();
  }

  // Add new head
  const newHead = { x: snakeX, y: snakeY };

  // Check game over conditions
  if (
    snakeX < 0 || snakeX >= canvasSize ||
    snakeY < 0 || snakeY >= canvasSize ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert('Game Over! Your score: ' + score);
  }

  snake.unshift(newHead);
}

// Check collision with snake body
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// Run the game every 200ms (slower speed)
const game = setInterval(draw, 200);
