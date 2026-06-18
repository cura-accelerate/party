import React from 'react';
import { PLAYER_COLORS, PLAYER_NAMES } from '../gameLogic';
import styles from './Scoreboard.module.css';

export default function Scoreboard({ scores, currentPlayer, totalCells }) {
  return (
    <div className={styles.wrapper}>
      {[0, 1].map(pid => (
        <div
          key={pid}
          className={`${styles.player} ${currentPlayer === pid ? styles.active : ''}`}
          style={currentPlayer === pid ? { borderColor: PLAYER_COLORS[pid], boxShadow: `0 0 0 3px ${PLAYER_COLORS[pid]}40` } : {}}
        >
          <div className={styles.dot} style={{ background: PLAYER_COLORS[pid] }} />
          <div>
            <p className={styles.name}>{PLAYER_NAMES[pid]}</p>
            <p className={styles.score} style={{ color: PLAYER_COLORS[pid] }}>
              {scores[pid]} マス
            </p>
          </div>
          {currentPlayer === pid && <span className={styles.arrow}>◀ 番</span>}
        </div>
      ))}
    </div>
  );
}
