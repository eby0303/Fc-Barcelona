import { Document } from 'mongoose';

export type MatchType = 'upcoming' | 'recent';

export interface TeamDocument extends Document {
  id: number;
  name: string;
  crest: string;
  venue: string;
  lastUpdated: Date;
}

export interface MatchDocument extends Document {
  matchId: number;
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  utcDate: string;
  status: string;
  matchday: number;
  competition: string;
  stage?: string;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  lastUpdated: Date;
}

export type PlayerStatus = 'available' | 'injured' | 'suspended';

export interface InjuryDetails {
  type?: string;
  returnDate?: string;
}

export interface PlayerDocument extends Document {
  id: number;
  name: string;
  position: string;
  dateOfBirth?: string;
  nationality?: string;
  status: PlayerStatus;
  injuryDetails?: InjuryDetails;
  lastUpdated: Date;
}

export interface TeamStatsDocument extends Document {
  leaguePosition?: number;
  lastSeasonPosition?: number;
  points?: number;
  goalsScored?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  homeGoals?: number;
  awayGoals?: number;
  averagePossession?: number;
  leagueAveragePossession?: number;
  lastUpdated: Date;
}

export interface SeasonPerformanceDocument extends Document {
  position: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string[] | null;
  lastUpdated: Date;
}

// export interface SquadHealthDocument extends Document {
//   availablePlayers: number;
//   injuredPlayers: Types.ObjectId[];
//   suspendedPlayers: Types.ObjectId[];
//   lastUpdated: Date;
//   fatigueLevel: number;
//   positionAvailability: {
//     defenders: { available: number; total: number };
//     midfielders: { available: number; total: number };
//     forwards: { available: number; total: number };
//   };
// }