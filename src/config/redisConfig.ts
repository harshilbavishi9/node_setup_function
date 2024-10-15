import { createClient } from 'redis';
import logger from '../utils/winston';
import { redisUrl } from '../../cred.json';
import { resMessages } from '../utils/resMessages';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => logger.info(resMessages.REDIS_CONNECTED))
  .catch(err => logger.error('Redis connection error.', err));
