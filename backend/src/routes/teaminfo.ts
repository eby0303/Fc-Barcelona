import express from 'express';
import { getTeamInfo } from '../controllers/Team';

const router = express.Router();

router.get('/', getTeamInfo);


export default router;