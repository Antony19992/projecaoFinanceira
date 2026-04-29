import axios from 'axios';
import { cacheService } from './cacheService';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function fetchMeta(
  key: string,
  since: string,
): Promise<{ hasUpdates: boolean; latestUpdatedAt: string | null }> {
  const res = await axios.get(`${BASE_URL}/meta`, { params: { key, since } });
  return res.data;
}

function revalidateBackground<T>(
  cacheKey: string,
  serverUpdatedAt: string,
  fetcher: () => Promise<T>,
  onUpdate: (data: T) => void,
): void {
  fetchMeta(cacheKey, serverUpdatedAt)
    .then(async ({ hasUpdates, latestUpdatedAt }) => {
      if (!hasUpdates) return;
      const fresh = await fetcher();
      cacheService.set(cacheKey, fresh, latestUpdatedAt ?? new Date().toISOString());
      onUpdate(fresh);
    })
    .catch(() => {
      // background revalidation failed — cached data stays
    });
}

export const apiService = {
  async getCached<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    onUpdate: (data: T) => void,
  ): Promise<T> {
    const cached = cacheService.get<T>(cacheKey);

    if (cached) {
      revalidateBackground(cacheKey, cached.serverUpdatedAt, fetcher, onUpdate);
      return cached.data;
    }

    const data = await fetcher();
    cacheService.set(cacheKey, data, new Date().toISOString());
    return data;
  },

  invalidate(key: string): void {
    cacheService.invalidate(key);
  },

  invalidatePattern(prefix: string): void {
    cacheService.invalidatePattern(prefix);
  },
};
