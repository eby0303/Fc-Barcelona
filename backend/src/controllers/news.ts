import { Request, Response } from 'express';
import { scrapeBarcaNews } from '../services/barcaNewsScraper';

export const getBarcaNews = async (req: Request, res: Response) => {
  try {
    // Get optional query parameter for including today's articles
    const includeToday = req.query.includeToday === 'true';
    const news = await scrapeBarcaNews(includeToday);
    
    res.json({
      success: true,
      data: news,
      message: 'News fetched successfully'
    });
  } catch (error) {
    console.error('Error in getBarcaNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error scraping Barcelona news',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};