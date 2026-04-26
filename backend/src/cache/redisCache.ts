import type { Cache } from "./cache.js";

export class RedisCache implements Cache {
  constructor(private readonly redisUrl?: string) {}

  async get<T>(_key: string): Promise<T | null> {
    void this.redisUrl;
    return null;
  }

  async set<T>(_key: string, _value: T, _ttlSeconds: number): Promise<void> {
    // TODO: Wire ioredis/node-redis in production when REDIS_URL is configured.
  }

  async delete(_key: string): Promise<void> {
    // TODO: Wire ioredis/node-redis in production when REDIS_URL is configured.
  }
}
