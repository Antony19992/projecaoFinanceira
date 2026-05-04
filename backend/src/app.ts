import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { requireAuth } from './middleware/auth';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: [
    'https://projecao-financeira-kappa.vercel.app',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api', requireAuth, routes);

export default app;
