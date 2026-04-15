/**
 * Extracts and cleans the opening name from a PGN string.
 * Attempts to use the Lichess Opening tag first, then falls back to ECO.
 */
const ECO_MAP: Record<string, string> = {
  B10: 'Caro-Kann Defense',
  B20: 'Sicilian Defense',
  B30: 'Sicilian Defense',
  C00: 'French Defense',
  D00: "Queen's Pawn Game",
  D06: "Queen's Gambit",
  E20: 'Nimzo-Indian Defense',
  C44: 'Scotch Game',
  G20: "King's Gambit",
  B01: 'Scandinavian Defense',
  A00: 'Nimzo-Larsen Attack',
  A10: 'English Opening',
  B02: "Alekhine's Defense",
  C45: 'Scotch Game',
  B18: 'Caro-Kann Defense',
  C40: "Petrov's Defense",
  A01: 'Nimzo-Larsen Attack',
};

export function getOpeningFromPGN(pgn?: string): string {
  if (!pgn) return 'Unknown';

  const openingMatch = pgn.match(/\[Opening "([^"]+)"\]/);
  if (openingMatch?.[1]) {
    return openingMatch[1].trim();
  }

  const ecoMatch = pgn.match(/\[ECO "([^"]+)"\]/);
  if (ecoMatch?.[1]) {
    return ECO_MAP[ecoMatch[1]] ?? `ECO ${ecoMatch[1]}`;
  }

  return 'Unknown';
}
