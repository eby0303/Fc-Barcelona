import { Schema, model, models } from 'mongoose';
import { TeamDocument } from '../types';

const TeamSchema = new Schema<TeamDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  crest: { type: String, required: true },
  venue: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

export default models?.Team || model<TeamDocument>('Team', TeamSchema);