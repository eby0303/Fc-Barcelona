import { Request, Response } from 'express';
import { updateAllData } from '../services/dataUpdateService';

export const updateData = async (req: Request, res: Response) => {
  try {
    await updateAllData(); 
    res.json({ message: '✅ Data updated successfully' });
  } catch (error) {
    console.error("❌ Error updating data:", error);
    res.status(500).json({ message: '❌ Error updating data' });
  }
};
