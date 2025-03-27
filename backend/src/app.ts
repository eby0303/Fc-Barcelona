import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import matchesRouter from './routes/matches';
import playersRouter from './routes/players';
import statsRouter from './routes/stats';
import teamRouter from './routes/teaminfo';
// import updateRouter from './routes/update';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/matches', matchesRouter);
app.use('/api/players', playersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/team-info', teamRouter);
// app.use('/api/update', updateRouter);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});