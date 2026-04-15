import { LichessUser, LichessGame } from './types';

const BASE = 'https://lichess.org/api';

export async function fetchLichessProfile(username: string): Promise<LichessUser> {
  const res = await fetch(`${BASE}/user/${username}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error('Lichess user not found');
  return res.json();
}

export async function fetchLichessGames2025(username: string): Promise<LichessGame[]> {
  const since = new Date('2025-01-01').getTime();
  const until = new Date('2025-12-31T23:59:59').getTime();

  const res = await fetch(
    `${BASE}/games/user/${username}?since=${since}&until=${until}&rated=true&pgnInJson=true`,
    { headers: { Accept: 'application/x-ndjson' } }
  );

  if (!res.ok) throw new Error('Failed to fetch Lichess games');

  const text = await res.text();

  return text
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

/* 🔥 NEW: optional account fetch */
export async function fetchLichessAccount() {
  const token = process.env.LICHESS_TOKEN;
  if (!token) return null;

  const res = await fetch(`${BASE}/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) return null;
  return res.json();
}
