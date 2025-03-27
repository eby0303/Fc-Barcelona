import express from 'express';
import { getSeasonStats, getTeamStats } from '../controllers/stats';

const router = express.Router();

router.get('/season', getSeasonStats);
// router.get('/squad-health', getSquadHealth);
router.get('/team', getTeamStats);

export default router;