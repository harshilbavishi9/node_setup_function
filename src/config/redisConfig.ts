import { createClient } from 'redis';
import { appConfig } from './appConfig';

export const redisClient = createClient({
  url: appConfig.redisUrl,
});

redisClient
  .connect()
  .then(() => console.log('Redis connected.'))
  .catch(err => console.error('Redis connection error.', err));
