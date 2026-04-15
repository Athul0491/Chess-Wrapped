import { ChessGame } from '@/types';
import { calculateLongestDailyStreak } from '../helpers/streak-calculator';

export interface TimeAnalysisResult {
    totalHours: number;
    longestDailyStreak: number;
}

function calculateLichessTimeFromPGN(pgn: string): number {
    const matches = [...pgn.matchAll(/\[%clk\s(\d+):(\d+):(\d+)\]/g)];
    if (matches.length < 2) return 0;
  
    const toSeconds = (h: number, m: number, s: number) =>
      h * 3600 + m * 60 + s;
  
    let total = 0;
  
    for (let i = 1; i < matches.length; i++) {
      const prev = matches[i - 1];
      const curr = matches[i];
  
      const prevSec = toSeconds(+prev[1], +prev[2], +prev[3]);
      const currSec = toSeconds(+curr[1], +curr[2], +curr[3]);
  
      const delta = prevSec - currSec;
  
      // Ignore nonsense (premoves, increments, resigns)
      if (delta > 0 && delta < 300) {
        total += delta;
      }
    }
  
    return total;
  }
  
/**
 * Analyzes time-related statistics including total hours played and daily streaks.
 */
export function analyzeTime(games: ChessGame[]): TimeAnalysisResult {
    let totalSeconds = 0;
    const uniqueDays = new Set<string>();

    games.forEach(game => {
        
        // Track unique playing days
        if (game.end_time) {
            const dayDate = new Date(game.end_time * 1000).toISOString().split('T')[0];
            uniqueDays.add(dayDate);
        }

        // Calculate total time played from PGN timestamps
        if (game.pgn) {
            // 🟢 LICHESS: use %clk timestamps
            if (game.pgn.includes('%clk')) {
              totalSeconds += calculateLichessTimeFromPGN(game.pgn);
            }
          
            // 🔵 CHESS.COM: legacy StartTime / EndTime
            else {
              const dateMatch = game.pgn.match(/\[Date "([^"]+)"\]/);
              const startMatch = game.pgn.match(/\[StartTime "([^"]+)"\]/);
              const endMatch = game.pgn.match(/\[EndTime "([^"]+)"\]/);
          
              if (dateMatch && startMatch && endMatch) {
                const date = dateMatch[1].replace(/\./g, '-');
                const start = startMatch[1];
                const end = endMatch[1];
          
                const startTime = new Date(`${date}T${start}Z`).getTime();
                const endTime = new Date(`${date}T${end}Z`).getTime();
                let diff = (endTime - startTime) / 1000;
          
                if (diff < 0) diff += 86400;
                if (diff > 0 && diff < 21600) {
                  totalSeconds += diff;
                }
              }
            }
          }
          
    });

    return {
        totalHours: Math.round(totalSeconds / 3600),
        longestDailyStreak: calculateLongestDailyStreak(uniqueDays)
    };
}
