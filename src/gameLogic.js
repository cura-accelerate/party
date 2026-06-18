// くまのシルエットを構成するグリッドセル（10x10グリッド）
// 1 = シルエット内部（ピースを置ける）、0 = 外部
export const BEAR_SILHOUETTE = [
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,1,0,0,0,0,1,1,0],
  [0,1,1,0,0,0,0,1,1,0],
];

// ピースの形（[row, col]のオフセット配列）
export const PIECE_SHAPES = [
  { id: 'L', name: 'L字', cells: [[0,0],[1,0],[2,0],[2,1]], color: '#E8A87C' },
  { id: 'S', name: 'S字', cells: [[0,1],[0,2],[1,0],[1,1]], color: '#A8D8A8' },
  { id: 'T', name: 'T字', cells: [[0,0],[0,1],[0,2],[1,1]], color: '#B5C8E2' },
  { id: 'I', name: 'I字', cells: [[0,0],[1,0],[2,0],[3,0]], color: '#F9D56E' },
  { id: 'O', name: '四角', cells: [[0,0],[0,1],[1,0],[1,1]], color: '#D4A8D4' },
  { id: 'Z', name: 'Z字', cells: [[0,0],[0,1],[1,1],[1,2]], color: '#F4A261' },
  { id: 'J', name: 'J字', cells: [[0,1],[1,1],[2,0],[2,1]], color: '#90C8B8' },
];

// シャッフル
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// プレイヤーカラー
export const PLAYER_COLORS = ['#D4765A', '#5A8FD4'];
export const PLAYER_NAMES = ['プレイヤー1 🍯', 'プレイヤー2 🌿'];
export const PLAYER_BEAR_COLORS = ['#C0612B', '#2B61C0'];

// ピースがシルエット内に収まるか確認
export function canPlacePiece(board, silhouette, piece, startRow, startCol) {
  for (const [dr, dc] of piece.cells) {
    const r = startRow + dr;
    const c = startCol + dc;
    if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
    if (!silhouette[r][c]) return false;
    if (board[r][c] !== null) return false;
  }
  return true;
}

// ボードにピースを配置
export function placePiece(board, piece, startRow, startCol, playerId) {
  const newBoard = board.map(row => [...row]);
  for (const [dr, dc] of piece.cells) {
    newBoard[startRow + dr][startCol + dc] = { playerId, color: piece.color, pieceId: piece.id };
  }
  return newBoard;
}

// 初期ボード生成（10x10、全null）
export function createEmptyBoard() {
  return Array(10).fill(null).map(() => Array(10).fill(null));
}

// スコア計算（各プレイヤーが置いたセル数）
export function calculateScores(board) {
  const scores = { 0: 0, 1: 0 };
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null) scores[cell.playerId]++;
    }
  }
  return scores;
}
