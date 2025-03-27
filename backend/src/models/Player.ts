import { Schema, model, models } from 'mongoose';
import { PlayerDocument } from '../types';

const PlayerSchema = new Schema<PlayerDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  dateOfBirth: { type: String },
  nationality: { type: String },
  status: {
    type: String,
    enum: ['available', 'injured', 'suspended'],
    default: 'available'
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default models?.Player || model<PlayerDocument>('Player', PlayerSchema);