import { ChessGame } from '@/types';
import { calculateLongestDailyStreak } from '../helpers/streak-calculator';
import { calculateLichessTimeFromPGN } from '../helpers/lichess-clock';

export interface TimeAnalysisResult {
  totalHours: number;
  longestDailyStreak: number;
}

/**
 * Analyzes Lichess clock time and daily streaks.
 */
export function analyzeTime(games: ChessGame[]): TimeAnalysisResult {
  let totalSeconds = 0;
  const uniqueDays = new Set<string>();

  games.forEach(game => {
    if (game.end_time) {
      const dayDate = new Date(game.end_time * 1000).toISOString().split('T')[0];
      uniqueDays.add(dayDate);
    }

    if (game.pgn?.includes('%clk')) {
      totalSeconds += calculateLichessTimeFromPGN(game.pgn);
    }
  });

  return {
    totalHours: Math.round(totalSeconds / 3600),
    longestDailyStreak: calculateLongestDailyStreak(uniqueDays),
  };
}
