import React, { useState, useMemo } from 'react';
import './App.css';

/**
 * Minimalistic, responsive Tic Tac Toe game UI with:
 * - 2-player turn-based gameplay (same device)
 * - Win/tie detection
 * - In-memory score tracking (resets on refresh)
 * - Restart button
 * - Centered layout with scoreboard above and controls below
 * - Color palette: primary #1976d2, secondary #424242, accent #ffeb3b
 * - Clean, light, minimalistic style, responsive for mobile/desktop
 */

// Palette variables for internal usage (used to set inline styles and CSS vars)
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ffeb3b',
  bg: '#ffffff',
  text: '#222222',
  subtle: '#f5f7fa',
};

// Helpers
const LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
function App() {
  /** Game state */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Ties: 0 });

  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const isTie = useMemo(
    () => !winnerInfo && isBoardFull(board),
    [winnerInfo, board]
  );

  const currentPlayer = xIsNext ? 'X' : 'O';

  const statusText = useMemo(() => {
    if (winnerInfo) return `Winner: ${winnerInfo.player}`;
    if (isTie) return 'It’s a tie!';
    return `Turn: Player ${currentPlayer}`;
  }, [winnerInfo, isTie, currentPlayer]);

  const canClick = !winnerInfo && !isTie;

  function handleClick(index) {
    if (!canClick || board[index]) return;
    const next = board.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);

    const newWinner = calculateWinner(next);
    if (newWinner) {
      setScores((prev) => ({ ...prev, [newWinner.player]: prev[newWinner.player] + 1 }));
    } else if (isBoardFull(next)) {
      setScores((prev) => ({ ...prev, Ties: prev.Ties + 1 }));
    } else {
      setXIsNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // CSS variables on root container for palette usage
  const appStyle = {
    '--primary': COLORS.primary,
    '--secondary': COLORS.secondary,
    '--accent': COLORS.accent,
    '--bg': COLORS.bg,
    '--text': COLORS.text,
    '--subtle': COLORS.subtle,
  };

  return (
    <div className="ttt-app" style={appStyle}>
      <main className="ttt-container">
        {/* Header / Scoreboard */}
        <section className="ttt-header" aria-label="Scoreboard and player status">
          <h1 className="ttt-title">Tic Tac Toe</h1>

          <div className="ttt-scoreboard" role="region" aria-label="Scoreboard">
            <ScoreCard label="Player X" value={scores.X} color="var(--primary)" active={currentPlayer === 'X' && !winnerInfo && !isTie} />
            <ScoreCard label="Ties" value={scores.Ties} color="var(--accent)" />
            <ScoreCard label="Player O" value={scores.O} color="var(--secondary)" active={currentPlayer === 'O' && !winnerInfo && !isTie} />
          </div>

          <div
            className={`ttt-status ${winnerInfo ? 'ttt-status-winner' : isTie ? 'ttt-status-tie' : ''}`}
            role="status"
            aria-live="polite"
          >
            {statusText}
          </div>
        </section>

        {/* Game Board */}
        <section className="ttt-board-wrap" aria-label="Game board">
          <Board
            squares={board}
            highlightLine={winnerInfo?.line || []}
            onClick={handleClick}
            disabled={!canClick}
          />
        </section>

        {/* Controls */}
        <section className="ttt-controls">
          <button className="ttt-btn" onClick={restartGame} aria-label="Restart the game">
            Restart Game
          </button>
        </section>

        {/* Footer */}
        <footer className="ttt-footer">
          <small>2-Player local play • Minimal design • Responsive</small>
        </footer>
      </main>
    </div>
  );
}

function ScoreCard({ label, value, color, active = false }) {
  return (
    <div className={`ttt-score-card ${active ? 'active' : ''}`} style={{ borderColor: color }}>
      <div className="ttt-score-label">{label}</div>
      <div className="ttt-score-value" style={{ color }}>{value}</div>
      {active && <div className="ttt-active-badge" style={{ background: color }} aria-label="Active player" />}
    </div>
  );
}

function Board({ squares, onClick, highlightLine }) {
  return (
    <div className="ttt-grid" role="grid" aria-label="3 by 3 Tic Tac Toe grid">
      {squares.map((value, idx) => {
        const isHighlighted = highlightLine.includes(idx);
        return (
          <Square
            key={idx}
            value={value}
            onClick={() => onClick(idx)}
            highlighted={isHighlighted}
            ariaLabel={`Cell ${idx + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
          />
        );
      })}
    </div>
  );
}

function Square({ value, onClick, highlighted, ariaLabel }) {
  return (
    <button
      className={`ttt-square ${highlighted ? 'highlight' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className={`ttt-mark ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`}>{value || ''}</span>
    </button>
  );
}

export default App;
