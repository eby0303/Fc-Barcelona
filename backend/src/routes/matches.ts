import express from 'express';
import { getRecentMatches, getUpcomingMatches } from '../controllers/matches';

const router = express.Router();

router.get('/recent', getRecentMatches);
router.get('/upcoming', getUpcomingMatches);

export default router;