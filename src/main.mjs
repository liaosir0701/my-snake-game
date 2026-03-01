import {
  GRID_SIZE,
  createInitialState,
  pauseGame,
  setDirection,
  startGame,
  tick,
} from './gameLogic.mjs';

const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const restartBtn = document.getElementById('restart');

const TICK_MS = 140;
let state = createInitialState();

function render() {
  const snakeSet = new Set(state.snake.map((cell) => `${cell.x},${cell.y}`));
  const foodKey = state.food ? `${state.food.x},${state.food.y}` : null;

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x},${y}`;
      let className = 'cell';
      if (snakeSet.has(key)) {
        className += ' snake';
      } else if (foodKey === key) {
        className += ' food';
      }
      cells.push(`<div class="${className}"></div>`);
    }
  }

  board.innerHTML = cells.join('');
  scoreEl.textContent = String(state.score);

  if (state.status === 'idle') {
    statusEl.textContent = 'Press Start to play. Use arrow keys or WASD.';
  } else if (state.status === 'paused') {
    statusEl.textContent = 'Paused.';
  } else if (state.status === 'game-over') {
    statusEl.textContent = state.reason ? `Game over: ${state.reason}` : 'Game over.';
  } else {
    statusEl.textContent = 'Running...';
  }
}

function applyDirection(input) {
  state = setDirection(state, input);
  render();
}

document.addEventListener('keydown', (event) => {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    W: 'up',
    s: 'down',
    S: 'down',
    a: 'left',
    A: 'left',
    d: 'right',
    D: 'right',
  };

  const next = map[event.key];
  if (next) {
    event.preventDefault();
    applyDirection(next);
  }
});

for (const btn of document.querySelectorAll('[data-dir]')) {
  btn.addEventListener('click', () => applyDirection(btn.dataset.dir));
}

startBtn.addEventListener('click', () => {
  state = startGame(state);
  render();
});

pauseBtn.addEventListener('click', () => {
  if (state.status === 'paused') {
    state = startGame(state);
  } else {
    state = pauseGame(state);
  }
  render();
});

restartBtn.addEventListener('click', () => {
  state = createInitialState();
  render();
});

setInterval(() => {
  state = tick(state);
  render();
}, TICK_MS);

render();
