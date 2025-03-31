import { Request, Response } from 'express';
import Match from '../models/Match';
import { updateMatches } from '../services/dataUpdateService';

export const getRecentMatches = async (req: Request, res: Response) => {
  try {
    // This will automatically handle the 24h check and delete/insert if needed
    await updateMatches();
    
    const matches = await Match.find({ status: 'FINISHED' })
      .sort({ utcDate: -1 })
      .limit(10);
      
    res.json(matches);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching recent matches',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const getUpcomingMatches = async (req: Request, res: Response) => {
  try {
    // This will automatically handle the 24h check and delete/insert if needed
    await updateMatches();
    
    const matches = await Match.find({ status: 'TIMED' })
      .sort({ utcDate: 1 })
      .limit(10);
      
    res.json(matches);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching upcoming matches',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};