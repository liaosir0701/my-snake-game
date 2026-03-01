const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');
const scoreEl = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const speedMs = 120;

const directionMap = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

let snake;
let food;
let direction;
let queuedDirection;
let score;
let isRunning;
let gameLoopId;

function randomFoodPosition() {
  let candidate;
  do {
    candidate = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y));

  return candidate;
}

function initGameState() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  queuedDirection = { x: 1, y: 0 };
  score = 0;
  food = randomFoodPosition();
  isRunning = false;
  scoreEl.textContent = 'Score: 0';
  statusEl.textContent = '按下 Start 開始，使用方向鍵或 WASD 控制蛇。';
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(food.x, food.y, '#ff5252');
  snake.forEach((segment, index) => {
    drawRect(segment.x, segment.y, index === 0 ? '#69f0ae' : '#26a69a');
  });
}

function isOpposite(next, current) {
  return next.x === -current.x && next.y === -current.y;
}

function update() {
  direction = queuedDirection;

  const nextHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= tileCount ||
    nextHead.y >= tileCount;

  const hitSelf = snake.some(
    (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
  );

  if (hitWall || hitSelf) {
    stopGame('遊戲結束，請按 Start 重新開始。');
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 1;
    scoreEl.textContent = `Score: ${score}`;
    food = randomFoodPosition();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  if (isRunning) return;

  isRunning = true;
  statusEl.textContent = '遊戲進行中！';
  clearInterval(gameLoopId);
  gameLoopId = setInterval(update, speedMs);

  // 讓鍵盤事件焦點落在遊戲區，避免點擊按鈕後無法控制
  canvas.focus();
}

function stopGame(message) {
  isRunning = false;
  clearInterval(gameLoopId);
  statusEl.textContent = message;
}

function resetGame() {
  clearInterval(gameLoopId);
  initGameState();
  draw();
}

function onKeyDown(event) {
  const next = directionMap[event.key];
  if (!next) return;

  // 防止方向鍵滾動頁面
  event.preventDefault();

  if (!isRunning) return;
  if (isOpposite(next, direction)) return;

  queuedDirection = next;
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', onKeyDown, { passive: false });

initGameState();
draw();
