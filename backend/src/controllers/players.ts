import { Request, Response } from 'express';
import Player from '../models/Player';
import { connectDB } from '../config/db';
// import { updateAllData } from '../services/dataUpdateService';

export const getPlayers = async (req: Request, res: Response) => {
  try {
    await connectDB();
    let players = await Player.find();
    
    const updateInterval = parseInt(process.env.UPDATE_INTERVAL!, 10);
    if (players.length === 0 || (Date.now() - players[0].lastUpdated.getTime()) > updateInterval) {
      console.log('Updating player data...');
    //   await updateAllData();
      players = await Player.find();
    }

    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players' });
  }
};