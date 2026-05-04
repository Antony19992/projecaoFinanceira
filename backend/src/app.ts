import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { requireAuth } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api', requireAuth, routes);

export default app;
