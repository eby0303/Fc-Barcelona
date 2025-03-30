import { Request, Response } from 'express';
import SeasonPerformance from '../models/SeasonPerformance';
import Team from '../models/Team';
import { getCachedTeamStats, scrapeTeamStats } from '../services/scrapeService';
import { updateSeasonPerformance } from '../services/dataUpdateService';

export const getSeasonStats = async (req: Request, res: Response) => {
  try {
    // This will automatically handle the 24h check and delete/insert if needed
    await updateSeasonPerformance();
    
    const seasonPerformance = await SeasonPerformance.findOne();
    
    if (!seasonPerformance) {
      return res.status(404).json({ message: 'Season performance data not found' });
    }

    res.json(seasonPerformance);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching season stats',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const getTeamStats = async (req: Request, res: Response) => {
  try {
    const cachedData = getCachedTeamStats();
    if (cachedData) {
      return res.json(cachedData);
    }

    const teamStats = await scrapeTeamStats();
    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching team stats',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const getTeamInfo = async (req: Request, res: Response) => {
  try {
    const team = await Team.findOne({ name: 'FC Barcelona' });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found in database'
      });
    }

    res.json({
      success: true,
      data: {
        name: team.name,
        crest: team.crest,
        venue: team.venue,
        founded: team.founded,
        lastUpdated: team.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};