/**
 * Extracts total thinking time (in seconds) from Lichess PGN clock annotations.
 * Uses [%clk M:SS] tags.
 */
export function calculateLichessTimeFromPGN(pgn: string): number {
    const clockRegex = /\[%clk\s+(\d+):(\d+)\]/g;
  
    const clocks: number[] = [];
    let match: RegExpExecArray | null;
  
    while ((match = clockRegex.exec(pgn)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      clocks.push(minutes * 60 + seconds);
    }
  
    if (clocks.length < 2) return 0;
  
    let total = 0;
  
    for (let i = 1; i < clocks.length; i++) {
      const diff = clocks[i - 1] - clocks[i];
      if (diff > 0 && diff < 600) {
        total += diff;
      }
    }
  
    return total;
  }
  