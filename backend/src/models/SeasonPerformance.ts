import { Schema, model, models } from 'mongoose';
import { SeasonPerformanceDocument } from '../types';

const SeasonPerformanceSchema = new Schema<SeasonPerformanceDocument>({
  position: { type: Number, required: true },
  points: { type: Number, required: true },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },
  form: { type: [String], default: null },
  lastUpdated: { type: Date, default: Date.now }
});

export default models?.SeasonPerformance || 
       model<SeasonPerformanceDocument>('SeasonPerformance', SeasonPerformanceSchema);