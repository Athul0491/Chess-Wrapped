import { generateLichessWrappedStats } from './providers/lichess';

export async function generateWrappedStats(username: string) {
  return generateLichessWrappedStats(username);
}
