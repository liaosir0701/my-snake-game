export const GRID_SIZE = 20;

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(randomFn = Math.random) {
  const mid = Math.floor(GRID_SIZE / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];

  return {
    snake,
    direction: 'right',
    queuedDirection: 'right',
    food: placeFood(snake, randomFn),
    score: 0,
    status: 'idle',
    reason: null,
  };
}

export function setDirection(state, nextDirection) {
  if (!DIRS[nextDirection]) {
    return state;
  }

  const blockedByCurrent = OPPOSITE[state.direction] === nextDirection;
  const blockedByQueued = OPPOSITE[state.queuedDirection] === nextDirection;
  if (blockedByCurrent || blockedByQueued) {
    return state;
  }

  return { ...state, queuedDirection: nextDirection };
}

export function startGame(state) {
  if (state.status === 'game-over') {
    return state;
  }
  return { ...state, status: 'running', reason: null };
}

export function pauseGame(state) {
  if (state.status !== 'running') {
    return state;
  }
  return { ...state, status: 'paused' };
}

export function tick(state, randomFn = Math.random) {
  if (state.status !== 'running') {
    return state;
  }

  const direction = state.queuedDirection;
  const delta = DIRS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (isOutOfBounds(nextHead)) {
    return { ...state, status: 'game-over', reason: 'Hit a wall.' };
  }

  const willEat = state.food && sameCell(nextHead, state.food);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyToCheck.some((segment) => sameCell(segment, nextHead));
  if (hitSelf) {
    return { ...state, status: 'game-over', reason: 'Hit yourself.' };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  const nextFood = willEat ? placeFood(nextSnake, randomFn) : state.food;
  const noCellsLeft = willEat && !nextFood;

  return {
    ...state,
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    food: nextFood,
    score: willEat ? state.score + 1 : state.score,
    status: noCellsLeft ? 'game-over' : state.status,
    reason: noCellsLeft ? 'You win!' : null,
  };
}

export function placeFood(snake, randomFn = Math.random) {
  const freeCells = [];
  const occupied = new Set(snake.map((cell) => key(cell)));

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = { x, y };
      if (!occupied.has(key(cell))) {
        freeCells.push(cell);
      }
    }
  }

  if (!freeCells.length) {
    return null;
  }

  const index = Math.floor(randomFn() * freeCells.length);
  return freeCells[index];
}

function key(cell) {
  return `${cell.x},${cell.y}`;
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOutOfBounds(cell) {
  return cell.x < 0 || cell.x >= GRID_SIZE || cell.y < 0 || cell.y >= GRID_SIZE;
}
