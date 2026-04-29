import { Request, Response } from 'express';
import { getLatestUpdatedAt } from '../services/metaService';

export async function getMeta(req: Request, res: Response) {
  const { key, since } = req.query as { key?: string; since?: string };

  if (!key) {
    return res.status(400).json({ error: 'key is required' });
  }

  try {
    const latestUpdatedAt = await getLatestUpdatedAt(key);

    if (!since || !latestUpdatedAt) {
      return res.json({
        hasUpdates: true,
        latestUpdatedAt: latestUpdatedAt?.toISOString() ?? null,
      });
    }

    const sinceDate = new Date(since);
    const hasUpdates = latestUpdatedAt > sinceDate;

    return res.json({
      hasUpdates,
      latestUpdatedAt: latestUpdatedAt.toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
