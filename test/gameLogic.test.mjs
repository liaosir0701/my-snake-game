import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GRID_SIZE,
  createInitialState,
  placeFood,
  startGame,
  tick,
} from '../src/gameLogic.mjs';

test('snake moves one cell per tick in current direction', () => {
  let state = createInitialState(() => 0);
  state = startGame(state);
  const oldHead = state.snake[0];

  state = tick(state, () => 0);

  assert.deepEqual(state.snake[0], { x: oldHead.x + 1, y: oldHead.y });
  assert.equal(state.snake.length, 3);
});

test('snake grows and score increments when eating food', () => {
  let state = createInitialState(() => 0);
  state = {
    ...state,
    status: 'running',
    food: { x: state.snake[0].x + 1, y: state.snake[0].y },
  };

  state = tick(state, () => 0);

  assert.equal(state.score, 1);
  assert.equal(state.snake.length, 4);
});

test('wall collision ends game', () => {
  let state = createInitialState(() => 0);
  state = {
    ...state,
    status: 'running',
    snake: [{ x: GRID_SIZE - 1, y: 0 }],
    direction: 'right',
    queuedDirection: 'right',
  };

  state = tick(state, () => 0);

  assert.equal(state.status, 'game-over');
  assert.equal(state.reason, 'Hit a wall.');
});

test('self collision ends game', () => {
  let state = createInitialState(() => 0);
  state = {
    ...state,
    status: 'running',
    snake: [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
      { x: 6, y: 4 },
    ],
    direction: 'right',
    queuedDirection: 'right',
  };

  state = tick(state, () => 0);

  assert.equal(state.status, 'game-over');
  assert.equal(state.reason, 'Hit yourself.');
});

test('food placement avoids snake cells', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = placeFood(snake, () => 0);

  assert.notDeepEqual(food, snake[0]);
  assert.notDeepEqual(food, snake[1]);
  assert.notDeepEqual(food, snake[2]);
});
