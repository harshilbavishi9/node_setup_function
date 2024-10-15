import logger from './winston';
import { Response } from 'express';
import { errorCodes } from './errorCodes';

export const handleError = (res: Response, message: string, statusCode: number) => {
  logger.error(message);
  return res.status(statusCode).json({ message });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSuccess = (res: Response, data: any, message: string = 'Success', statusCode: number = errorCodes.SUCCESS) => {
  logger.info(message);
  return res.status(statusCode).json({ message, data });
};
