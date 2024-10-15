import { createClient } from 'redis';
import { redisUrl } from '../../cred.json';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => console.log('Redis connected.'))
  .catch(err => console.error('Redis connection error.', err));
