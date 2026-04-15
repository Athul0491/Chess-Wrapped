import { ChessGame } from '@/types';
import { LichessGame } from './types';

function parseResult(pgn: string, isWhite: boolean): 'win' | 'loss' | 'draw' {
  const match = pgn.match(/\[Result "([^"]+)"\]/);
  if (!match) return 'draw';

  switch (match[1]) {
    case '1-0':
      return isWhite ? 'win' : 'loss';

    case '0-1':
      return isWhite ? 'loss' : 'win';

    case '1/2-1/2':
    case '*':
    default:
      return 'draw';
  }
}

function normalizeTimeClass(speed: string): ChessGame['time_class'] {
  switch (speed) {
    case 'ultraBullet':
      return 'bullet';

    case 'bullet':
    case 'blitz':
    case 'rapid':
      return speed;

    case 'classical':
      return 'rapid';

    case 'correspondence':
      return 'daily';

    default:
      return 'rapid';
  }
}

export function mapLichessGame(game: LichessGame): ChessGame {
  return {
    url: `https://lichess.org/${game.id}`,
    pgn: game.pgn,
    fen: game.fen || '',
    rated: game.rated,
    end_time: Math.floor(game.lastMoveAt / 1000),

    time_class: normalizeTimeClass(game.speed),
    time_control: game.speed,

    initial_setup: '',

    white: {
      username: game.players.white.user?.name || 'anonymous',
      rating: game.players.white.rating ?? 0,
      result: parseResult(game.pgn, true),
    },

    black: {
      username: game.players.black.user?.name || 'anonymous',
      rating: game.players.black.rating ?? 0,
      result: parseResult(game.pgn, false),
    },
  };
}
