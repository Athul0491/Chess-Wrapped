import { WrappedSource } from './types';
import { generateChessWrappedStats } from './providers/chesscom';
import { generateLichessWrappedStats } from './providers/lichess';

export async function generateWrappedStats(
  username: string,
  source: WrappedSource 
) {
  if (source === 'lichess') {
    return generateLichessWrappedStats(username);
  }

  return generateLichessWrappedStats(username);
}
