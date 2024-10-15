import { createClient } from 'redis';
import logger from '../utils/winston';
import { redisUrl } from '../../cred.json';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => logger.info('Redis connected.'))
  .catch(err => logger.error('Redis connection error.', err));
