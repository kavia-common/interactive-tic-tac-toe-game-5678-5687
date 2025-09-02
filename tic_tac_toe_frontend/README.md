# Tic Tac Toe Frontend (React)

A minimalistic, responsive Tic Tac Toe game built with React.

## Features
- 2-player turn-based gameplay (local, same device)
- Win and tie detection with line highlight
- In-memory scoreboard (resets on refresh)
- Restart game button
- Clean, light UI with specified palette:
  - Primary: `#1976d2`
  - Secondary: `#424242`
  - Accent: `#ffeb3b`
- Responsive layout: scoreboard on top, board centered, controls below

## Getting Started

From this directory:

```bash
npm install
npm start
```

Open http://localhost:3000 to play.

## How to Play
- Player X starts.
- Players tap/click a square to place their mark.
- The game announces the winner or a tie.
- Use “Restart Game” to start a new round. Scores persist until the page reloads.

## Scripts
- `npm start` – run in development
- `npm test` – run tests
- `npm run build` – production build

## Notes
- No external UI libraries. Styles live in `src/App.css`.
- State is in-memory only. Refresh resets scores.
