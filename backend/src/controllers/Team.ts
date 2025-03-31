import Team from '../models/Team';
import { Request, Response } from 'express';


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
          id: team.id,
          name: team.name,
          crest: team.crest,
          venue: team.venue,
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

  