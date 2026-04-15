import { UserData } from '@/types';
import { fetchLichessProfile, fetchLichessGamesForYear } from '@/lib/lichess/fetcher';
import { mapLichessGame } from '@/lib/lichess/mapper';
import { DEFAULT_LICHESS_AVATAR, LICHESS_FLAIR_BASE_URL, WRAPPED_YEAR } from '@/lib/lichess/constants';
import { analyzeGeneral } from '@/lib/chess/analysis/general';
import { analyzeElo } from '@/lib/chess/analysis/elo';
import { analyzeOpenings } from '@/lib/chess/analysis/openings';
import { analyzeFriends } from '@/lib/chess/analysis/social';
import { analyzeMatches } from '@/lib/chess/analysis/matches';

export async function generateLichessWrappedStats(username: string): Promise<UserData> {
  const profile = await fetchLichessProfile(username);
  const rawGames = await fetchLichessGamesForYear(username, WRAPPED_YEAR);
  const games = rawGames.map(mapLichessGame);

  const general = analyzeGeneral(games, username);
  const elo = analyzeElo(games, username);
  const openings = analyzeOpenings(games, username);
  const social = analyzeFriends(games, username);
  const matches = analyzeMatches(games, username);
  const avatarUrl = profile.flair
    ? `${LICHESS_FLAIR_BASE_URL}/${profile.flair}.webp`
    : DEFAULT_LICHESS_AVATAR;

  return {
    username: profile.username,
    avatarUrl,
    joinDate: Math.floor(profile.createdAt / 1000),
    status: 'lichess',
    ...general,
    ...elo,
    ...openings,
    topFriends: social.topFriends.map(friend => ({
      ...friend,
      avatarUrl: DEFAULT_LICHESS_AVATAR,
    })),
    impressiveMatches: matches.map(match => ({
      ...match,
      opponentAvatarUrl: DEFAULT_LICHESS_AVATAR,
    })),
    tournamentCount: 0,
    year: WRAPPED_YEAR,
  };
}
