import React from 'react';
import styles from './PieceSelector.module.css';

function PiecePreview({ piece, size = 14 }) {
  const maxRow = Math.max(...piece.cells.map(([r]) => r));
  const maxCol = Math.max(...piece.cells.map(([, c]) => c));
  const rows = maxRow + 1;
  const cols = maxCol + 1;

  const grid = Array(rows).fill(null).map(() => Array(cols).fill(false));
  piece.cells.forEach(([r, c]) => { grid[r][c] = true; });

  return (
    <div className={styles.pieceGrid}>
      {grid.map((row, r) => (
        <div key={r} className={styles.pieceRow}>
          {row.map((filled, c) => (
            <div
              key={c}
              className={styles.pieceCell}
              style={{
                width: size,
                height: size,
                backgroundColor: filled ? piece.color : 'transparent',
                border: filled ? `1.5px solid rgba(0,0,0,0.2)` : '1.5px solid transparent',
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PieceSelector({ pieces, selectedPiece, onSelect, playerColor, playerName }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{ color: playerColor }}>{playerName}のターン</p>
      <p className={styles.hint}>ピースを選んで、くまにはめよう！</p>
      <div className={styles.pieces}>
        {pieces.map((piece) => (
          <button
            key={piece.id}
            className={`${styles.pieceButton} ${selectedPiece?.id === piece.id ? styles.selected : ''}`}
            style={selectedPiece?.id === piece.id ? { borderColor: playerColor, boxShadow: `0 0 0 3px ${playerColor}40` } : {}}
            onClick={() => onSelect(piece)}
          >
            <PiecePreview piece={piece} size={16} />
            <span className={styles.pieceName}>{piece.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
