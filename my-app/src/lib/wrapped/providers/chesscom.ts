// Literally just re-export your current logic

import { generateWrappedStats as chessComWrapped } from '@/lib/chess';

export async function generateChessWrappedStats(username: string) {
  return chessComWrapped(username);
}
