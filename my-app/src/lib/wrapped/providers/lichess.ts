import { UserData } from '@/types';
import { fetchLichessProfile, fetchLichessGames2025, fetchLichessAccount } from '@/lib/lichess/fetcher';
import { mapLichessGame } from '@/lib/lichess/mapper';
import { analyzeGeneral } from '@/lib/chess/analysis/general';
import { analyzeElo } from '@/lib/chess/analysis/elo';
import { analyzeOpenings } from '@/lib/chess/analysis/openings';
import { analyzeFriends } from '@/lib/chess/analysis/social';
import { analyzeMatches } from '@/lib/chess/analysis/matches';

export async function generateLichessWrappedStats(
    username: string
): Promise<UserData> {
    console.log('[WRAPPED] Using LICHESS provider for', username);
        
    const profile = await fetchLichessProfile(username);
    const rawGames = await fetchLichessGames2025(username);
    console.log('[LICHESS] raw games:', rawGames.length);

    const games = rawGames.map(mapLichessGame);
    console.log('[LICHESS] mapped games:', games.length);

    console.log('[LICHESS] sample mapped game:', games[0]);
    const general = analyzeGeneral(games, username);
    const elo = analyzeElo(games, username);
    const openings = analyzeOpenings(games, username);
    const social = analyzeFriends(games, username);
    const matches = analyzeMatches(games, username);
    const totalHours = profile.playTime
    ? Math.round(profile.playTime.total / 3600)
    : general.totalHours;
    return {
        username: profile.username,
        avatarUrl: `https://raw.githubusercontent.com/lichess-org/lila/refs/heads/master/public/flair/img/${profile.flair!}.webp`,
        joinDate: Math.floor(profile.createdAt / 1000),
        status: 'lichess',
        ...general,
        ...elo,
        ...openings,
        totalHours: totalHours,
        topFriends: social.topFriends,
        impressiveMatches: matches,
        tournamentCount: 0,
        year: 2025
    };
}
