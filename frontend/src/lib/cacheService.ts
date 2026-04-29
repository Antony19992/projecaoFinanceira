interface CacheEntry<T> {
  data: T;
  serverUpdatedAt: string;
  cachedAt: number;
}

const PREFIX = 'radar_cache_';

export const cacheService = {
  get<T>(key: string): CacheEntry<T> | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw) as CacheEntry<T>;
    } catch {
      return null;
    }
  },

  set<T>(key: string, data: T, serverUpdatedAt: string): void {
    try {
      const entry: CacheEntry<T> = { data, serverUpdatedAt, cachedAt: Date.now() };
      localStorage.setItem(PREFIX + key, JSON.stringify(entry));
    } catch {
      // storage full or unavailable
    }
  },

  invalidate(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  invalidatePattern(prefix: string): void {
    const toRemove = Object.keys(localStorage).filter((k) =>
      k.startsWith(PREFIX + prefix)
    );
    toRemove.forEach((k) => localStorage.removeItem(k));
  },
};
