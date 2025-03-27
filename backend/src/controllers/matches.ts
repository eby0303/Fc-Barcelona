import { Request, Response } from 'express';
import Match from '../models/Match';

export const getRecentMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find({ status: 'FINISHED' }).sort({ date: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent matches' });
  }
};

export const getUpcomingMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find({ status: 'SCHEDULED' }).sort({ date: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming matches' });
  }
};