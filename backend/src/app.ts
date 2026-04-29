import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
