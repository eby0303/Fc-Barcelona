import express from 'express';
import { updateData } from '../controllers/update';

const router = express.Router();

router.post('/', updateData);

export default router;