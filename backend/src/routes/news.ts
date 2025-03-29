import express from 'express';
import { getBarcaNews } from '../controllers/news';

const router = express.Router();

/**
 * @route GET /api/news
 * @desc Get Barcelona news articles
 * @queryParam includeToday - (optional) Include today's articles (default: false)
 * @access Public
 */
router.get('/', getBarcaNews);

export default router;