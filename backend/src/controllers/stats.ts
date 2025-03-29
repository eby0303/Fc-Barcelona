import { Request, Response } from 'express';
import SeasonPerformance from '../models/SeasonPerformance';
import Team from '../models/Team';
import { getCachedTeamStats, scrapeTeamStats } from '../services/scrapeService';
// import { updateAllData } from '../services/dataUpdateService';

export const getSeasonStats = async (req: Request, res: Response) => {
  try {
    let seasonPerformance = await SeasonPerformance.findOne();
    
    const updateInterval = parseInt(process.env.UPDATE_INTERVAL!, 10);
    if (!seasonPerformance || (Date.now() - seasonPerformance.lastUpdated.getTime()) > updateInterval) {
      console.log('Updating season stats...');
    //   await updateAllData();
      seasonPerformance = await SeasonPerformance.findOne();
    }

    res.json(seasonPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching season stats' });
  }
};

export const getTeamStats = async (req: Request, res: Response) => {
  try {
    const cachedData = getCachedTeamStats();
    if (cachedData) {
      console.log('📂 Serving cached data');
      return res.json(cachedData);
    }

    console.log('🔄 No cache found, scraping data...');
    const teamStats = await scrapeTeamStats();
    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team stats' });
  }
};


// export const getSquadHealth = async (req: Request, res: Response) => {
//   try {
//     const players = await Player.find();
    
//     const squadHealth = {
//       availablePlayers: players.filter(p => p.status === 'available').length,
//       injuredPlayers: players.filter(p => p.status === 'injured').map(p => p._id),
//       suspendedPlayers: players.filter(p => p.status === 'suspended').map(p => p._id),
//       positionAvailability: {
//         defenders: {
//           available: players.filter(p => p.position.includes('Defender') && p.status === 'available').length,
//           total: players.filter(p => p.position.includes('Defender')).length
//         },
//         midfielders: {
//           available: players.filter(p => p.position.includes('Midfielder') && p.status === 'available').length,
//           total: players.filter(p => p.position.includes('Midfielder')).length
//         },
//         forwards: {
//           available: players.filter(p => p.position.includes('Forward') && p.status === 'available').length,
//           total: players.filter(p => p.position.includes('Forward')).length
//         }
//       },
//       lastUpdated: new Date()
//     };

//     res.json(squadHealth);
//   } catch (error) {
//     res.status(500).json({ message: 'Error calculating squad health' });
//   }
// };


export const getSeasonPerformance = async (req: Request, res: Response) => {
  try {
    let performance = await SeasonPerformance.findOne().sort({ lastUpdated: -1 });
    
    const updateInterval = parseInt(process.env.UPDATE_INTERVAL!, 10);
    if (!performance || (Date.now() - performance.lastUpdated.getTime()) > updateInterval) {
      console.log('Updating season performance data...');
      // await updateAllData();
      performance = await SeasonPerformance.findOne().sort({ lastUpdated: -1 });
    }

    res.json({
      success: true,
      data: performance,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching season performance',
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