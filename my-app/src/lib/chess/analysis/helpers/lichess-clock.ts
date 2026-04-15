/**
 * Extracts total thinking time from Lichess PGN clock annotations.
 * Supports [%clk M:SS] and [%clk H:MM:SS] tags.
 */
export function calculateLichessTimeFromPGN(pgn: string): number {
  const clockRegex = /\[%clk\s+((?:(\d+):)?(\d+):(\d+))\]/g;
  const clocks: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = clockRegex.exec(pgn)) !== null) {
    const hours = match[2] ? parseInt(match[2], 10) : 0;
    const minutes = parseInt(match[3], 10);
    const seconds = parseInt(match[4], 10);
    clocks.push(hours * 3600 + minutes * 60 + seconds);
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
