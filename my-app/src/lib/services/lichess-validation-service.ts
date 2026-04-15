import { WRAPPED_YEAR } from '@/lib/lichess/constants';

export class LichessValidationService {
  static async validateUser(username: string) {
    const res = await fetch(`https://lichess.org/api/user/${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/json' },
    });

    if (res.status === 404) {
      return { valid: false, error: 'User not found on Lichess' };
    }

    if (!res.ok) {
      return { valid: false, error: 'Lichess API error' };
    }

    return { valid: true, username };
  }

  static async hasGamesForYear(username: string, year = WRAPPED_YEAR) {
    const since = Date.UTC(year, 0, 1);
    const until = Date.UTC(year, 11, 31, 23, 59, 59);
    const params = new URLSearchParams({
      since: String(since),
      until: String(until),
      max: '1',
      rated: 'true',
      perfType: 'bullet,blitz,rapid,classical',
    });

    const res = await fetch(
      `https://lichess.org/api/games/user/${encodeURIComponent(username)}?${params.toString()}`,
      { headers: { Accept: 'application/x-ndjson' } }
    );

    if (!res.ok) {
      return { valid: false, error: 'Lichess API error' };
    }

    const text = await res.text();

    return text.trim().length > 0
      ? { valid: true, username }
      : { valid: false, error: `No rated standard games found for ${year}` };
  }

  static async validateComplete(username: string, year = WRAPPED_YEAR) {
    const userCheck = await this.validateUser(username);
    if (!userCheck.valid) return userCheck;

    return this.hasGamesForYear(userCheck.username!, year);
  }
}
