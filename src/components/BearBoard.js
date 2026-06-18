import React from 'react';
import { BEAR_SILHOUETTE } from '../gameLogic';
import styles from './BearBoard.module.css';

export default function BearBoard({ board, selectedPiece, onCellClick, hoveredCell, setHoveredCell }) {
  const isHovered = (r, c) => {
    if (!selectedPiece || !hoveredCell) return false;
    const { row, col } = hoveredCell;
    return selectedPiece.cells.some(([dr, dc]) => row + dr === r && col + dc === c);
  };

  const canPlace = (r, c) => {
    if (!selectedPiece || !hoveredCell) return false;
    const { row, col } = hoveredCell;
    return selectedPiece.cells.every(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      return nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && BEAR_SILHOUETTE[nr][nc] && !board[nr][nc];
    });
  };

  const previewValid = hoveredCell ? canPlace(hoveredCell.row, hoveredCell.col) : false;

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const inSilhouette = BEAR_SILHOUETTE[r][c] === 1;
            const hovered = isHovered(r, c);

            let cellClass = styles.cell;
            if (!inSilhouette) cellClass += ` ${styles.outside}`;
            else if (cell) cellClass += ` ${styles.filled}`;
            else if (hovered) cellClass += ` ${previewValid ? styles.previewValid : styles.previewInvalid}`;
            else cellClass += ` ${styles.empty}`;

            return (
              <div
                key={`${r}-${c}`}
                className={cellClass}
                style={cell ? { backgroundColor: cell.color, borderColor: cell.playerId === 0 ? '#C0612B' : '#2B61C0' } : {}}
                onClick={() => inSilhouette && !cell && onCellClick(r, c)}
                onMouseEnter={() => inSilhouette && setHoveredCell({ row: r, col: c })}
                onMouseLeave={() => setHoveredCell(null)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
