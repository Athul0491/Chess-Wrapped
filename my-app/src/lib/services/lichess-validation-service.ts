// lib/services/lichess-validation-service.ts
export class LichessValidationService {
    static async validateUser(username: string) {
      const res = await fetch(`https://lichess.org/api/user/${username}`, {
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
  
    static async hasGamesForYear(username: string, year = 2025) {
      const since = Date.UTC(year, 0, 1);
      const until = Date.UTC(year, 11, 31, 23, 59, 59);
  
      const res = await fetch(
        `https://lichess.org/api/games/user/${username}?since=${since}&until=${until}&max=1`,
        { headers: { Accept: 'application/x-ndjson' } }
      );
  
      const text = await res.text();
  
      return text.trim().length > 0
        ? { valid: true, username }
        : { valid: false, error: `No games found for ${year}` };
    }
  
    // 🔥 THIS is what your hook expects
    static async validateComplete(username: string, year = 2025) {
      const userCheck = await this.validateUser(username);
      if (!userCheck.valid) return userCheck;
  
      return this.hasGamesForYear(userCheck.username!, year);
    }
  }
  