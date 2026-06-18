import React, { useState, useCallback } from 'react';
import BearBoard from './components/BearBoard';
import PieceSelector from './components/PieceSelector';
import Scoreboard from './components/Scoreboard';
import {
  PIECE_SHAPES,
  PLAYER_COLORS,
  PLAYER_NAMES,
  createEmptyBoard,
  canPlacePiece,
  placePiece,
  calculateScores,
  shuffleArray,
  BEAR_SILHOUETTE,
} from './gameLogic';
import styles from './App.module.css';

const TOTAL_BEAR_CELLS = BEAR_SILHOUETTE.flat().filter(Boolean).length;

function getInitialPieces() {
  return shuffleArray([...PIECE_SHAPES]);
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [pieces, setPieces] = useState(getInitialPieces());
  const [hoveredCell, setHoveredCell] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [lastMessage, setLastMessage] = useState('');
  const [placedCount, setPlacedCount] = useState(0);

  const scores = calculateScores(board);
  const filledCells = Object.values(scores).reduce((a, b) => a + b, 0);
  const remainingCells = TOTAL_BEAR_CELLS - filledCells;

  const handleCellClick = useCallback((row, col) => {
    if (!selectedPiece || gameOver) return;

    if (canPlacePiece(board, BEAR_SILHOUETTE, selectedPiece, row, col)) {
      const newBoard = placePiece(board, selectedPiece, row, col, currentPlayer);
      const newPieces = pieces.filter(p => p.id !== selectedPiece.id);
      const newScores = calculateScores(newBoard);
      const newFilled = Object.values(newScores).reduce((a, b) => a + b, 0);

      setBoard(newBoard);
      setPieces(newPieces);
      setSelectedPiece(null);
      setHoveredCell(null);
      setPlacedCount(prev => prev + 1);
      setLastMessage(`✨ ${selectedPiece.cells.length}マス置いたよ！`);
      setSkipCount(0);

      if (newPieces.length === 0 || newFilled >= TOTAL_BEAR_CELLS) {
        setGameOver(true);
      } else {
        setCurrentPlayer(prev => 1 - prev);
      }
    } else {
      setLastMessage('⚠️ そこには置けないよ！');
    }
  }, [board, selectedPiece, pieces, currentPlayer, gameOver]);

  const handleSkip = () => {
    const newSkip = skipCount + 1;
    if (newSkip >= 2) {
      setGameOver(true);
    } else {
      setSkipCount(newSkip);
      setCurrentPlayer(prev => 1 - prev);
      setSelectedPiece(null);
      setLastMessage(`🔄 ${PLAYER_NAMES[currentPlayer]}がスキップ`);
    }
  };

  const handleRestart = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(0);
    setSelectedPiece(null);
    setPieces(getInitialPieces());
    setHoveredCell(null);
    setGameOver(false);
    setSkipCount(0);
    setLastMessage('');
    setPlacedCount(0);
  };

  const winner = gameOver
    ? scores[0] > scores[1]
      ? 0
      : scores[1] > scores[0]
      ? 1
      : null
    : null;

  return (
    <div className={styles.app}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>🐻 くまさんのパズル</h1>
        <p className={styles.subtitle}>くまのからだにピースをはめよう！</p>
      </header>

      {/* スコアボード */}
      <div className={styles.section}>
        <Scoreboard scores={scores} currentPlayer={currentPlayer} totalCells={TOTAL_BEAR_CELLS} />
      </div>

      {/* ゲームオーバー画面 */}
      {gameOver ? (
        <div className={styles.gameOver}>
          <div className={styles.gameOverCard}>
            <p className={styles.gameOverBear}>🐻</p>
            <h2 className={styles.gameOverTitle}>ゲームおわり！</h2>
            {winner !== null ? (
              <>
                <p className={styles.winnerText} style={{ color: PLAYER_COLORS[winner] }}>
                  {PLAYER_NAMES[winner]} の勝ち！🎉
                </p>
                <p className={styles.scoreText}>
                  {scores[0]}マス vs {scores[1]}マス
                </p>
              </>
            ) : (
              <p className={styles.winnerText}>引き分け！🤝</p>
            )}
            <div className={styles.fillBar}>
              <div
                className={styles.fillProgress}
                style={{ width: `${(filledCells / TOTAL_BEAR_CELLS) * 100}%` }}
              />
            </div>
            <p className={styles.fillText}>{filledCells}/{TOTAL_BEAR_CELLS}マス埋まったよ！</p>
            <button className={styles.restartBtn} onClick={handleRestart}>
              もう一回あそぶ 🔄
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* くまボード */}
          <BearBoard
            board={board}
            selectedPiece={selectedPiece}
            onCellClick={handleCellClick}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
          />

          {/* メッセージ */}
          {lastMessage && (
            <div className={styles.message}>{lastMessage}</div>
          )}

          {/* ピース選択 */}
          <div className={styles.section}>
            <PieceSelector
              pieces={pieces}
              selectedPiece={selectedPiece}
              onSelect={setSelectedPiece}
              playerColor={PLAYER_COLORS[currentPlayer]}
              playerName={PLAYER_NAMES[currentPlayer]}
            />
          </div>

          {/* スキップボタン */}
          <div className={styles.actions}>
            <button className={styles.skipBtn} onClick={handleSkip}>
              スキップ ⏭
            </button>
            <button className={styles.restartBtnSmall} onClick={handleRestart}>
              リセット 🔄
            </button>
          </div>

          {/* 進捗バー */}
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(filledCells / TOTAL_BEAR_CELLS) * 100}%` }}
              />
            </div>
            <p className={styles.progressText}>
              くまの {filledCells}/{TOTAL_BEAR_CELLS} マスうまった！
            </p>
          </div>
        </>
      )}

      <footer className={styles.footer}>
        made with 🐻 &amp; ❤️
      </footer>
    </div>
  );
}
