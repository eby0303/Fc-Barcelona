import { Schema, model, models } from 'mongoose';
import { MatchDocument } from '../types';

const MatchSchema = new Schema<MatchDocument>({
  matchId: { type: Number, required: true },
  utcDate: { type: String, required: true },
  status: { type: String, required: true },
  matchday: { type: Number, required: true },
  competition: { type: String, required: true },
  stage: { type: String, required: false },
  homeTeam: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    crest: { type: String, required: true }
  },
  awayTeam: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    crest: { type: String, required: true }
  },
  score: {
    fullTime: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    },
    halfTime: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    }
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default models?.Match || model<MatchDocument>('Match', MatchSchema);