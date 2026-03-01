# my-snake-game

Classic Snake game implementation with deterministic core logic.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in your browser.

## Run tests

```bash
npm test
```

## Manual verification checklist

- Start game and verify snake moves on a fixed tick.
- Control movement with Arrow keys and WASD.
- Verify on-screen direction buttons work on touch/click.
- Eat food and confirm snake grows and score increments.
- Verify collision with walls or self triggers game over.
- Verify Pause halts motion and Start resumes.
- Verify Restart resets score and board.
