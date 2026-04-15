export interface LichessUser {
    id: string;
    username: string;
    flair?: string;
    createdAt: number;
    playTime?: {
        total: number; // seconds
        tv: number;
      };
    profile?: {
      country?: string;
    };
    title?: string;
    perfs?: Record<string, unknown>;
  }
  
  export interface LichessGame {
    id: string;
    rated: boolean;
    speed: 'bullet' | 'blitz' | 'rapid' | 'classical';
    createdAt: number;
    lastMoveAt: number;
    pgn: string;
    fen?: string;
    players: {
      white: {
        user?: { name: string };
        rating: number;
        result: string;
      };
      black: {
        user?: { name: string };
        rating: number;
        result: string;
      };
    };
  }
  