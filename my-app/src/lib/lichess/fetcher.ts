import { LichessUser, LichessGame } from './types';
import { WRAPPED_YEAR } from './constants';

const BASE = 'https://lichess.org/api';

export async function fetchLichessProfile(username: string): Promise<LichessUser> {
  const res = await fetch(`${BASE}/user/${encodeURIComponent(username)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error('Lichess user not found');
  return res.json();
}

export async function fetchLichessGamesForYear(
  username: string,
  year = WRAPPED_YEAR
): Promise<LichessGame[]> {
  const since = Date.UTC(year, 0, 1);
  const until = Date.UTC(year, 11, 31, 23, 59, 59);
  const params = new URLSearchParams({
    since: String(since),
    until: String(until),
    rated: 'true',
    pgnInJson: 'true',
    clocks: 'true',
    opening: 'true',
    perfType: 'bullet,blitz,rapid,classical',
  });

  const res = await fetch(
    `${BASE}/games/user/${encodeURIComponent(username)}?${params.toString()}`,
    { headers: { Accept: 'application/x-ndjson' } }
  );

  if (!res.ok) throw new Error('Failed to fetch Lichess games');

  const text = await res.text();

  return text
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as LichessGame);
}
