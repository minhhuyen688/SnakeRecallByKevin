const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;

let snake = [{ x: 200, y: 200 }];
let direction = 'RIGHT';
let food = spawnFood();
let score = 0;

const backgroundImage = new Image();
backgroundImage.src = 'RECALL.png';

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
  if (key === 38 && direction !== 'DOWN') direction = 'UP';
  if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
  if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function draw() {
  // Vẽ ảnh nền
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Vẽ snake (đầu màu sáng hơn)
  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? '#00FF00' : '#008000';
    ctx.fillRect(part.x, part.y, box, box);
  });

  // Vẽ food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Di chuyển snake
  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // Kiểm tra va chạm với tường hoặc thân
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(head);

  // Nếu ăn được food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

// Đợi ảnh nền load xong mới bắt đầu game
backgroundImage.onload = function() {
  game = setInterval(draw, 200);
};
